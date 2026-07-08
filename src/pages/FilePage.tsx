import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFileStore } from '@/store/file';
import type { FileItem, FileCategory, StorageLocation } from '@/types';

const categoryLabels: Record<FileCategory, { label: string; icon: string; color: string }> = {
  document: { label: '文档', icon: '📄', color: 'var(--soft-blue)' },
  image: { label: '图片', icon: '🖼️', color: 'var(--moss-green)' },
  video: { label: '视频', icon: '🎬', color: 'var(--warm-orange)' },
  audio: { label: '音频', icon: '🎵', color: 'var(--soft-blue)' },
  archive: { label: '压缩包', icon: '📦', color: 'var(--cream-text-muted)' },
  other: { label: '其他', icon: '📁', color: 'var(--cream-text-muted)' },
};

const storageOptions: { value: StorageLocation | 'all'; label: string; icon: string; color: string }[] = [
  { value: 'all', label: '全部', icon: '📁', color: 'var(--cream-text-muted)' },
  { value: 'cloud', label: '云端', icon: '☁️', color: 'var(--soft-blue)' },
  { value: 'local', label: '本地', icon: '💾', color: 'var(--moss-green)' },
];

export default function FilePage() {
  const { files, organizeFiles, deleteFile, searchFiles, selectedStorage, setSelectedStorage, getFilteredFiles } = useFileStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOrganizing, setIsOrganizing] = useState(false);

  const storageFiltered = getFilteredFiles();

  const categories = useMemo(() => {
    const cats = new Map<string, number>();
    cats.set('全部', storageFiltered.length);
    storageFiltered.forEach((f) => {
      const label = categoryLabels[f.category]?.label || '其他';
      cats.set(label, (cats.get(label) || 0) + 1);
    });
    return Array.from(cats.entries());
  }, [storageFiltered]);

  const filtered = useMemo(() => {
    let result = storageFiltered;
    if (searchQuery) {
      result = searchFiles(searchQuery);
    }
    if (selectedCategory !== '全部') {
      const cat = Object.entries(categoryLabels).find(([, v]) => v.label === selectedCategory)?.[0];
      if (cat) {
        result = result.filter((f) => f.category === cat);
      }
    }
    return result;
  }, [storageFiltered, searchQuery, selectedCategory, searchFiles]);

  const totalSize = useMemo(() => {
    return files.reduce((acc, f) => acc + f.size, 0);
  }, [files]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleOrganize = () => {
    setIsOrganizing(true);
    setTimeout(() => {
      organizeFiles();
      setIsOrganizing(false);
    }, 1500);
  };

  return (
    <div className="p-4 sm:p-6">
      <motion.div
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="relative w-full sm:w-auto">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--cream-text-muted)', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索文件..."
            className="w-full sm:w-64 h-11 pl-10 pr-4 rounded-xl outline-none"
            style={{
              background: 'var(--cream-bg)',
              border: '1px solid var(--cream-border)',
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '16px',
              color: 'var(--cream-dark)',
            }}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--cream-border)' }}>
            {storageOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedStorage(option.value)}
                className="flex-1 sm:flex-none px-3 h-11 flex items-center justify-center gap-1.5"
                style={{
                  background: selectedStorage === option.value ? option.color : 'transparent',
                  color: selectedStorage === option.value ? '#fff' : 'var(--cream-text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Poppins',var(--font-sans)",
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }}
              >
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
          <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--cream-border)' }}>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className="flex-1 sm:flex-none px-3 h-11 flex items-center justify-center"
              style={{
                background: viewMode === 'grid' ? 'var(--soft-blue)' : 'transparent',
                color: viewMode === 'grid' ? '#fff' : 'var(--cream-text-muted)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="flex-1 sm:flex-none px-3 h-11 flex items-center justify-center"
              style={{
                background: viewMode === 'list' ? 'var(--soft-blue)' : 'transparent',
                color: viewMode === 'list' ? '#fff' : 'var(--cream-text-muted)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          </div>
          <motion.button
            type="button"
            onClick={handleOrganize}
            disabled={isOrganizing}
            className="w-full sm:w-auto h-11 px-5 rounded-xl flex items-center justify-center gap-2"
            style={{
              background: isOrganizing ? 'var(--cream-border)' : 'var(--moss-green)',
              color: 'var(--text-on-primary)',
              border: 'none',
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: isOrganizing ? 'not-allowed' : 'pointer',
              boxShadow: isOrganizing ? 'none' : '0 4px 12px rgba(120,140,93,0.3)',
            }}
            whileTap={isOrganizing ? {} : { scale: 0.97 }}
          >
            {isOrganizing ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                整理中...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 3 21 3 21 8" />
                  <line x1="4" y1="20" x2="21" y2="3" />
                  <polyline points="21 16 21 21 16 21" />
                  <line x1="15" y1="15" x2="21" y2="21" />
                  <line x1="4" y1="4" x2="9" y2="9" />
                </svg>
                智能整理
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
      >
        {categories.map(([cat, count]) => (
          <motion.button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className="flex-shrink-0 px-4 h-11 rounded-xl flex items-center gap-2"
            style={{
              background: 'var(--cream-bg)',
              border: `1px solid ${selectedCategory === cat ? 'var(--soft-blue)' : 'var(--cream-border)'}`,
              cursor: 'pointer',
            }}
            whileTap={{ scale: 0.97 }}
          >
            <span style={{ fontSize: '1rem' }}>
              {Object.entries(categoryLabels).find(([, v]) => v.label === cat)?.[1].icon || '📁'}
            </span>
            <div className="text-left">
              <p
                className="m-0"
                style={{
                  fontFamily: "'Poppins',var(--font-sans)",
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'var(--cream-dark)',
                }}
              >
                {cat}
              </p>
              <p
                className="m-0"
                style={{
                  fontFamily: "'Lora',var(--font-sans)",
                  fontSize: '0.625rem',
                  color: 'var(--cream-text-muted)',
                }}
              >
                {count} 个文件
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.35 }}
      >
        <div className="flex items-center justify-between mb-3">
          <p
            className="m-0"
            style={{
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--cream-text-muted)',
            }}
          >
            共 {filtered.length} 个文件 · 总计 {formatSize(totalSize)}
          </p>
        </div>

        {viewMode === 'grid' ? (
          <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((file, index) => (
                <FileGridCard
                  key={file.id}
                  file={file}
                  index={index}
                  categoryInfo={categoryLabels[file.category] || categoryLabels.other}
                  formatSize={formatSize}
                  onDelete={deleteFile}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="hidden sm:block rounded-2xl overflow-hidden"
              style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)' }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-soft)' }}>
                    <th
                      className="text-left px-4 py-3"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.6875rem',
                        fontWeight: 500,
                        color: 'var(--cream-text-muted)',
                        borderBottom: '1px solid var(--cream-border)',
                      }}
                    >
                      文件名
                    </th>
                    <th
                      className="text-left px-4 py-3"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.6875rem',
                        fontWeight: 500,
                        color: 'var(--cream-text-muted)',
                        borderBottom: '1px solid var(--cream-border)',
                      }}
                    >
                      类型
                    </th>
                    <th
                      className="text-left px-4 py-3"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.6875rem',
                        fontWeight: 500,
                        color: 'var(--cream-text-muted)',
                        borderBottom: '1px solid var(--cream-border)',
                      }}
                    >
                      存储
                    </th>
                    <th
                      className="text-left px-4 py-3"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.6875rem',
                        fontWeight: 500,
                        color: 'var(--cream-text-muted)',
                        borderBottom: '1px solid var(--cream-border)',
                      }}
                    >
                      大小
                    </th>
                    <th
                      className="text-left px-4 py-3"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.6875rem',
                        fontWeight: 500,
                        color: 'var(--cream-text-muted)',
                        borderBottom: '1px solid var(--cream-border)',
                      }}
                    >
                      修改时间
                    </th>
                    <th
                      className="text-right px-4 py-3"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.6875rem',
                        fontWeight: 500,
                        color: 'var(--cream-text-muted)',
                        borderBottom: '1px solid var(--cream-border)',
                      }}
                    >
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((file, index) => (
                      <motion.tr
                        key={file.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03, duration: 0.3 }}
                        style={{ borderBottom: '1px solid var(--cream-border)' }}
                        className="group"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span style={{ fontSize: '1.125rem' }}>
                              {categoryLabels[file.category]?.icon || '📁'}
                            </span>
                            <span
                              style={{
                                fontFamily: "'Poppins',var(--font-sans)",
                                fontSize: '0.8125rem',
                                color: 'var(--cream-dark)',
                              }}
                            >
                              {file.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="px-2 py-0.5 rounded-full"
                            style={{
                              fontFamily: "'Poppins',var(--font-sans)",
                              fontSize: '0.625rem',
                              color: categoryLabels[file.category]?.color || 'var(--cream-text-muted)',
                              background: `color-mix(in srgb, ${categoryLabels[file.category]?.color || 'var(--cream-text-muted)'} 12%, transparent)`,
                            }}
                          >
                            {categoryLabels[file.category]?.label || '其他'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="px-2 py-0.5 rounded-full"
                            style={{
                              fontFamily: "'Poppins',var(--font-sans)",
                              fontSize: '0.625rem',
                              color: file.storageLocation === 'cloud' ? 'var(--soft-blue)' : 'var(--moss-green)',
                              background: `color-mix(in srgb, ${file.storageLocation === 'cloud' ? 'var(--soft-blue)' : 'var(--moss-green)'} 12%, transparent)`,
                            }}
                          >
                            {file.storageLocation === 'cloud' ? '☁️ 云端' : '💾 本地'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            style={{
                              fontFamily: "'Lora',var(--font-sans)",
                              fontSize: '0.75rem',
                              color: 'var(--cream-text-muted)',
                            }}
                          >
                            {formatSize(file.size)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            style={{
                              fontFamily: "'Lora',var(--font-sans)",
                              fontSize: '0.75rem',
                              color: 'var(--cream-text-muted)',
                            }}
                          >
                            {formatDate(file.modifiedAt)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => deleteFile(file.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--warm-orange)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                            </svg>
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </motion.div>
            <motion.div className="flex flex-col gap-3 sm:hidden">
              <AnimatePresence mode="popLayout">
                {filtered.map((file, index) => (
                  <FileListCard
                    key={file.id}
                    file={file}
                    index={index}
                    categoryInfo={categoryLabels[file.category] || categoryLabels.other}
                    formatSize={formatSize}
                    formatDate={formatDate}
                    onDelete={deleteFile}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </motion.div>

      {filtered.length === 0 && (
        <motion.div
          className="text-center py-16 rounded-2xl"
          style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p
            className="m-0"
            style={{
              fontFamily: "'Lora',var(--font-sans)",
              fontSize: '0.8125rem',
              color: 'var(--cream-text-muted)',
            }}
          >
            暂无文件
          </p>
        </motion.div>
      )}
    </div>
  );
}

function FileGridCard({
  file,
  index,
  categoryInfo,
  formatSize,
  onDelete,
}: {
  file: FileItem;
  index: number;
  categoryInfo: { label: string; icon: string; color: string };
  formatSize: (bytes: number) => string;
  onDelete: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="p-3 rounded-2xl group relative cursor-pointer"
      style={{
        background: 'var(--cream-bg)',
        border: '1px solid var(--cream-border)',
      }}
      whileTap={{ scale: 0.98 }}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(file.id);
        }}
        className="absolute top-2 right-2 w-8 h-8 rounded-lg flex items-center justify-center z-10"
        style={{
          background: 'rgba(217,119,87,0.1)',
          border: 'none',
          color: 'var(--warm-orange)',
          cursor: 'pointer',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <div className="absolute top-2 left-2">
        <span
          className="px-1.5 py-0.5 rounded text-xs"
          style={{
            fontFamily: "'Poppins',var(--font-sans)",
            fontSize: '0.5625rem',
            color: file.storageLocation === 'cloud' ? 'var(--soft-blue)' : 'var(--moss-green)',
            background: `color-mix(in srgb, ${file.storageLocation === 'cloud' ? 'var(--soft-blue)' : 'var(--moss-green)'} 15%, transparent)`,
          }}
        >
          {file.storageLocation === 'cloud' ? '☁️' : '💾'}
        </span>
      </div>
      <div
        className="w-full flex items-center justify-center mb-2 rounded-xl"
        style={{ aspectRatio: '1', background: `color-mix(in srgb, ${categoryInfo.color} 10%, transparent)` }}
      >
        <span style={{ fontSize: '2rem' }}>{categoryInfo.icon}</span>
      </div>
      <p
        className="m-0 truncate"
        style={{
          fontFamily: "'Poppins',var(--font-sans)",
          fontSize: '0.75rem',
          fontWeight: 500,
          color: 'var(--cream-dark)',
        }}
        title={file.name}
      >
        {file.name}
      </p>
      <p
        className="m-0"
        style={{
          fontFamily: "'Lora',var(--font-sans)",
          fontSize: '0.625rem',
          color: 'var(--cream-text-muted)',
        }}
      >
        {formatSize(file.size)}
      </p>
    </motion.div>
  );
}

function FileListCard({
  file,
  index,
  categoryInfo,
  formatSize,
  formatDate,
  onDelete,
}: {
  file: FileItem;
  index: number;
  categoryInfo: { label: string; icon: string; color: string };
  formatSize: (bytes: number) => string;
  formatDate: (dateStr: string) => string;
  onDelete: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="p-4 rounded-2xl"
      style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)' }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `color-mix(in srgb, ${categoryInfo.color} 10%, transparent)` }}
        >
          <span style={{ fontSize: '1.5rem' }}>{categoryInfo.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className="m-0 truncate"
              style={{
                fontFamily: "'Poppins',var(--font-sans)",
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: 'var(--cream-dark)',
              }}
              title={file.name}
            >
              {file.name}
            </p>
            <button
              type="button"
              onClick={() => onDelete(file.id)}
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--warm-orange)',
                cursor: 'pointer',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
              </svg>
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span
              className="px-2 py-0.5 rounded-full"
              style={{
                fontFamily: "'Poppins',var(--font-sans)",
                fontSize: '0.625rem',
                color: categoryInfo.color,
                background: `color-mix(in srgb, ${categoryInfo.color} 12%, transparent)`,
              }}
            >
              {categoryInfo.label}
            </span>
            <span
              className="px-2 py-0.5 rounded-full"
              style={{
                fontFamily: "'Poppins',var(--font-sans)",
                fontSize: '0.625rem',
                color: file.storageLocation === 'cloud' ? 'var(--soft-blue)' : 'var(--moss-green)',
                background: `color-mix(in srgb, ${file.storageLocation === 'cloud' ? 'var(--soft-blue)' : 'var(--moss-green)'} 12%, transparent)`,
              }}
            >
              {file.storageLocation === 'cloud' ? '☁️ 云端' : '💾 本地'}
            </span>
            <span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>
              {formatSize(file.size)}
            </span>
          </div>
          <p className="m-0 mt-1" style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.625rem', color: 'var(--cream-text-muted)' }}>
            {formatDate(file.modifiedAt)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
