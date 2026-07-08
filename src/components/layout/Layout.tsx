import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import SettingsPanel from '@/components/SettingsPanel';
import { useThemeStore } from '@/store/theme';
import { useDesktopScale } from '@/hooks/useDesktopScale';
import { useTaskReminder } from '@/hooks/useTaskReminder';
import { useDeviceDetect } from '@/hooks/useDeviceDetect';
import AIAssistant from '@/components/ai-assistant/AIAssistant';
import { AnimatePresence, motion } from 'framer-motion';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const initTheme = useThemeStore((state) => state.initTheme);
  const device = useDeviceDetect();

  useDesktopScale();
  useTaskReminder();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // 桌面端始终固定侧边栏，移动端使用抽屉
  const isMobile = !device.isDesktop;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* 桌面端：常驻固定侧边栏 */}
      {!isMobile && (
        <Sidebar
          isOpen={true}
          onClose={() => {}}
          onSettingsClick={() => setSettingsOpen(true)}
          isMobile={false}
        />
      )}

      {/* 移动端：抽屉式侧边栏 */}
      {isMobile && (
        <>
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onSettingsClick={() => setSettingsOpen(true)}
            isMobile={true}
          />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                className="fixed inset-0 z-40"
                style={{ background: 'rgba(0,0,0,0.35)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </AnimatePresence>
        </>
      )}

      {/* 主内容区域 */}
      <div className={isMobile ? 'ml-0' : 'ml-52'}>
        <TopBar onMenuClick={() => setSidebarOpen(true)} showMenuButton={isMobile} />
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>

      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <AIAssistant />
    </div>
  );
}
