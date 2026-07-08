import { create } from 'zustand';
import type { VideoItem, VideoAdjustParams, PlatformType, ExportFormat } from '@/types';
import { VIDEO_FILTER_PRESETS, PLATFORM_SPECS, VARIANT_NAMES, MAX_VARIANTS } from '@/config/platform';

const defaultAdjustParams: VideoAdjustParams = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  speed: 1.0,
  volume: 100,
  filterPreset: 'none',
};

const initialVideos: VideoItem[] = [
  {
    id: '1',
    name: '产品宣传视频-主片.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400',
    duration: 125,
    size: 45000000,
    resolution: '1920x1080',
    status: 'enhanced',
    enhancementType: '画质增强',
    uploadDate: new Date(Date.now() - 3600000).toISOString(),
    enhancedAt: new Date(Date.now() - 2800000).toISOString(),
    platform: 'douyin',
    adjustParams: { ...defaultAdjustParams, filterPreset: 'cinema', contrast: 115 },
    exportFormat: 'mp4',
  },
  {
    id: '2',
    name: '教程视频-入门篇.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400',
    duration: 320,
    size: 120000000,
    resolution: '1920x1080',
    status: 'processing',
    enhancementType: '智能剪辑',
    uploadDate: new Date(Date.now() - 1200000).toISOString(),
    platform: 'bilibili',
  },
  {
    id: '3',
    name: '活动现场记录.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
    duration: 540,
    size: 280000000,
    resolution: '3840x2160',
    status: 'original',
    uploadDate: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '4',
    name: '品牌故事短片.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400',
    duration: 90,
    size: 32000000,
    resolution: '1920x1080',
    status: 'enhanced',
    enhancementType: '色彩调色',
    uploadDate: new Date(Date.now() - 172800000).toISOString(),
    enhancedAt: new Date(Date.now() - 170000000).toISOString(),
    platform: 'wechat_video',
    adjustParams: { ...defaultAdjustParams, filterPreset: 'vivid', saturation: 125 },
    exportFormat: 'mp4',
  },
  {
    id: '5',
    name: '产品开箱视频.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1593508512255-86ab42a0e6d?w=400',
    duration: 210,
    size: 65000000,
    resolution: '2560x1440',
    status: 'original',
    uploadDate: new Date(Date.now() - 259200000).toISOString(),
  },
];

interface VideoState {
  videos: VideoItem[];
  isGenerating: boolean;
  addVideo: (video: Omit<VideoItem, 'id'>) => void;
  updateVideo: (id: string, updates: Partial<VideoItem>) => void;
  deleteVideo: (id: string) => void;
  enhanceVideo: (id: string, type: string) => void;
  getVideosByStatus: (status: VideoItem['status']) => VideoItem[];
  batchGenerate: (params: {
    prompt: string;
    platform: PlatformType;
    model: string;
    adjustParams?: VideoAdjustParams;
    variantCount?: number;
  }) => void;
  applyAdjust: (id: string, adjustParams: VideoAdjustParams) => void;
  applyVideoFilterPreset: (id: string, presetId: string) => void;
  updateBatchVersion: (parentId: string, versionIndex: number, updates: Partial<VideoItem>) => void;
  setExportFormat: (id: string, format: ExportFormat) => void;
}

// 生成批量视频版本（支持1-10版）
const generateBatchVersions = (baseVideo: VideoItem, platform: PlatformType, count: number = 5): VideoItem[] => {
  const spec = PLATFORM_SPECS[platform];
  const actualCount = Math.min(count, MAX_VARIANTS);

  return Array.from({ length: actualCount }, (_, i) => ({
    ...baseVideo,
    id: `${baseVideo.id}-v${i + 1}`,
    name: `${baseVideo.name.replace(/\.[^.]+$/, '')}_${VARIANT_NAMES[i]}.mp4`,
    resolution: spec.videoResolution,
    status: 'enhanced' as const,
    enhancementType: VARIANT_NAMES[i],
    isBatchVersion: true,
    versionIndex: i,
    adjustParams: {
      ...defaultAdjustParams,
      ...(VIDEO_FILTER_PRESETS[i + 1]?.params || {}),
    },
    enhancedAt: new Date().toISOString(),
  }));
};

export const useVideoStore = create<VideoState>((set, get) => ({
  videos: initialVideos,
  isGenerating: false,

  addVideo: (video) => {
    const newVideo: VideoItem = {
      ...video,
      id: Date.now().toString(),
      adjustParams: video.adjustParams || defaultAdjustParams,
    };
    set((state) => ({ videos: [newVideo, ...state.videos] }));
  },

  updateVideo: (id, updates) => {
    set((state) => ({
      videos: state.videos.map((video) =>
        video.id === id ? { ...video, ...updates } : video
      ),
    }));
  },

  deleteVideo: (id) => {
    set((state) => ({
      videos: state.videos.filter((video) => video.id !== id && !video.id.startsWith(`${id}-v`)),
    }));
  },

  enhanceVideo: (id, type) => {
    set((state) => ({
      videos: state.videos.map((video) =>
        video.id === id
          ? { ...video, status: 'processing' as const, enhancementType: type }
          : video
      ),
    }));
    setTimeout(() => {
      set((state) => ({
        videos: state.videos.map((video) =>
          video.id === id
            ? { ...video, status: 'enhanced' as const, enhancedAt: new Date().toISOString() }
            : video
        ),
      }));
    }, 3000);
  },

  getVideosByStatus: (status) => {
    return get().videos.filter((video) => video.status === status);
  },

  batchGenerate: ({ prompt, platform, model, adjustParams, variantCount = 5 }) => {
    set({ isGenerating: true });

    const spec = PLATFORM_SPECS[platform];

    const baseVideo: VideoItem = {
      id: Date.now().toString(),
      name: `AI生成_${prompt.slice(0, 10)}_${spec.name}.mp4`,
      thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400',
      duration: 30,
      size: 15000000,
      resolution: spec.videoResolution,
      status: 'processing',
      enhancementType: 'AI生成',
      uploadDate: new Date().toISOString(),
      prompt,
      platform,
      model,
      adjustParams: adjustParams || defaultAdjustParams,
      exportFormat: 'mp4',
    };

    const versions = generateBatchVersions(baseVideo, platform, variantCount);
    baseVideo.batchVersions = versions;

    setTimeout(() => {
      set((state) => ({
        videos: [{ ...baseVideo, status: 'enhanced' as const, enhancedAt: new Date().toISOString() }, ...state.videos],
        isGenerating: false,
      }));
    }, 3000);
  },

  applyAdjust: (id, adjustParams) => {
    set((state) => ({
      videos: state.videos.map((video) =>
        video.id === id ? { ...video, adjustParams, enhancedAt: new Date().toISOString() } : video
      ),
    }));
  },

  applyVideoFilterPreset: (id, presetId) => {
    const preset = VIDEO_FILTER_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    set((state) => ({
      videos: state.videos.map((video) => {
        if (video.id !== id) return video;
        const current = video.adjustParams || defaultAdjustParams;
        return {
          ...video,
          adjustParams: { ...current, ...preset.params } as VideoAdjustParams,
          enhancedAt: new Date().toISOString(),
        };
      }),
    }));
  },

  updateBatchVersion: (parentId, versionIndex, updates) => {
    set((state) => ({
      videos: state.videos.map((video) => {
        if (video.id !== parentId || !video.batchVersions) return video;
        return {
          ...video,
          batchVersions: video.batchVersions.map((v, i) =>
            i === versionIndex ? { ...v, ...updates } : v
          ),
        };
      }),
    }));
  },

  setExportFormat: (id, format) => {
    set((state) => ({
      videos: state.videos.map((video) =>
        video.id === id ? { ...video, exportFormat: format } : video
      ),
    }));
  },
}));
