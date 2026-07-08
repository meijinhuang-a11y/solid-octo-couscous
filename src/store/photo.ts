import { create } from 'zustand';
import type { PhotoItem, FilterParams, PlatformType, ExportFormat } from '@/types';
import { FILTER_PRESETS, PLATFORM_SPECS, VARIANT_NAMES, MAX_VARIANTS } from '@/config/platform';

const defaultFilterParams: FilterParams = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  warmth: 50,
  sharpness: 50,
  filterPreset: 'none',
};

const initialPhotos: PhotoItem[] = [
  {
    id: '1',
    name: '产品主图-01.jpg',
    url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300',
    size: 2450000,
    width: 1920,
    height: 1080,
    status: 'enhanced',
    enhancementType: '超清修复',
    uploadDate: new Date(Date.now() - 3600000).toISOString(),
    enhancedAt: new Date(Date.now() - 3000000).toISOString(),
    platform: 'xiaohongshu',
    filterParams: { ...defaultFilterParams, filterPreset: 'fresh', brightness: 110, saturation: 115 },
    exportFormat: 'png',
  },
  {
    id: '2',
    name: '人像摄影-日落.jpg',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    size: 3200000,
    width: 2000,
    height: 1333,
    status: 'enhanced',
    enhancementType: '人像美化',
    uploadDate: new Date(Date.now() - 7200000).toISOString(),
    enhancedAt: new Date(Date.now() - 6600000).toISOString(),
    platform: 'xiaohongshu',
    filterParams: { ...defaultFilterParams, filterPreset: 'warm', warmth: 70 },
    exportFormat: 'jpg',
  },
  {
    id: '3',
    name: '风景-山脉.jpg',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300',
    size: 4100000,
    width: 2400,
    height: 1600,
    status: 'processing',
    enhancementType: '色彩增强',
    uploadDate: new Date(Date.now() - 1800000).toISOString(),
    platform: 'douyin',
  },
  {
    id: '4',
    name: '城市夜景.jpg',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=300',
    size: 5600000,
    width: 2560,
    height: 1440,
    status: 'original',
    uploadDate: new Date(Date.now() - 86400000).toISOString(),
  },
];

interface PhotoState {
  photos: PhotoItem[];
  isGenerating: boolean;
  addPhoto: (photo: Omit<PhotoItem, 'id'>) => void;
  updatePhoto: (id: string, updates: Partial<PhotoItem>) => void;
  deletePhoto: (id: string) => void;
  getPhotosByStatus: (status: PhotoItem['status']) => PhotoItem[];
  enhancePhoto: (id: string, type: string) => void;
  batchGenerate: (params: {
    prompt: string;
    platform: PlatformType;
    model: string;
    filterParams?: FilterParams;
    variantCount?: number;
  }) => void;
  applyFilter: (id: string, filterParams: FilterParams) => void;
  applyFilterPreset: (id: string, presetId: string) => void;
  updateBatchVersion: (parentId: string, versionIndex: number, updates: Partial<PhotoItem>) => void;
  setExportFormat: (id: string, format: ExportFormat) => void;
}

// 生成批量图片版本（支持1-10版）
const generateBatchVersions = (basePhoto: PhotoItem, platform: PlatformType, count: number = 5): PhotoItem[] => {
  const spec = PLATFORM_SPECS[platform];
  const [targetW, targetH] = spec.imageSize.split('x').map(Number);
  const actualCount = Math.min(count, MAX_VARIANTS);

  return Array.from({ length: actualCount }, (_, i) => ({
    ...basePhoto,
    id: `${basePhoto.id}-v${i + 1}`,
    name: `${basePhoto.name.replace(/\.[^.]+$/, '')}_${VARIANT_NAMES[i]}.jpg`,
    width: targetW,
    height: targetH,
    status: 'enhanced' as const,
    enhancementType: VARIANT_NAMES[i],
    isBatchVersion: true,
    versionIndex: i,
    filterParams: {
      ...defaultFilterParams,
      ...(FILTER_PRESETS[i + 1]?.params || {}),
    },
    enhancedAt: new Date().toISOString(),
  }));
};

export const usePhotoStore = create<PhotoState>((set, get) => ({
  photos: initialPhotos,
  isGenerating: false,

  addPhoto: (photo) => {
    const newPhoto: PhotoItem = {
      ...photo,
      id: Date.now().toString(),
      filterParams: photo.filterParams || defaultFilterParams,
    };
    set((state) => ({ photos: [newPhoto, ...state.photos] }));
  },

  updatePhoto: (id, updates) => {
    set((state) => ({
      photos: state.photos.map((photo) =>
        photo.id === id ? { ...photo, ...updates } : photo
      ),
    }));
  },

  deletePhoto: (id) => {
    set((state) => ({
      photos: state.photos.filter((photo) => photo.id !== id && !photo.id.startsWith(`${id}-v`)),
    }));
  },

  getPhotosByStatus: (status) => {
    return get().photos.filter((photo) => photo.status === status);
  },

  enhancePhoto: (id, type) => {
    set((state) => ({
      photos: state.photos.map((photo) =>
        photo.id === id
          ? { ...photo, status: 'processing' as const, enhancementType: type }
          : photo
      ),
    }));
    setTimeout(() => {
      set((state) => ({
        photos: state.photos.map((photo) =>
          photo.id === id
            ? { ...photo, status: 'enhanced' as const, enhancedAt: new Date().toISOString() }
            : photo
        ),
      }));
    }, 2000);
  },

  batchGenerate: ({ prompt, platform, model, filterParams, variantCount = 5 }) => {
    set({ isGenerating: true });

    const spec = PLATFORM_SPECS[platform];
    const [targetW, targetH] = spec.imageSize.split('x').map(Number);

    const basePhoto: PhotoItem = {
      id: Date.now().toString(),
      name: `AI生成_${prompt.slice(0, 10)}_${spec.name}.jpg`,
      url: `https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800`,
      thumbnail: `https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300`,
      size: 2000000,
      width: targetW,
      height: targetH,
      status: 'processing',
      enhancementType: 'AI生成',
      uploadDate: new Date().toISOString(),
      prompt,
      platform,
      model,
      filterParams: filterParams || defaultFilterParams,
      exportFormat: 'png',
    };

    const versions = generateBatchVersions(basePhoto, platform, variantCount);
    basePhoto.batchVersions = versions;

    setTimeout(() => {
      set((state) => ({
        photos: [{ ...basePhoto, status: 'enhanced' as const, enhancedAt: new Date().toISOString() }, ...state.photos],
        isGenerating: false,
      }));
    }, 2000);
  },

  applyFilter: (id, filterParams) => {
    set((state) => ({
      photos: state.photos.map((photo) =>
        photo.id === id ? { ...photo, filterParams, enhancedAt: new Date().toISOString() } : photo
      ),
    }));
  },

  applyFilterPreset: (id, presetId) => {
    const preset = FILTER_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    set((state) => ({
      photos: state.photos.map((photo) => {
        if (photo.id !== id) return photo;
        const current = photo.filterParams || defaultFilterParams;
        return {
          ...photo,
          filterParams: { ...current, ...preset.params } as FilterParams,
          enhancedAt: new Date().toISOString(),
        };
      }),
    }));
  },

  updateBatchVersion: (parentId, versionIndex, updates) => {
    set((state) => ({
      photos: state.photos.map((photo) => {
        if (photo.id !== parentId || !photo.batchVersions) return photo;
        return {
          ...photo,
          batchVersions: photo.batchVersions.map((v, i) =>
            i === versionIndex ? { ...v, ...updates } : v
          ),
        };
      }),
    }));
  },

  setExportFormat: (id, format) => {
    set((state) => ({
      photos: state.photos.map((photo) =>
        photo.id === id ? { ...photo, exportFormat: format } : photo
      ),
    }));
  },
}));
