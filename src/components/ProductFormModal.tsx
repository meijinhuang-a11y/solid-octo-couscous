import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TrendingProduct } from '@/types';
import { useTrendingProductStore } from '@/store/trendingProduct';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editProduct?: TrendingProduct | null;
}

export default function ProductFormModal({ isOpen, onClose, editProduct }: ProductFormModalProps) {
  const { addProduct, updateProduct, platforms, categories } = useTrendingProductStore();
  const [formData, setFormData] = useState<Partial<TrendingProduct>>({
    name: '',
    image: '',
    category: '数码配件',
    price: 0,
    originalPrice: 0,
    sales: '0',
    growthRate: 0,
    platform: '小红书',
    rating: 4.5,
    reviewCount: 0,
    trend: 'up',
    tags: [],
    description: '',
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (editProduct) {
      setFormData(editProduct);
    } else {
      setFormData({
        name: '',
        image: '',
        category: '数码配件',
        price: 0,
        originalPrice: 0,
        sales: '0',
        growthRate: 0,
        platform: '小红书',
        rating: 4.5,
        reviewCount: 0,
        trend: 'up',
        tags: [],
        description: '',
      });
    }
    setTagInput('');
  }, [editProduct, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.image) return;

    if (editProduct) {
      updateProduct(editProduct.id, formData);
    } else {
      addProduct(formData as Omit<TrendingProduct, 'id'>);
    }
    onClose();
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    if (formData.tags?.includes(tagInput.trim())) {
      setTagInput('');
      return;
    }
    setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim()] });
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter((t) => t !== tag) });
  };

  const platformColors: Record<string, string> = {
    抖音: '#000',
    淘宝: '#FF4200',
    京东: '#E4393C',
    小红书: '#FE2C55',
    拼多多: '#E02E24',
    视频号: '#07C160',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] sm:w-[640px] max-h-[90vh] rounded-2xl overflow-hidden"
            style={{ background: 'var(--cream-bg)', boxShadow: 'var(--shadow-2xl)' }}
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="p-5 border-b" style={{ borderColor: 'var(--cream-border)' }}>
              <div className="flex items-center justify-between">
                <h3
                  className="m-0"
                  style={{
                    fontFamily: "'Poppins',var(--font-sans)",
                    fontSize: '1.0625rem',
                    fontWeight: 600,
                    color: 'var(--cream-dark)',
                  }}
                >
                  {editProduct ? '编辑产品' : '新增产品'}
                </h3>
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'transparent', border: 'none', color: 'var(--cream-text-muted)', cursor: 'pointer' }}
                  whileTap={{ scale: 0.97 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </motion.button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label
                    className="block mb-1.5"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'var(--cream-dark)',
                    }}
                  >
                    产品名称 *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="请输入产品名称"
                    className="w-full px-3 py-2.5 rounded-xl outline-none min-h-11"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--cream-border)',
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.875rem',
                      color: 'var(--cream-dark)',
                    }}
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    className="block mb-1.5"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'var(--cream-dark)',
                    }}
                  >
                    封面图片链接 *
                  </label>
                  <input
                    type="url"
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2.5 rounded-xl outline-none min-h-11"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--cream-border)',
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.875rem',
                      color: 'var(--cream-dark)',
                    }}
                    required
                  />
                  {formData.image && (
                    <div className="mt-2 rounded-xl overflow-hidden" style={{ width: '120px', height: '120px', border: '1px solid var(--cream-border)' }}>
                      <img
                        src={formData.image}
                        alt="预览"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label
                    className="block mb-1.5"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'var(--cream-dark)',
                    }}
                  >
                    平台
                  </label>
                  <select
                    value={formData.platform || '小红书'}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl outline-none min-h-11 cursor-pointer"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--cream-border)',
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.875rem',
                      color: 'var(--cream-dark)',
                    }}
                  >
                    {platforms.filter((p) => p !== '全部').map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="block mb-1.5"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'var(--cream-dark)',
                    }}
                  >
                    分类
                  </label>
                  <select
                    value={formData.category || '数码配件'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl outline-none min-h-11 cursor-pointer"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--cream-border)',
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.875rem',
                      color: 'var(--cream-dark)',
                    }}
                  >
                    {categories.filter((c) => c !== '全部').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="block mb-1.5"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'var(--cream-dark)',
                    }}
                  >
                    现价（元）
                  </label>
                  <input
                    type="number"
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 rounded-xl outline-none min-h-11"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--cream-border)',
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.875rem',
                      color: 'var(--cream-dark)',
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block mb-1.5"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'var(--cream-dark)',
                    }}
                  >
                    原价（元）
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice || 0}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 rounded-xl outline-none min-h-11"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--cream-border)',
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.875rem',
                      color: 'var(--cream-dark)',
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block mb-1.5"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'var(--cream-dark)',
                    }}
                  >
                    销量
                  </label>
                  <input
                    type="text"
                    value={formData.sales || '0'}
                    onChange={(e) => setFormData({ ...formData, sales: e.target.value })}
                    placeholder="如：1.2万、5000"
                    className="w-full px-3 py-2.5 rounded-xl outline-none min-h-11"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--cream-border)',
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.875rem',
                      color: 'var(--cream-dark)',
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block mb-1.5"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'var(--cream-dark)',
                    }}
                  >
                    增长率（%）
                  </label>
                  <input
                    type="number"
                    value={formData.growthRate || 0}
                    onChange={(e) => setFormData({ ...formData, growthRate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 rounded-xl outline-none min-h-11"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--cream-border)',
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.875rem',
                      color: 'var(--cream-dark)',
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block mb-1.5"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'var(--cream-dark)',
                    }}
                  >
                    评分
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating || 0}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 rounded-xl outline-none min-h-11"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--cream-border)',
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.875rem',
                      color: 'var(--cream-dark)',
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block mb-1.5"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'var(--cream-dark)',
                    }}
                  >
                    评价数
                  </label>
                  <input
                    type="number"
                    value={formData.reviewCount || 0}
                    onChange={(e) => setFormData({ ...formData, reviewCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 rounded-xl outline-none min-h-11"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--cream-border)',
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.875rem',
                      color: 'var(--cream-dark)',
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block mb-1.5"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'var(--cream-dark)',
                    }}
                  >
                    趋势
                  </label>
                  <select
                    value={formData.trend || 'up'}
                    onChange={(e) => setFormData({ ...formData, trend: e.target.value as 'up' | 'down' | 'stable' })}
                    className="w-full px-3 py-2.5 rounded-xl outline-none min-h-11 cursor-pointer"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--cream-border)',
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.875rem',
                      color: 'var(--cream-dark)',
                    }}
                  >
                    <option value="up">上升 ↑</option>
                    <option value="stable">平稳 →</option>
                    <option value="down">下降 ↓</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label
                    className="block mb-1.5"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'var(--cream-dark)',
                    }}
                  >
                    标签
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder="输入标签后按回车添加"
                      className="flex-1 px-3 py-2.5 rounded-xl outline-none min-h-11"
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--cream-border)',
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.875rem',
                        color: 'var(--cream-dark)',
                      }}
                    />
                    <motion.button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2.5 rounded-xl min-h-11"
                      style={{
                        background: 'var(--moss-green)',
                        color: '#fff',
                        border: 'none',
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      添加
                    </motion.button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full flex items-center gap-1"
                        style={{
                          fontFamily: "'Poppins',var(--font-sans)",
                          fontSize: '0.75rem',
                          color: 'var(--soft-blue)',
                          background: 'color-mix(in srgb, var(--soft-blue) 10%, transparent)',
                        }}
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="w-4 h-4 rounded-full flex items-center justify-center"
                          style={{
                            background: 'rgba(0,0,0,0.1)',
                            border: 'none',
                            color: 'var(--soft-blue)',
                            fontSize: '0.625rem',
                            cursor: 'pointer',
                            lineHeight: 1,
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    className="block mb-1.5"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'var(--cream-dark)',
                    }}
                  >
                    产品描述
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="请输入产品描述"
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl outline-none resize-none"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--cream-border)',
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.875rem',
                      color: 'var(--cream-dark)',
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-5 pt-4" style={{ borderTop: '1px solid var(--cream-border)' }}>
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl min-h-11"
                  style={{
                    background: 'var(--surface)',
                    color: 'var(--cream-dark)',
                    border: '1px solid var(--cream-border)',
                    fontFamily: "'Poppins',var(--font-sans)",
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  取消
                </motion.button>
                <motion.button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl min-h-11"
                  style={{
                    background: 'var(--warm-orange)',
                    color: '#fff',
                    border: 'none',
                    fontFamily: "'Poppins',var(--font-sans)",
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  {editProduct ? '保存修改' : '确认添加'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
