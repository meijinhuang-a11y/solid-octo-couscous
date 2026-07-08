import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/Icon';

const navItems = [
  { key: 'dashboard', label: '工作台', path: '/', icon: 'dashboard' },
  { key: 'tasks', label: '每日计划', path: '/tasks', icon: 'tasks' },
  { key: 'notes', label: '杂事记录', path: '/notes', icon: 'notes' },
  { key: 'photo', label: '照片优化', path: '/photo', icon: 'photo' },
  { key: 'copywriting', label: '文案优化', path: '/copywriting', icon: 'copywriting' },
  { key: 'video', label: '视频优化', path: '/video', icon: 'video' },
  { key: 'files', label: '文件整理', path: '/files', icon: 'files' },
  { key: 'news', label: '行业日报', path: '/news', icon: 'news' },
  { key: 'whitepaper', label: '白皮书', path: '/whitepaper', icon: 'whitepaper' },
  { key: 'product-extractor', label: '商品提取', path: '/product-extractor', icon: 'product-extractor' },
  { key: 'trending-video', label: '爆款视频', path: '/trending-video', icon: 'trending-video' },
  { key: 'trending-product', label: '爆款产品', path: '/trending-product', icon: 'trending-product' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsClick: () => void;
  isMobile?: boolean;
}

export default function Sidebar({ isOpen, onClose, onSettingsClick, isMobile = false }: SidebarProps) {
  const location = useLocation();
  const [order, setOrder] = useState<string[]>(navItems.map((item) => item.key));
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [overKey, setOverKey] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState<'before' | 'after' | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-order');
    if (saved) {
      try {
        setOrder(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  const orderedItems = order
    .map((key) => navItems.find((item) => item.key === key))
    .filter(Boolean) as typeof navItems;

  const handleDragStart = (key: string) => {
    if (isMobile) return;
    setDragKey(key);
  };

  const handleDragOver = (e: React.DragEvent, key: string) => {
    if (isMobile) return;
    e.preventDefault();
    if (dragKey && dragKey !== key) {
      setOverKey(key);
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      setDragPosition(e.clientY < mid ? 'before' : 'after');
    }
  };

  const handleDragLeave = () => {
    setOverKey(null);
    setDragPosition(null);
  };

  const handleDrop = (key: string) => {
    if (isMobile) return;
    if (dragKey && dragKey !== key) {
      const newOrder = [...order];
      const dragIndex = newOrder.indexOf(dragKey);
      const overIndex = newOrder.indexOf(key);
      newOrder.splice(dragIndex, 1);
      const insertIndex = dragPosition === 'before' ? overIndex : overIndex + 1;
      newOrder.splice(insertIndex > dragIndex ? insertIndex - 1 : insertIndex, 0, dragKey);
      setOrder(newOrder);
      localStorage.setItem('sidebar-order', JSON.stringify(newOrder));
    }
    setDragKey(null);
    setOverKey(null);
    setDragPosition(null);
  };

  const handleDragEnd = () => {
    setDragKey(null);
    setOverKey(null);
    setDragPosition(null);
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div
        className="flex items-center px-4 shrink-0"
        style={{ height: '48px', borderBottom: '1px solid var(--sidebar-border)' }}
      >
        <span className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--primary)' }}
          />
          <span
            className="font-bold tracking-tight"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9375rem',
              color: 'var(--sidebar-foreground)',
            }}
          >
            工作站
          </span>
        </span>
      </div>

      {/* Nav */}
      <nav
        className="flex flex-col flex-1 overflow-y-auto px-3 pt-4 gap-1 no-scrollbar"
        aria-label="主导航"
      >
        {orderedItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.key}
              to={item.path}
              draggable={!isMobile}
              onDragStart={() => handleDragStart(item.key)}
              onDragOver={(e) => handleDragOver(e, item.key)}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(item.key)}
              onDragEnd={handleDragEnd}
              onClick={onClose}
              className={`flex items-center gap-2 rounded-md truncate transition-all duration-150
                ${isActive ? '' : 'hover:bg-sidebar-accent'}`}
              style={{
                padding: '7px 10px',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: isActive ? 'var(--sidebar-primary)' : 'var(--sidebar-foreground)',
                backgroundColor: isActive ? 'var(--sidebar-accent)' : 'transparent',
                textDecoration: 'none',
                borderLeft: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: isMobile ? 'pointer' : 'grab',
                opacity: dragKey === item.key ? 0.4 : 1,
                borderTop:
                  overKey === item.key && dragPosition === 'before'
                    ? '2px solid var(--primary)'
                    : '',
                borderBottom:
                  overKey === item.key && dragPosition === 'after'
                    ? '2px solid var(--primary)'
                    : '',
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon name={item.icon} size={16} />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
        <div className="flex-1" />
      </nav>

      {/* Footer */}
      <div
        className="p-3 shrink-0"
        style={{ padding: '8px 12px', borderTop: '1px solid var(--sidebar-border)' }}
      >
        <button
          type="button"
          onClick={onSettingsClick}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg transition-all mb-2"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--sidebar-foreground)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.75rem',
            fontWeight: 500,
            cursor: 'pointer',
            textAlign: 'left',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--sidebar-accent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span>设置</span>
        </button>
        <p
          className="m-0"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5625rem',
            color: 'var(--muted-foreground)',
            letterSpacing: '0.05em',
          }}
        >
          v1.0
        </p>
      </div>
    </>
  );

  // 移动端/平板端：抽屉式侧边栏
  if (isMobile) {
    return (
      <motion.aside
        className="fixed left-0 top-0 bottom-0 z-50 flex flex-col w-64"
        style={{
          backgroundImage:
            'linear-gradient(180deg, var(--sidebar) 0%, color-mix(in srgb, var(--sidebar) 95%, var(--primary)) 100%)',
          borderRight: '1px solid var(--sidebar-border)',
        }}
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {sidebarContent}
      </motion.aside>
    );
  }

  // 桌面端：常驻显示
  return (
    <aside
      className="fixed left-0 top-0 bottom-0 z-50 flex flex-col w-52"
      style={{
        backgroundImage:
          'linear-gradient(180deg, var(--sidebar) 0%, color-mix(in srgb, var(--sidebar) 95%, var(--primary)) 100%)',
        borderRight: '1px solid var(--sidebar-border)',
      }}
    >
      {sidebarContent}
    </aside>
  );
}
