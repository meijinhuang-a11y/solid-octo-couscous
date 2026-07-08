import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCopywritingStore } from '@/store/copywriting';
import { PLATFORM_SPECS, AI_MODELS, EXPORT_OPTIONS, VARIANT_SUFFIXES, MAX_VARIANTS } from '@/config/platform';
import type { CopywritingItem, CopywritingStyle, PlatformType, ExportFormat } from '@/types';

const styleOptions: { value: CopywritingStyle; label: string; icon: string }[] = [
  { value: 'marketing', label: '营销风格', icon: '🎯' },
  { value: 'xiaohongshu', label: '小红书风', icon: '🌸' },
  { value: 'douyin', label: '抖音口播', icon: '🎤' },
  { value: 'formal', label: '正式专业', icon: '📋' },
  { value: 'humorous', label: '幽默风趣', icon: '😄' },
  { value: 'emotional', label: '情感共鸣', icon: '💝' },
];

const deliverableFields: { key: 'title' | 'coverText' | 'detailText' | 'coverImagePrompt' | 'detailImagePrompt'; label: string; desc: string; accent: string }[] = [
  { key: 'title', label: '标题', desc: '吸引眼球的第一印象', accent: 'var(--warm-orange)' },
  { key: 'coverText', label: '首页文案', desc: '封面 / 首图配文', accent: 'var(--soft-blue)' },
  { key: 'detailText', label: '详情页文案', desc: '正文主体内容', accent: 'var(--moss-green)' },
  { key: 'coverImagePrompt', label: '首图提示词', desc: 'AI生成首图用', accent: 'var(--warm-orange)' },
  { key: 'detailImagePrompt', label: '详情图提示词', desc: 'AI生成详情图用', accent: 'var(--soft-blue)' },
];

const getExportFormats = (platform: PlatformType) =>
  EXPORT_OPTIONS.find((o) => o.platform === platform)?.formats ?? [];

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

const exportSingle = (item: CopywritingItem, versionIndex: number, format: ExportFormat) => {
  const d = item.deliverables?.[versionIndex];
  if (!d) return;
  const spec = item.platform ? PLATFORM_SPECS[item.platform] : null;
  const lines = [
    `# ${d.title}`,
    '',
    `平台：${spec?.name ?? '-'}    版本：V${versionIndex + 1}`,
    `原始文案：${item.original}`,
    '',
    `## 首页文案`, d.coverText, '',
    `## 详情页文案`, d.detailText, '',
    `## 首图提示词`, d.coverImagePrompt, '',
    `## 详情图提示词`, d.detailImagePrompt, '',
    `## 话题标签`, d.hashtags.join(' '), '',
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${spec?.name ?? '文案'}-V${versionIndex + 1}-${format}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const exportBatch = (item: CopywritingItem, format: ExportFormat) => {
  const list = item.deliverables ?? [];
  if (!list.length) return;
  const spec = item.platform ? PLATFORM_SPECS[item.platform] : null;
  const parts = list.map((d, i) => [
    `========== V${i + 1} ${VARIANT_SUFFIXES[i] ?? ''} ==========`,
    `标题：${d.title}`,
    `首页文案：${d.coverText}`,
    `详情页文案：${d.detailText}`,
    `首图提示词：${d.coverImagePrompt}`,
    `详情图提示词：${d.detailImagePrompt}`,
    `话题标签：${d.hashtags.join(' ')}`,
    '',
  ].join('\n'));
  const header = `# ${spec?.name ?? '文案'} 批量交付物（共 ${list.length} 版）\n导出格式：${format.toUpperCase()}\n原始文案：${item.original}\n\n`;
  const blob = new Blob([header + parts.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${spec?.name ?? '文案'}-批量-${format}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

function EditableField({ label, desc, value, accent, onSave }: {
  label: string; desc: string; value: string; accent: string; onSave: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [copied, setCopied] = useState(false);

  const save = () => {
    const v = draft.trim();
    if (v !== value) onSave(v);
    setEditing(false);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="px-2 py-0.5 rounded-full"
          style={{
            background: `color-mix(in srgb, ${accent} 15%, transparent)`,
            color: accent,
            fontFamily: "'Poppins',var(--font-sans)",
            fontSize: '0.625rem',
            fontWeight: 600,
          }}
        >
          {label}
        </span>
        <span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.625rem', color: 'var(--cream-text-muted)' }}>
          {desc}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <motion.button
            type="button"
            onClick={() => copyText(value).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1200); })}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'transparent', border: 'none', color: copied ? 'var(--moss-green)' : 'var(--cream-text-muted)', cursor: 'pointer' }}
            whileTap={{ scale: 0.9 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {copied ? <polyline points="20 6 9 17 4 12" /> : <rect x="9" y="9" width="13" height="13" rx="2" />}
            </svg>
          </motion.button>
          {!editing ? (
            <motion.button
              type="button"
              onClick={() => { setDraft(value); setEditing(true); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'transparent', border: 'none', color: 'var(--cream-text-muted)', cursor: 'pointer' }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </motion.button>
          ) : (
            <>
              <motion.button type="button" onClick={save} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'transparent', border: 'none', color: 'var(--moss-green)', cursor: 'pointer' }} whileTap={{ scale: 0.9 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </motion.button>
              <motion.button type="button" onClick={() => { setDraft(value); setEditing(false); }} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'transparent', border: 'none', color: 'var(--cream-text-muted)', cursor: 'pointer' }} whileTap={{ scale: 0.9 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.button>
            </>
          )}
        </div>
      </div>
      {editing ? (
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          rows={3}
          className="w-full px-3 py-2 rounded-xl outline-none resize-none"
          style={{
            background: 'rgba(255,255,255,0.9)',
            border: `1px solid ${accent}`,
            fontFamily: "'Lora',var(--font-sans)",
            fontSize: '0.8125rem',
            color: 'var(--cream-dark)',
            lineHeight: 1.6,
          }}
        />
      ) : (
        <div
          onClick={() => { setDraft(value); setEditing(true); }}
          className="px-3 py-2 rounded-xl cursor-text"
          style={{
            background: 'rgba(255,255,255,0.5)',
            border: '1px solid var(--cream-border)',
            fontFamily: "'Lora',var(--font-sans)",
            fontSize: '0.8125rem',
            color: 'var(--cream-dark)',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
          }}
        >
          {value || <span style={{ color: 'var(--cream-text-muted)' }}>点击输入...</span>}
        </div>
      )}
    </div>
  );
}

interface CopywritingCardProps {
  item: CopywritingItem;
  index: number;
  onDelete: (id: string) => void;
  onUpdateDeliverable: (id: string, versionIndex: number, updates: Partial<CopywritingItem['deliverables'] extends (infer U)[] ? U : never>) => void;
}

function CopywritingCard({ item, index, onDelete, onUpdateDeliverable }: CopywritingCardProps) {
  const [activeVersion, setActiveVersion] = useState(0);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');
  const deliverables = item.deliverables ?? [];
  const spec = item.platform ? PLATFORM_SPECS[item.platform] : null;
  const formats = getExportFormats(item.platform || 'xiaohongshu');
  const styleInfo = styleOptions.find((s) => s.value === item.style);
  const current = deliverables[activeVersion];

  return (
    <motion.div
      key={item.id}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="rounded-2xl p-4"
      style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)' }}
    >
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span style={{ fontSize: '1rem' }}>{styleInfo?.icon}</span>
          <span className="px-2 py-0.5 rounded-full" style={{ background: 'color-mix(in srgb, var(--soft-blue) 15%, transparent)', color: 'var(--soft-blue)', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.625rem', fontWeight: 500 }}>
            {styleInfo?.label}
          </span>
          {spec && (
            <span className="px-2 py-0.5 rounded-full" style={{ background: 'color-mix(in srgb, var(--moss-green) 15%, transparent)', color: 'var(--moss-green)', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.625rem', fontWeight: 500 }}>
              {spec.icon} {spec.name}
            </span>
          )}
          {deliverables.length > 1 && (
            <span className="px-2 py-0.5 rounded-full" style={{ background: 'rgba(167,139,250,0.1)', color: 'var(--lavender)', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.625rem', fontWeight: 500 }}>
              {deliverables.length}版
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            onClick={() => onDelete(item.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'transparent', border: 'none', color: 'var(--cream-text-muted)', cursor: 'pointer' }}
            whileTap={{ scale: 0.9 }}
            title="删除"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
            </svg>
          </motion.button>
        </div>
      </div>

      <div className="mb-3 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.4)', border: '1px solid var(--cream-border)' }}>
        <p className="m-0" style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.8125rem', color: 'var(--cream-dark)', lineHeight: 1.5 }}>
          {item.original}
        </p>
      </div>

      {deliverables.length > 0 ? (
        <>
          {deliverables.length > 1 && (
            <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {deliverables.map((_, i) => (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => setActiveVersion(i)}
                  className="flex-shrink-0 px-3 h-9 rounded-xl"
                  style={{
                    background: activeVersion === i ? 'var(--soft-blue)' : 'rgba(255,255,255,0.7)',
                    color: activeVersion === i ? '#fff' : 'var(--cream-text-muted)',
                    border: `1px solid ${activeVersion === i ? 'var(--soft-blue)' : 'var(--cream-border)'}`,
                    fontFamily: "'Poppins',var(--font-sans)",
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  V{i + 1}
                </motion.button>
              ))}
              <span className="flex-shrink-0 flex items-center" style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.625rem', color: 'var(--cream-text-muted)' }}>
                {VARIANT_SUFFIXES[activeVersion]}
              </span>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeVersion}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2.5"
            >
              {current && deliverableFields.map((f) => (
                <EditableField
                  key={f.key}
                  label={f.label}
                  desc={f.desc}
                  accent={f.accent}
                  value={current[f.key]}
                  onSave={(v) => onUpdateDeliverable(item.id, activeVersion, { [f.key]: v })}
                />
              ))}
              {current && <EditableHashtags value={current.hashtags} onSave={(v) => onUpdateDeliverable(item.id, activeVersion, { hashtags: v })} />}
            </motion.div>
          </AnimatePresence>

          {formats.length > 0 && (
            <div className="mt-3 pt-3 flex flex-col gap-2" style={{ borderTop: '1px solid var(--cream-border)' }}>
              <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <span className="flex-shrink-0 flex items-center" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.625rem', fontWeight: 500, color: 'var(--cream-text-muted)' }}>导出：</span>
                {formats.map((f) => (
                  <motion.button
                    key={f.format}
                    type="button"
                    onClick={() => setExportFormat(f.format)}
                    className="flex-shrink-0 px-2.5 h-9 rounded-xl"
                    style={{
                      background: exportFormat === f.format ? 'var(--warm-orange)' : 'rgba(255,255,255,0.7)',
                      color: exportFormat === f.format ? '#fff' : 'var(--cream-text-muted)',
                      border: `1px solid ${exportFormat === f.format ? 'var(--warm-orange)' : 'var(--cream-border)'}`,
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.625rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {f.label}
                  </motion.button>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <motion.button
                  type="button"
                  onClick={() => exportSingle(item, activeVersion, exportFormat)}
                  className="w-full sm:flex-1 h-10 px-3 rounded-xl flex items-center justify-center gap-1.5"
                  style={{
                    background: 'rgba(106,155,204,0.1)',
                    color: 'var(--soft-blue)',
                    border: '1px solid rgba(106,155,204,0.2)',
                    fontFamily: "'Poppins',var(--font-sans)",
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  导出当前版
                </motion.button>
                {deliverables.length > 1 && (
                  <motion.button
                    type="button"
                    onClick={() => exportBatch(item, exportFormat)}
                    className="w-full sm:flex-1 h-10 px-3 rounded-xl flex items-center justify-center gap-1.5"
                    style={{
                      background: 'var(--warm-orange)',
                      color: '#fff',
                      border: 'none',
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    批量导出
                  </motion.button>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.8125rem', color: 'var(--cream-text-muted)' }}>
          {item.optimized}
        </div>
      )}
    </motion.div>
  );
}

function EditableHashtags({ value, onSave }: { value: string[]; onSave: (v: string[]) => void; }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value.join(' '));

  const save = () => {
    const arr = draft.split(/[\s,，]+/).map((s) => s.trim().replace(/^#/, '')).filter(Boolean);
    onSave(arr);
    setEditing(false);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="px-2 py-0.5 rounded-full" style={{ background: 'color-mix(in srgb, var(--moss-green) 15%, transparent)', color: 'var(--moss-green)', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.625rem', fontWeight: 600 }}>
          话题标签
        </span>
        <span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.625rem', color: 'var(--cream-text-muted)' }}>
          {value.length} 个
        </span>
        <motion.button
          type="button"
          onClick={() => { setDraft(value.join(' ')); setEditing(true); }}
          className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'transparent', border: 'none', color: 'var(--cream-text-muted)', cursor: 'pointer' }}
          whileTap={{ scale: 0.9 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </motion.button>
      </div>
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          placeholder="空格或逗号分隔，如 好物分享 测评"
          className="w-full h-11 px-3 rounded-xl outline-none"
          style={{
            background: 'rgba(255,255,255,0.9)',
            border: '1px solid var(--moss-green)',
            fontFamily: "'Lora',var(--font-sans)",
            fontSize: '16px',
            color: 'var(--cream-dark)',
          }}
        />
      ) : (
        <div className="px-3 py-2 rounded-xl flex flex-wrap gap-1.5" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid var(--cream-border)', minHeight: '44px' }}>
          {value.length ? (
            value.map((h) => (
              <span key={h} className="px-2 py-0.5 rounded-full" style={{ background: 'color-mix(in srgb, var(--moss-green) 15%, transparent)', color: 'var(--moss-green)', fontFamily: "'Lora',var(--font-sans)", fontSize: '0.625rem' }}>
                #{h}
              </span>
            ))
          ) : (
            <span style={{ color: 'var(--cream-text-muted)', fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem' }}>点击添加标签...</span>
          )}
        </div>
      )}
    </div>
  );
}

export default function CopywritingPage() {
  const { copywritings, isGenerating, batchGenerate, updateDeliverable, deleteCopywriting } = useCopywritingStore();

  const [original, setOriginal] = useState('');
  const [style, setStyle] = useState<CopywritingStyle>('xiaohongshu');
  const [platform, setPlatform] = useState<PlatformType>('xiaohongshu');
  const [model, setModel] = useState('qwen-free');
  const [variantCount, setVariantCount] = useState(5);

  const textModels = useMemo(() => AI_MODELS.filter((m) => m.capabilities.includes('text')), []);
  const currentPlatformSpec = PLATFORM_SPECS[platform];

  const handleGenerate = () => {
    if (!original.trim()) return;
    batchGenerate({
      original: original.trim(),
      style,
      tags: [],
      platform,
      model,
      variantCount,
    });
    setOriginal('');
  };

  return (
    <div className="p-4 sm:p-6">
      <motion.div className="mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="m-0 mb-1" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '1.25rem', fontWeight: 600, color: 'var(--cream-dark)' }}>
          文案优化
        </h1>
        <p className="m-0" style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.8125rem', color: 'var(--cream-text-muted)' }}>
          通过描述生成文案，支持小红书、抖音等多平台，一次性产出多版
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <motion.div className="w-full sm:w-[420px] flex-shrink-0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }}>
          <div className="p-4 rounded-2xl" style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)' }}>
            <h3 className="m-0 mb-4 uppercase tracking-wide" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 600, color: 'var(--cream-dark)' }}>
              生成配置
            </h3>

            <div className="mb-4">
              <label className="block mb-2 uppercase tracking-wide" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, color: 'var(--cream-text-muted)' }}>
                文案描述
              </label>
              <textarea
                value={original}
                onChange={(e) => setOriginal(e.target.value)}
                placeholder="输入产品/内容描述，例如：蓝牙耳机，音质好，续航长，价格实惠"
                rows={4}
                className="w-full px-3.5 py-2.5 rounded-xl outline-none resize-none"
                style={{
                  background: 'rgba(255,255,255,0.7)',
                  border: '1px solid var(--cream-border)',
                  fontFamily: "'Lora',var(--font-sans)",
                  fontSize: '16px',
                  color: 'var(--cream-dark)',
                  lineHeight: 1.6,
                }}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 uppercase tracking-wide" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, color: 'var(--cream-text-muted)' }}>
                目标平台
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(PLATFORM_SPECS).map(([key, spec]) => (
                  <motion.button
                    key={key}
                    type="button"
                    onClick={() => setPlatform(key as PlatformType)}
                    className="flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-xl"
                    style={{
                      background: platform === key ? 'rgba(106,155,204,0.12)' : 'transparent',
                      border: `1px solid ${platform === key ? 'rgba(106,155,204,0.3)' : 'var(--cream-border)'}`,
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.6875rem',
                      color: platform === key ? 'var(--soft-blue)' : 'var(--cream-text-muted)',
                      cursor: 'pointer',
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span style={{ fontSize: '1.125rem' }}>{spec.icon}</span>
                    <span style={{ fontWeight: 500 }}>{spec.name}</span>
                  </motion.button>
                ))}
              </div>
              <div className="mt-2 p-2 rounded-lg" style={{ background: 'rgba(106,155,204,0.05)', border: '1px solid rgba(106,155,204,0.1)' }}>
                <div className="flex flex-wrap gap-3" style={{ fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>
                  <span>标题 ≤{currentPlatformSpec.titleMaxLength}字</span>
                  <span>正文 ≤{currentPlatformSpec.contentMaxLength}字</span>
                  <span>话题 ≤{currentPlatformSpec.hashtagLimit}个</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 uppercase tracking-wide" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, color: 'var(--cream-text-muted)' }}>
                文案风格
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {styleOptions.map((s) => (
                  <motion.button
                    key={s.value}
                    type="button"
                    onClick={() => setStyle(s.value)}
                    className="flex items-center gap-1.5 px-3 h-11 rounded-xl"
                    style={{
                      background: style === s.value ? 'rgba(106,155,204,0.12)' : 'transparent',
                      border: `1px solid ${style === s.value ? 'rgba(106,155,204,0.3)' : 'var(--cream-border)'}`,
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      color: style === s.value ? 'var(--soft-blue)' : 'var(--cream-text-muted)',
                      cursor: 'pointer',
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 uppercase tracking-wide" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, color: 'var(--cream-text-muted)' }}>
                AI模型
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {textModels.map((m) => (
                  <motion.button
                    key={m.id}
                    type="button"
                    onClick={() => setModel(m.id)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 h-11 rounded-xl"
                    style={{
                      background: model === m.id ? 'rgba(106,155,204,0.12)' : 'transparent',
                      border: `1px solid ${model === m.id ? 'rgba(106,155,204,0.3)' : 'var(--cream-border)'}`,
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      color: model === m.id ? 'var(--soft-blue)' : 'var(--cream-text-muted)',
                      cursor: 'pointer',
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span>{m.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: m.isFree ? 'rgba(138,191,146,0.15)' : 'rgba(217,119,87,0.15)', color: m.isFree ? 'var(--moss-green)' : 'var(--warm-orange)' }}>
                      {m.isFree ? '免费' : '付费'}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2 uppercase tracking-wide" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, color: 'var(--cream-text-muted)' }}>
                生成版数：{variantCount} 版
              </label>
              <input
                type="range"
                min={1}
                max={MAX_VARIANTS}
                value={variantCount}
                onChange={(e) => setVariantCount(parseInt(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, var(--soft-blue) ${((variantCount - 1) / (MAX_VARIANTS - 1)) * 100}%, rgba(106,155,204,0.15) ${((variantCount - 1) / (MAX_VARIANTS - 1)) * 100}%)`,
                }}
              />
              <div className="flex justify-between mt-1" style={{ fontSize: '0.625rem', color: 'var(--cream-text-muted)' }}>
                <span>1版</span>
                <span>{MAX_VARIANTS}版</span>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={handleGenerate}
              disabled={!original.trim() || isGenerating}
              className="w-full h-11 rounded-xl flex items-center justify-center gap-2"
              style={{
                background: !original.trim() || isGenerating ? 'rgba(106,155,204,0.4)' : 'var(--soft-blue)',
                color: '#fff',
                border: 'none',
                fontFamily: "'Poppins',var(--font-sans)",
                fontSize: '0.8125rem',
                fontWeight: 500,
                cursor: !original.trim() || isGenerating ? 'not-allowed' : 'pointer',
                boxShadow: !original.trim() || isGenerating ? 'none' : '0 4px 12px rgba(106,155,204,0.3)',
              }}
              whileTap={!original.trim() || isGenerating ? {} : { scale: 0.97 }}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  生成中...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="13" y="2" x2="20" y2="14" rx="2" ry="2" />
                    <path d="M20 16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h5" />
                  </svg>
                  生成 {variantCount} 版文案
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        <motion.div className="flex-1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35 }}>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="m-0 uppercase tracking-wide" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 600, color: 'var(--cream-dark)' }}>
              生成结果
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: 'rgba(106,155,204,0.1)', color: 'var(--soft-blue)' }}>
              {copywritings.length}
            </span>
          </div>

          {copywritings.length > 0 ? (
            <motion.div className="flex flex-col gap-4" layout>
              <AnimatePresence mode="popLayout">
                {copywritings.map((item, index) => (
                  <CopywritingCard
                    key={item.id}
                    item={item}
                    index={index}
                    onDelete={deleteCopywriting}
                    onUpdateDeliverable={updateDeliverable}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div className="text-center py-16 rounded-2xl" style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="m-0" style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.8125rem', color: 'var(--cream-text-muted)' }}>
                暂无文案，填写左侧配置后生成
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
