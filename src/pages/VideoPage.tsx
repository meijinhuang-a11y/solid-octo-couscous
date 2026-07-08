import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoStore } from '@/store/video';
import { PLATFORM_SPECS, AI_MODELS, VIDEO_FILTER_PRESETS, EXPORT_OPTIONS, VARIANT_NAMES, MAX_VARIANTS } from '@/config/platform';
import type { VideoItem, VideoAdjustParams, PlatformType, ExportFormat } from '@/types';

const defaultAdjustParams: VideoAdjustParams = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  speed: 1.0,
  volume: 100,
  filterPreset: 'none',
};

function FilterSlider({ label, value, min, max, step = 1, onChange, unit = '' }: { label: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void; unit?: string; }) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1.5">
        <span style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, color: 'var(--cream-text-muted)' }}>{label}</span>
        <span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--soft-blue)', fontWeight: 500 }}>{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, var(--soft-blue) ${((value - min) / (max - min)) * 100}%, rgba(106,155,204,0.15) ${((value - min) / (max - min)) * 100}%)` }}
      />
    </div>
  );
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}GB`;
};

export default function VideoPage() {
  const { videos, isGenerating, batchGenerate, updateVideo, deleteVideo } = useVideoStore();

  const [filter, setFilter] = useState<'all' | VideoItem['status']>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('douyin');
  const [selectedModel, setSelectedModel] = useState<string>('kling-free');
  const [prompt, setPrompt] = useState('');
  const [filterPreset, setFilterPreset] = useState('none');
  const [adjustParams, setAdjustParams] = useState<VideoAdjustParams>(defaultAdjustParams);
  const [variantCount, setVariantCount] = useState(5);

  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);
  const [modalAdjustParams, setModalAdjustParams] = useState<VideoAdjustParams>(defaultAdjustParams);
  const [modalExportFormat, setModalExportFormat] = useState<ExportFormat>('mp4');

  const videoModels = useMemo(() => AI_MODELS.filter((m) => m.capabilities.includes('video')), []);
  const currentPlatformSpec = PLATFORM_SPECS[selectedPlatform];

  const platformExportOptions = useMemo(() => {
    return EXPORT_OPTIONS.find((o) => o.platform === selectedPlatform)?.formats || [];
  }, [selectedPlatform]);

  const filteredVideos = useMemo(() => {
    let result = videos;
    if (filter !== 'all') {
      result = result.filter((v) => v.status === filter);
    }
    return result;
  }, [videos, filter]);

  const counts = useMemo(() => ({
    all: videos.length,
    original: videos.filter((v) => v.status === 'original').length,
    processing: videos.filter((v) => v.status === 'processing').length,
    enhanced: videos.filter((v) => v.status === 'enhanced').length,
  }), [videos]);

  const currentVideo = useMemo(() => {
    if (!selectedVideoId) return null;
    return videos.find((v) => v.id === selectedVideoId);
  }, [selectedVideoId, videos]);

  const buildCssFilter = (params: VideoAdjustParams) => {
    const { brightness, contrast, saturation } = params;
    return `brightness(${brightness / 100}) contrast(${contrast / 100}) saturate(${saturation / 100})`;
  };

  const currentPreviewVideo = useMemo(() => {
    if (!currentVideo) return null;
    if (currentVideo.batchVersions && currentVideo.batchVersions.length > 0) {
      return currentVideo.batchVersions[selectedVersionIndex];
    }
    return currentVideo;
  }, [currentVideo, selectedVersionIndex]);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    batchGenerate({
      prompt: prompt.trim(),
      platform: selectedPlatform,
      model: selectedModel,
      adjustParams: { ...adjustParams, filterPreset },
      variantCount,
    });
    setPrompt('');
    setAdjustParams(defaultAdjustParams);
    setFilterPreset('none');
  };

  const handleFilterPresetSelect = (presetId: string) => {
    setFilterPreset(presetId);
    const preset = VIDEO_FILTER_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setAdjustParams((prev) => ({ ...prev, ...preset.params } as VideoAdjustParams));
    }
  };

  const handleModalFilterPresetSelect = (presetId: string) => {
    const preset = VIDEO_FILTER_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setModalAdjustParams((prev) => ({ ...prev, ...preset.params } as VideoAdjustParams));
    }
  };

  const openModal = (video: VideoItem) => {
    setSelectedVideoId(video.id);
    const targetVersion = video.batchVersions?.[0] || video;
    setModalAdjustParams(targetVersion.adjustParams || defaultAdjustParams);
    setModalExportFormat(targetVersion.exportFormat || 'mp4');
    setSelectedVersionIndex(0);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVideoId(null);
    setSelectedVersionIndex(0);
  };

  const handleApplyAdjust = () => {
    if (!selectedVideoId || !currentVideo) return;
    updateVideo(selectedVideoId, {
      adjustParams: modalAdjustParams,
      exportFormat: modalExportFormat,
      status: 'enhanced',
    });
  };

  return (
    <div className="p-4 sm:p-6">
      <motion.div className="mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="m-0 mb-1" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '1.25rem', fontWeight: 600, color: 'var(--cream-dark)' }}>
          视频优化
        </h1>
        <p className="m-0" style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.8125rem', color: 'var(--cream-text-muted)' }}>
          通过描述或上传demo生成视频，支持批量生成多版，可调参数
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
                视频描述
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="输入你想要生成的视频描述，例如：一只可爱的猫咪在阳光下玩耍，温馨治愈风格"
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
                    onClick={() => setSelectedPlatform(key as PlatformType)}
                    className="flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-xl"
                    style={{
                      background: selectedPlatform === key ? 'rgba(106,155,204,0.12)' : 'transparent',
                      border: `1px solid ${selectedPlatform === key ? 'rgba(106,155,204,0.3)' : 'var(--cream-border)'}`,
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.6875rem',
                      color: selectedPlatform === key ? 'var(--soft-blue)' : 'var(--cream-text-muted)',
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
                  <span>比例 {currentPlatformSpec.videoRatio}</span>
                  <span>分辨率 {currentPlatformSpec.videoResolution}</span>
                  <span>最长 {currentPlatformSpec.videoMaxDuration}秒</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 uppercase tracking-wide" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, color: 'var(--cream-text-muted)' }}>
                AI模型
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {videoModels.map((model) => (
                  <motion.button
                    key={model.id}
                    type="button"
                    onClick={() => setSelectedModel(model.id)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 h-11 rounded-xl"
                    style={{
                      background: selectedModel === model.id ? 'rgba(106,155,204,0.12)' : 'transparent',
                      border: `1px solid ${selectedModel === model.id ? 'rgba(106,155,204,0.3)' : 'var(--cream-border)'}`,
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      color: selectedModel === model.id ? 'var(--soft-blue)' : 'var(--cream-text-muted)',
                      cursor: 'pointer',
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span>{model.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: model.isFree ? 'rgba(138,191,146,0.15)' : 'rgba(217,119,87,0.15)', color: model.isFree ? 'var(--moss-green)' : 'var(--warm-orange)' }}>
                      {model.isFree ? '免费' : '付费'}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 uppercase tracking-wide" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, color: 'var(--cream-text-muted)' }}>
                滤镜预设
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {VIDEO_FILTER_PRESETS.map((preset) => (
                  <motion.button
                    key={preset.id}
                    type="button"
                    onClick={() => handleFilterPresetSelect(preset.id)}
                    className="flex items-center gap-2 px-3 h-11 rounded-xl"
                    style={{
                      background: filterPreset === preset.id ? 'rgba(106,155,204,0.12)' : 'transparent',
                      border: `1px solid ${filterPreset === preset.id ? 'rgba(106,155,204,0.3)' : 'var(--cream-border)'}`,
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      color: filterPreset === preset.id ? 'var(--soft-blue)' : 'var(--cream-text-muted)',
                      cursor: 'pointer',
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span>{preset.icon}</span>
                    <span>{preset.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.5)' }}>
              <label className="block mb-3 uppercase tracking-wide" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, color: 'var(--cream-text-muted)' }}>
                参数调整
              </label>
              <FilterSlider label="亮度" value={adjustParams.brightness} min={0} max={200} onChange={(v) => setAdjustParams((prev) => ({ ...prev, brightness: v }))} />
              <FilterSlider label="对比度" value={adjustParams.contrast} min={0} max={200} onChange={(v) => setAdjustParams((prev) => ({ ...prev, contrast: v }))} />
              <FilterSlider label="饱和度" value={adjustParams.saturation} min={0} max={200} onChange={(v) => setAdjustParams((prev) => ({ ...prev, saturation: v }))} />
              <FilterSlider label="播放速度" value={adjustParams.speed} min={0.5} max={2} step={0.1} onChange={(v) => setAdjustParams((prev) => ({ ...prev, speed: v }))} unit="x" />
              <FilterSlider label="音量" value={adjustParams.volume} min={0} max={100} onChange={(v) => setAdjustParams((prev) => ({ ...prev, volume: v }))} unit="%" />
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
              disabled={!prompt.trim() || isGenerating}
              className="w-full h-11 rounded-xl flex items-center justify-center gap-2"
              style={{
                background: !prompt.trim() || isGenerating ? 'rgba(106,155,204,0.4)' : 'var(--soft-blue)',
                color: '#fff',
                border: 'none',
                fontFamily: "'Poppins',var(--font-sans)",
                fontSize: '0.8125rem',
                fontWeight: 500,
                cursor: !prompt.trim() || isGenerating ? 'not-allowed' : 'pointer',
                boxShadow: !prompt.trim() || isGenerating ? 'none' : '0 4px 12px rgba(106,155,204,0.3)',
              }}
              whileTap={!prompt.trim() || isGenerating ? {} : { scale: 0.97 }}
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
                  生成 {variantCount} 版视频
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        <motion.div className="flex-1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35 }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <h3 className="m-0 uppercase tracking-wide" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 600, color: 'var(--cream-dark)' }}>
                生成结果
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: 'rgba(106,155,204,0.1)', color: 'var(--soft-blue)' }}>
                {filteredVideos.length}
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 w-full sm:w-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {(['all', 'original', 'processing', 'enhanced'] as const).map((status) => (
                <motion.button
                  key={status}
                  type="button"
                  onClick={() => setFilter(status)}
                  className="flex-shrink-0 px-3 h-9 rounded-full"
                  style={{
                    background: filter === status ? 'var(--soft-blue)' : 'transparent',
                    color: filter === status ? '#fff' : 'var(--cream-text-muted)',
                    border: `1px solid ${filter === status ? 'var(--soft-blue)' : 'var(--cream-border)'}`,
                    fontFamily: "'Poppins',var(--font-sans)",
                    fontSize: '0.6875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  {status === 'all' && '全部'}
                  {status === 'original' && '原视频'}
                  {status === 'processing' && '处理中'}
                  {status === 'enhanced' && '已优化'}
                  <span className="ml-1 opacity-70">({counts[status]})</span>
                </motion.button>
              ))}
            </div>
          </div>

          {filteredVideos.length > 0 ? (
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" layout>
              <AnimatePresence mode="popLayout">
                {filteredVideos.map((video) => (
                  <motion.div
                    key={video.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="relative rounded-2xl overflow-hidden cursor-pointer group"
                    style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)' }}
                    onClick={() => openModal(video)}
                    whileTap={{ scale: 0.98 }}
                  >
                    {video.status === 'processing' && (
                      <div className="absolute inset-0 flex items-center justify-center z-10" style={{ background: 'rgba(0,0,0,0.5)' }}>
                        <svg className="animate-spin" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </div>
                    )}

                    {video.batchVersions && video.batchVersions.length > 0 && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full z-10" style={{ background: 'rgba(167,139,250,0.9)', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.625rem', fontWeight: 500, color: '#fff' }}>
                        {video.batchVersions.length}版
                      </div>
                    )}

                    <div className="relative aspect-video overflow-hidden" style={{ filter: video.status !== 'processing' && video.adjustParams ? buildCssFilter(video.adjustParams) : undefined }}>
                      <img src={video.thumbnail} alt={video.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.2)' }}>
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" stroke="none">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.6)', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.625rem', color: '#fff' }}>
                        {formatDuration(video.duration)}
                      </span>
                    </div>

                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        {video.platform && <span style={{ fontSize: '0.75rem' }}>{PLATFORM_SPECS[video.platform].icon}</span>}
                        <span className="px-1.5 py-0.5 rounded" style={{
                          background: video.status === 'enhanced' ? 'rgba(138,191,146,0.1)' : video.status === 'processing' ? 'rgba(251,191,36,0.1)' : 'rgba(106,155,204,0.1)',
                          fontFamily: "'Poppins',var(--font-sans)",
                          fontSize: '0.5625rem',
                          color: video.status === 'enhanced' ? 'var(--moss-green)' : video.status === 'processing' ? 'var(--warm-orange)' : 'var(--soft-blue)',
                          fontWeight: 500,
                        }}>
                          {video.status === 'enhanced' ? '已优化' : video.status === 'processing' ? '处理中' : '原视频'}
                        </span>
                      </div>
                      <p className="m-0 truncate" style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.8125rem', color: 'var(--cream-dark)' }}>
                        {video.name}
                      </p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.625rem', color: 'var(--cream-text-muted)' }}>
                          {video.resolution}
                        </span>
                        <span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.625rem', color: 'var(--cream-text-muted)' }}>
                          {formatSize(video.size)}
                        </span>
                      </div>
                    </div>

                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <motion.button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); deleteVideo(video.id); }}
                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(239,68,68,0.8)', color: '#fff', border: 'none', cursor: 'pointer' }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                        </svg>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div className="text-center py-16 rounded-2xl" style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="m-0" style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.8125rem', color: 'var(--cream-text-muted)' }}>
                暂无视频，填写左侧配置后生成
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showModal && currentVideo && (
          <>
            <motion.div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.4)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} />
            <motion.div
              className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[95vw] lg:w-[900px] max-w-[95vw] max-h-[85vh] rounded-2xl p-4 sm:p-6 flex flex-col overflow-hidden"
              style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)', boxShadow: 'var(--shadow-2xl)' }}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="m-0" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '1rem', fontWeight: 600, color: 'var(--cream-dark)' }}>
                  视频详情与微调
                </h3>
                <button type="button" onClick={closeModal} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'transparent', border: 'none', color: 'var(--cream-text-muted)', cursor: 'pointer' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
                  <div>
                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-4" style={{ filter: currentPreviewVideo?.adjustParams ? buildCssFilter(currentPreviewVideo.adjustParams) : undefined }}>
                      <img src={currentPreviewVideo?.thumbnail || currentVideo.thumbnail} alt="视频预览" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.2)' }}>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff" stroke="none">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </div>
                      </div>
                      <span className="absolute bottom-3 right-3 px-2 py-1 rounded" style={{ background: 'rgba(0,0,0,0.7)', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', color: '#fff' }}>
                        {formatDuration(currentPreviewVideo?.duration || currentVideo.duration)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.5)' }}>
                      <div className="grid grid-cols-2 gap-2" style={{ fontSize: '0.75rem' }}>
                        <div>
                          <span style={{ color: 'var(--cream-text-muted)' }}>名称：</span>
                          <span style={{ color: 'var(--cream-dark)' }}>{currentPreviewVideo?.name || currentVideo.name}</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--cream-text-muted)' }}>分辨率：</span>
                          <span style={{ color: 'var(--cream-dark)' }}>{currentPreviewVideo?.resolution || currentVideo.resolution}</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--cream-text-muted)' }}>时长：</span>
                          <span style={{ color: 'var(--cream-dark)' }}>{formatDuration(currentPreviewVideo?.duration || currentVideo.duration)}</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--cream-text-muted)' }}>大小：</span>
                          <span style={{ color: 'var(--cream-dark)' }}>{formatSize(currentPreviewVideo?.size || currentVideo.size)}</span>
                        </div>
                        {currentVideo.platform && (
                          <div>
                            <span style={{ color: 'var(--cream-text-muted)' }}>平台：</span>
                            <span>{PLATFORM_SPECS[currentVideo.platform].icon} {PLATFORM_SPECS[currentVideo.platform].name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    {currentVideo.batchVersions && currentVideo.batchVersions.length > 0 && (
                      <div className="mb-4">
                        <span className="block mb-2 uppercase tracking-wide" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, color: 'var(--cream-text-muted)' }}>版本切换</span>
                        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                          {currentVideo.batchVersions.map((_, i) => (
                            <motion.button
                              key={i}
                              type="button"
                              onClick={() => {
                                setSelectedVersionIndex(i);
                                const version = currentVideo!.batchVersions![i];
                                setModalAdjustParams(version.adjustParams || defaultAdjustParams);
                              }}
                              className="flex-shrink-0 px-3 h-10 rounded-xl"
                              style={{
                                background: selectedVersionIndex === i ? 'var(--soft-blue)' : 'transparent',
                                color: selectedVersionIndex === i ? '#fff' : 'var(--cream-text-muted)',
                                border: `1px solid ${selectedVersionIndex === i ? 'var(--soft-blue)' : 'var(--cream-border)'}`,
                                fontFamily: "'Poppins',var(--font-sans)",
                                fontSize: '0.6875rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                              }}
                              whileTap={{ scale: 0.97 }}
                            >
                              V{i + 1} {VARIANT_NAMES[i]}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <span className="block mb-2 uppercase tracking-wide" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, color: 'var(--cream-text-muted)' }}>滤镜预设</span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {VIDEO_FILTER_PRESETS.map((preset) => (
                          <motion.button
                            key={preset.id}
                            type="button"
                            onClick={() => handleModalFilterPresetSelect(preset.id)}
                            className="flex items-center gap-2 px-3 h-11 rounded-xl"
                            style={{
                              background: modalAdjustParams.filterPreset === preset.id ? 'rgba(106,155,204,0.12)' : 'transparent',
                              border: `1px solid ${modalAdjustParams.filterPreset === preset.id ? 'rgba(106,155,204,0.3)' : 'var(--cream-border)'}`,
                              fontFamily: "'Poppins',var(--font-sans)",
                              fontSize: '0.75rem',
                              color: modalAdjustParams.filterPreset === preset.id ? 'var(--soft-blue)' : 'var(--cream-text-muted)',
                              cursor: 'pointer',
                            }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <span>{preset.icon}</span>
                            <span>{preset.name}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.5)' }}>
                      <span className="block mb-2 uppercase tracking-wide" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, color: 'var(--cream-text-muted)' }}>参数微调</span>
                      <FilterSlider label="亮度" value={modalAdjustParams.brightness} min={0} max={200} onChange={(v) => setModalAdjustParams((prev) => ({ ...prev, brightness: v }))} />
                      <FilterSlider label="对比度" value={modalAdjustParams.contrast} min={0} max={200} onChange={(v) => setModalAdjustParams((prev) => ({ ...prev, contrast: v }))} />
                      <FilterSlider label="饱和度" value={modalAdjustParams.saturation} min={0} max={200} onChange={(v) => setModalAdjustParams((prev) => ({ ...prev, saturation: v }))} />
                      <FilterSlider label="播放速度" value={modalAdjustParams.speed} min={0.5} max={2} step={0.1} onChange={(v) => setModalAdjustParams((prev) => ({ ...prev, speed: v }))} unit="x" />
                      <FilterSlider label="音量" value={modalAdjustParams.volume} min={0} max={100} onChange={(v) => setModalAdjustParams((prev) => ({ ...prev, volume: v }))} unit="%" />
                    </div>

                    <div>
                      <span className="block mb-2 uppercase tracking-wide" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, color: 'var(--cream-text-muted)' }}>导出格式</span>
                      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {platformExportOptions.map((opt) => (
                          <motion.button
                            key={opt.format}
                            type="button"
                            onClick={() => setModalExportFormat(opt.format)}
                            className="flex-shrink-0 flex items-center gap-2 px-3 h-10 rounded-xl text-left"
                            style={{
                              background: modalExportFormat === opt.format ? 'rgba(106,155,204,0.12)' : 'transparent',
                              border: `1px solid ${modalExportFormat === opt.format ? 'rgba(106,155,204,0.3)' : 'var(--cream-border)'}`,
                              fontFamily: "'Poppins',var(--font-sans)",
                              fontSize: '0.75rem',
                              color: modalExportFormat === opt.format ? 'var(--soft-blue)' : 'var(--cream-text-muted)',
                              cursor: 'pointer',
                            }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="21 15 18 12 3 12" />
                            </svg>
                            <span>{opt.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 pt-4" style={{ borderTop: '1px solid var(--cream-border)' }}>
                <button type="button" onClick={closeModal} className="w-full sm:w-auto h-11 px-5 rounded-xl" style={{ background: 'transparent', color: 'var(--cream-text-muted)', border: '1px solid var(--cream-border)', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer' }}>
                  取消
                </button>
                <motion.button type="button" onClick={handleApplyAdjust} className="w-full sm:w-auto h-11 px-5 rounded-xl" style={{ background: 'var(--soft-blue)', color: '#fff', border: 'none', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', boxShadow: '0 3px 10px rgba(106,155,204,0.25)' }} whileTap={{ scale: 0.97 }}>
                  应用调整
                </motion.button>
                <motion.button type="button" className="w-full sm:w-auto h-11 px-5 rounded-xl" style={{ background: 'var(--moss-green)', color: '#fff', border: 'none', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', boxShadow: '0 3px 10px rgba(138,191,146,0.25)' }} whileTap={{ scale: 0.97 }}>
                  导出
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
