import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import SettingsPanel from '@/components/SettingsPanel';
import LockScreen from '@/components/LockScreen';
import { useThemeStore } from '@/store/theme';
import { useDesktopScale } from '@/hooks/useDesktopScale';
import { useTaskReminder } from '@/hooks/useTaskReminder';
import { useDeviceDetect } from '@/hooks/useDeviceDetect';
import AIAssistant from '@/components/ai-assistant/AIAssistant';
import { AnimatePresence, motion } from 'framer-motion';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const initTheme = useThemeStore((state) => state.initTheme);
  const device = useDeviceDetect();

  useDesktopScale();
  useTaskReminder();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  const isMobile = !device.isDesktop;

  return (
    <div className="h-screen overflow-hidden" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {!isMobile && (
        <Sidebar
          isOpen={true}
          onClose={() => {}}
          onSettingsClick={() => setSettingsOpen(true)}
          isMobile={false}
        />
      )}

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

      <div className={`flex flex-col h-full ${isMobile ? 'ml-0' : 'ml-52'}`}>
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          showMenuButton={isMobile}
          onLockClick={() => setIsLocked(true)}
        />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <AIAssistant />
      <LockScreen isLocked={isLocked} onUnlock={() => setIsLocked(false)} />
    </div>
  );
}
