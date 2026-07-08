import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/store/settings';
import { requestNotificationPermission, sendFeishuNotification } from '@/utils/notification';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const {
    browserNotification,
    feishuNotification,
    feishuWebhookUrl,
    setBrowserNotification,
    setFeishuNotification,
    setFeishuWebhookUrl,
  } = useSettingsStore();

  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleBrowserToggle = async (enabled: boolean) => {
    if (enabled) {
      const perm = await requestNotificationPermission();
      if (!perm) {
        alert('浏览器通知权限被拒绝，请在浏览器设置中手动开启');
        return;
      }
    }
    setBrowserNotification(enabled);
  };

  const handleTestFeishu = async () => {
    if (!feishuWebhookUrl) {
      setTestResult('error');
      setTimeout(() => setTestResult(null), 2000);
      return;
    }
    setTestLoading(true);
    try {
      const testTask = {
        id: 'test',
        title: '飞书通知测试',
        priority: 'medium' as const,
        status: 'pending' as const,
        taskType: 'short' as const,
        dueDate: new Date().toISOString().split('T')[0],
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        reminderTime: new Date().toISOString(),
        notes: '这是一条测试消息，用于验证飞书机器人 Webhook 配置是否正确',
        createdAt: new Date().toISOString(),
      };
      await sendFeishuNotification(testTask, feishuWebhookUrl);
      setTestResult('success');
    } catch {
      setTestResult('error');
    }
    setTestLoading(false);
    setTimeout(() => setTestResult(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.4)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[420px] max-w-[90vw] rounded-2xl p-6"
            style={{
              background: 'var(--cream-bg)',
              border: '1px solid var(--cream-border)',
              boxShadow: 'var(--shadow-2xl)',
            }}
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2
                className="m-0"
                style={{
                  fontFamily: "'Poppins',var(--font-sans)",
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--cream-dark)',
                }}
              >
                通知设置
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--cream-text-muted)',
                  cursor: 'pointer',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.5)' }}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: 'color-mix(in srgb, var(--warm-orange) 15%, transparent)' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--warm-orange)' }}>
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </div>
                  <div>
                    <p
                      className="m-0"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        color: 'var(--cream-dark)',
                      }}
                    >
                      浏览器通知
                    </p>
                    <p
                      className="m-0"
                      style={{
                        fontFamily: "'Lora',var(--font-sans)",
                        fontSize: '0.6875rem',
                        color: 'var(--cream-text-muted)',
                      }}
                    >
                      任务到期时弹出系统通知
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleBrowserToggle(!browserNotification)}
                  className="w-11 h-6 rounded-full relative transition-all"
                  style={{
                    background: browserNotification ? 'var(--warm-orange)' : 'var(--cream-border)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <motion.div
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
                    animate={{ left: browserNotification ? '22px' : '2px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.5)' }}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: 'color-mix(in srgb, var(--soft-blue) 15%, transparent)' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--soft-blue)' }}>
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p
                      className="m-0"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        color: 'var(--cream-dark)',
                      }}
                    >
                      飞书通知
                    </p>
                    <p
                      className="m-0"
                      style={{
                        fontFamily: "'Lora',var(--font-sans)",
                        fontSize: '0.6875rem',
                        color: 'var(--cream-text-muted)',
                      }}
                    >
                      发送任务提醒到飞书群
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFeishuNotification(!feishuNotification)}
                  className="w-11 h-6 rounded-full relative transition-all"
                  style={{
                    background: feishuNotification ? 'var(--soft-blue)' : 'var(--cream-border)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <motion.div
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
                    animate={{ left: feishuNotification ? '22px' : '2px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              <AnimatePresence>
                {feishuNotification && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.5)' }}>
                      <label
                        className="block mb-1.5"
                        style={{
                          fontFamily: "'Poppins',var(--font-sans)",
                          fontSize: '0.6875rem',
                          fontWeight: 500,
                          color: 'var(--cream-text-muted)',
                        }}
                      >
                        飞书机器人 Webhook 地址
                      </label>
                      <input
                        type="text"
                        value={feishuWebhookUrl}
                        onChange={(e) => setFeishuWebhookUrl(e.target.value)}
                        placeholder="https://open.feishu.cn/open-apis/bot/v2/hook/..."
                        className="w-full px-3 py-2 rounded-lg outline-none transition-all mb-2"
                        style={{
                          background: 'var(--cream-bg)',
                          border: '1px solid var(--cream-border)',
                          fontFamily: "'Poppins',var(--font-sans)",
                          fontSize: '0.75rem',
                          color: 'var(--cream-dark)',
                        }}
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleTestFeishu}
                          disabled={testLoading || !feishuWebhookUrl}
                          className="flex-1 px-3 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5"
                          style={{
                            background: 'var(--soft-blue)',
                            color: '#fff',
                            border: 'none',
                            fontFamily: "'Poppins',var(--font-sans)",
                            fontSize: '0.6875rem',
                            fontWeight: 500,
                            cursor: testLoading || !feishuWebhookUrl ? 'not-allowed' : 'pointer',
                            opacity: testLoading || !feishuWebhookUrl ? 0.6 : 1,
                          }}
                        >
                          {testLoading ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                          ) : testResult === 'success' ? (
                            '✓ 发送成功'
                          ) : testResult === 'error' ? (
                            '✗ 发送失败'
                          ) : (
                            '测试发送'
                          )}
                        </button>
                      </div>
                      <p
                        className="m-0 mt-2"
                        style={{
                          fontFamily: "'Lora',var(--font-sans)",
                          fontSize: '0.625rem',
                          color: 'var(--cream-text-muted)',
                          lineHeight: 1.5,
                        }}
                      >
                        在飞书群设置 → 群机器人 → 添加自定义机器人，获取 Webhook 地址
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--cream-border)' }}>
              <p
                className="m-0"
                style={{
                  fontFamily: "'Lora',var(--font-sans)",
                  fontSize: '0.6875rem',
                  color: 'var(--cream-text-muted)',
                  lineHeight: 1.6,
                }}
              >
                💡 提示：保持浏览器打开以确保提醒正常触发。任务到期时会同时发送浏览器通知和飞书消息（如已开启）。
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
