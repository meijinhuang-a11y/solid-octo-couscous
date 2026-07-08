import { useEffect, useState } from 'react';
import { useThemeStore } from '@/store/theme';
import { useLocation } from 'react-router-dom';

const pageTitleMap: Record<string, string> = {
  '/': '工作台',
  '/tasks': '每日计划',
  '/notes': '杂事记录',
  '/photo': '照片优化',
  '/copywriting': '文案优化',
  '/video': '视频优化',
  '/files': '文件整理',
  '/news': '行业日报',
  '/whitepaper': '白皮书',
  '/product-extractor': '选品中心',
  '/trending-video': '爆款视频趋势',
  '/trending-product': '爆款产品洞察',
};

interface TopBarProps {
  onMenuClick: () => void;
  showMenuButton?: boolean;
  onLockClick?: () => void;
}

export default function TopBar({ onMenuClick, showMenuButton = false, onLockClick }: TopBarProps) {
  const { toggleTheme, isDark } = useThemeStore();
  const location = useLocation();
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      setCurrentDate(`${year}年${month}月${day}日`);
    };
    updateDate();
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, []);

  const pageTitle = pageTitleMap[location.pathname] || '工作台';

  return (
    <header
      className="sticky top-0 flex items-center justify-between shrink-0 z-30 backdrop-blur-glass"
      style={{
        height: '44px',
        padding: showMenuButton ? '0 8px' : '0 16px',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        {showMenuButton && (
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors shrink-0"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--foreground)',
              cursor: 'pointer',
            }}
            aria-label="打开菜单"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        <h1
          id="page-title"
          className="truncate font-semibold"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: showMenuButton ? '0.875rem' : '0.9375rem',
            color: 'var(--foreground)',
          }}
        >
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <time
          className="whitespace-nowrap hidden sm:block"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.01em',
            color: 'var(--muted-foreground)',
          }}
        >
          {currentDate}
        </time>
        {onLockClick && (
          <button
            type="button"
            onClick={onLockClick}
            className="inline-flex items-center justify-center w-8 h-8 border border-border rounded-full transition-colors hover:bg-secondary"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--background) 80%, transparent)',
            }}
            aria-label="一键锁屏"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </button>
        )}
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex items-center justify-center w-8 h-8 border border-border rounded-full transition-colors hover:bg-secondary"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--background) 80%, transparent)',
          }}
          aria-label="切换日间/夜间模式"
        >
          {!isDark ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '10px',
            backgroundColor: 'color-mix(in srgb, var(--primary) 85%, transparent)',
            border: '1px solid color-mix(in srgb, var(--primary) 30%, transparent)',
            color: 'var(--primary-foreground)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.6875rem',
              fontWeight: 600,
            }}
          >
            U
          </span>
        </div>
      </div>
    </header>
  );
}
