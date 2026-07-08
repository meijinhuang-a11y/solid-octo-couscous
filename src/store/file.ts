import { create } from 'zustand';
import type { FileItem, StorageLocation } from '@/types';

const initialFiles: FileItem[] = [
  { id: '1', name: '产品设计稿-最终版.psd', category: 'document', size: 15600000, modifiedAt: new Date(Date.now() - 3600000).toISOString(), path: '/设计文件/', storageLocation: 'cloud' },
  { id: '2', name: 'Q3季度规划.pptx', category: 'document', size: 8200000, modifiedAt: new Date(Date.now() - 7200000).toISOString(), path: '/工作文档/', storageLocation: 'local' },
  { id: '3', name: '产品主图合集.zip', category: 'archive', size: 125000000, modifiedAt: new Date(Date.now() - 86400000).toISOString(), path: '/图片素材/', storageLocation: 'cloud' },
  { id: '4', name: '宣传视频-高清版.mp4', category: 'video', size: 245000000, modifiedAt: new Date(Date.now() - 172800000).toISOString(), path: '/视频素材/', storageLocation: 'cloud' },
  { id: '5', name: '合同模板.docx', category: 'document', size: 245000, modifiedAt: new Date(Date.now() - 259200000).toISOString(), path: '/合同文件/', storageLocation: 'local' },
  { id: '6', name: '品牌视觉手册.pdf', category: 'document', size: 12500000, modifiedAt: new Date(Date.now() - 345600000).toISOString(), path: '/品牌资料/', storageLocation: 'cloud' },
  { id: '7', name: '用户调研数据.xlsx', category: 'document', size: 3200000, modifiedAt: new Date(Date.now() - 432000000).toISOString(), path: '/数据报表/', storageLocation: 'local' },
  { id: '8', name: '团队活动照片.jpg', category: 'image', size: 5400000, modifiedAt: new Date(Date.now() - 518400000).toISOString(), path: '/图片素材/', storageLocation: 'local' },
  { id: '9', name: '产品主图.png', category: 'image', size: 2100000, modifiedAt: new Date(Date.now() - 604800000).toISOString(), path: '/图片素材/', storageLocation: 'cloud' },
  { id: '10', name: '会议录音.m4a', category: 'audio', size: 45000000, modifiedAt: new Date(Date.now() - 691200000).toISOString(), path: '/音频文件/', storageLocation: 'local' },
  { id: '11', name: '博主合作视频.mp4', category: 'video', size: 180000000, modifiedAt: new Date(Date.now() - 777600000).toISOString(), path: '/视频素材/', storageLocation: 'cloud' },
  { id: '12', name: '品牌资料包.zip', category: 'archive', size: 98000000, modifiedAt: new Date(Date.now() - 864000000).toISOString(), path: '/品牌资料/', storageLocation: 'cloud' },
];

interface FileState {
  files: FileItem[];
  selectedStorage: StorageLocation | 'all';
  organizeFiles: () => void;
  deleteFile: (id: string) => void;
  searchFiles: (query: string) => FileItem[];
  setSelectedStorage: (storage: StorageLocation | 'all') => void;
  getFilteredFiles: () => FileItem[];
}

export const useFileStore = create<FileState>((set, get) => ({
  files: initialFiles,
  selectedStorage: 'all',

  organizeFiles: () => {
    const sorted = [...get().files].sort((a, b) => b.size - a.size);
    set({ files: sorted });
  },

  deleteFile: (id) => {
    set((state) => ({
      files: state.files.filter((f) => f.id !== id),
    }));
  },

  searchFiles: (query) => {
    const lower = query.toLowerCase();
    return get().files.filter((f) =>
      f.name.toLowerCase().includes(lower) ||
      f.category.toLowerCase().includes(lower)
    );
  },

  setSelectedStorage: (storage) => set({ selectedStorage: storage }),

  getFilteredFiles: () => {
    const { files, selectedStorage } = get();
    if (selectedStorage === 'all') return files;
    return files.filter((f) => f.storageLocation === selectedStorage);
  },
}));
