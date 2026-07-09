import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrendingProductStore } from '@/store/trendingProduct';
import type { TrendingProduct } from '@/types';
import ProductFormModal from '@/components/ProductFormModal';

export default function TrendingProductPage() {
  const { selectedPlatform, selectedCategory, sortBy, setSelectedPlatform, setSelectedCategory, setSortBy, getFilteredProducts, platforms, categories, lastRefresh, deleteProduct, exportProducts, importProducts, resetProducts, products } = useTrendingProductStore();
  const [selectedProduct, setSelectedProduct] = useState<TrendingProduct | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<TrendingProduct | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = getFilteredProducts();

  const handleAdd = () => {
    setEditProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: TrendingProduct) => {
    setEditProduct(product);
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个产品吗？')) {
      deleteProduct(id);
      setSelectedProduct(null);
    }
  };

  const handleExport = () => {
    const data = exportProducts();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `爆款产品_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data)) {
          const mode = confirm('点击确定替换现有数据，点击取消合并到现有数据');
          importProducts(data, mode ? 'replace' : 'merge');
          alert(`成功导入 ${data.length} 条数据`);
        } else {
          alert('数据格式不正确');
        }
      } catch {
        alert('文件解析失败');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
    setShowMenu(false);
  };

  const handleReset = () => {
    if (confirm('确定要恢复为初始示例数据吗？当前数据将被覆盖。')) {
      resetProducts();
    }
    setShowMenu(false);
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'var(--warm-orange)';
    if (trend === 'down') return 'var(--soft-blue)';
    return 'var(--cream-text-muted)';
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
    <div className="p-4 sm:p-6">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h2
              className="m-0"
              style={{
                fontFamily: "'Poppins',var(--font-sans)",
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'var(--cream-dark)',
              }}
            >
              爆款产品
            </h2>
            <span
              className="px-2.5 py-0.5 rounded-full"
              style={{
                fontFamily: "'Poppins',var(--font-sans)",
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--cream-text-muted)',
                background: 'var(--cream-border)',
              }}
              title="当前为演示数据，接入API后将显示实时趋势"
            >
              示例数据
            </span>
          </div>
          <p
            className="m-0"
            style={{
              fontFamily: "'Lora',var(--font-sans)",
              fontSize: '0.75rem',
              color: 'var(--cream-text-muted)',
            }}
          >
            发现热门爆款商品，把握选品方向
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <motion.button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all min-h-11 w-full sm:w-auto"
            style={{
              background: 'var(--warm-orange)',
              color: '#fff',
              border: 'none',
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
            whileTap={{ scale: 0.97 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            新增产品
          </motion.button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'sales' | 'growth' | 'price')}
            className="px-3 py-2 rounded-lg outline-none cursor-pointer w-full sm:w-auto min-h-11"
            style={{
              background: 'var(--cream-bg)',
              border: '1px solid var(--cream-border)',
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.8125rem',
              color: 'var(--cream-dark)',
            }}
          >
            <option value="growth">增长速度</option>
            <option value="sales">销量排序</option>
            <option value="price">价格排序</option>
          </select>
          <div className="relative">
            <motion.button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all min-h-11 w-full sm:w-auto"
              style={{
                background: 'var(--cream-bg)',
                color: 'var(--cream-dark)',
                border: '1px solid var(--cream-border)',
                fontFamily: "'Poppins',var(--font-sans)",
                fontSize: '0.8125rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
              whileTap={{ scale: 0.97 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
              更多
            </motion.button>
            <AnimatePresence>
              {showMenu && (
                <>
                  <motion.div
                    className="fixed inset-0 z-30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowMenu(false)}
                  />
                  <motion.div
                    className="absolute right-0 top-full mt-2 z-40 w-44 rounded-xl overflow-hidden"
                    style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)', boxShadow: 'var(--shadow-lg)' }}
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                  >
                    <button
                      type="button"
                      onClick={handleExport}
                      className="w-full px-4 py-3 text-left flex items-center gap-2"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.8125rem',
                        color: 'var(--cream-dark)',
                        cursor: 'pointer',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      导出数据
                    </button>
                    <button
                      type="button"
                      onClick={() => { fileInputRef.current?.click(); }}
                      className="w-full px-4 py-3 text-left flex items-center gap-2"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.8125rem',
                        color: 'var(--cream-dark)',
                        cursor: 'pointer',
                        borderTop: '1px solid var(--cream-border)',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      导入数据
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full px-4 py-3 text-left flex items-center gap-2"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.8125rem',
                        color: 'var(--warm-orange)',
                        cursor: 'pointer',
                        borderTop: '1px solid var(--cream-border)',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="1 4 1 10 7 10" />
                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                      </svg>
                      恢复示例数据
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </div>
          <span
            className="hidden sm:block"
            style={{
              fontFamily: "'Lora',var(--font-sans)",
              fontSize: '0.75rem',
              color: 'var(--cream-text-muted)',
            }}
          >
            共 {products.length} 条 · {new Date(lastRefresh).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })} 更新
          </span>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 mb-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="flex items-center gap-2 w-full">
          <span
            className="flex-shrink-0"
            style={{
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.75rem',
              color: 'var(--cream-text-muted)',
            }}
          >
            平台：
          </span>
          <div className="flex-1 flex gap-1.5 overflow-x-auto sm:flex-wrap pb-1 sm:pb-0">
            {platforms.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedPlatform(p)}
                className="px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex-shrink-0 min-h-11"
                style={{
                  background: selectedPlatform === p ? platformColors[p] || 'var(--warm-orange)' : 'var(--cream-bg)',
                  color: selectedPlatform === p ? '#fff' : 'var(--cream-dark)',
                  border: `1px solid ${selectedPlatform === p ? platformColors[p] || 'var(--warm-orange)' : 'var(--cream-border)'}`,
                  fontFamily: "'Poppins',var(--font-sans)",
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 w-full">
          <span
            className="flex-shrink-0"
            style={{
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.75rem',
              color: 'var(--cream-text-muted)',
            }}
          >
            分类：
          </span>
          <div className="flex-1 flex gap-1.5 overflow-x-auto sm:flex-wrap pb-1 sm:pb-0">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCategory(c)}
                className="px-3 py-1.5 rounded-full transition-all whitespace-nowrap flex-shrink-0 min-h-11"
                style={{
                  background: selectedCategory === c
                    ? 'color-mix(in srgb, var(--moss-green) 15%, transparent)'
                    : 'var(--cream-bg)',
                  color: selectedCategory === c ? 'var(--moss-green)' : 'var(--cream-text-muted)',
                  border: `1px solid ${selectedCategory === c ? 'var(--moss-green)' : 'var(--cream-border)'}`,
                  fontFamily: "'Poppins',var(--font-sans)",
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Product Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.03, duration: 0.3 }}
              className="rounded-2xl overflow-hidden cursor-pointer group"
              style={{
                background: 'var(--cream-bg)',
                border: '1px solid var(--cream-border)',
              }}
              onClick={() => setSelectedProduct(product)}
              whileTap={{ scale: 0.97 }}
            >
              <div className="relative" style={{ aspectRatio: '1', overflow: 'hidden' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  className="absolute top-2 left-2 px-2 py-0.5 rounded-full"
                  style={{
                    background: platformColors[product.platform] || 'var(--warm-orange)',
                    color: 'var(--text-on-primary)',
                    fontFamily: "'Poppins',var(--font-sans)",
                    fontSize: '0.75rem',
                    fontWeight: 500,
                  }}
                >
                  {product.platform}
                </div>
                {product.growthRate > 100 && (
                  <div
                    className="absolute top-2 right-2 px-2 py-0.5 rounded-full flex items-center gap-1"
                    style={{
                      background: 'var(--warm-orange)',
                      color: 'var(--text-on-primary)',
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                    {product.growthRate}%
                  </div>
                )}
                {index < 3 && (
                  <div
                    className="absolute bottom-2 left-2 w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, var(--warm-orange), #FF8C42)',
                      color: 'var(--text-on-primary)',
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    TOP {index + 1}
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span
                    className="px-1.5 py-0.5 rounded"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      color: 'var(--cream-text-muted)',
                      background: 'rgba(0,0,0,0.04)',
                    }}
                  >
                    {product.category}
                  </span>
                </div>
                <h4
                  className="m-0 mb-2"
                  style={{
                    fontFamily: "'Poppins',var(--font-sans)",
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--cream-dark)',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {product.name}
                </h4>
                <div className="flex items-end justify-between mb-2">
                  <div className="flex items-baseline gap-1">
                    <span
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        color: 'var(--warm-orange)',
                        fontWeight: 500,
                      }}
                    >
                      ¥
                    </span>
                    <span
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '1.0625rem',
                        color: 'var(--warm-orange)',
                        fontWeight: 700,
                      }}
                    >
                      {product.price}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Lora',var(--font-sans)",
                        fontSize: '0.75rem',
                        color: 'var(--cream-text-muted)',
                        textDecoration: 'line-through',
                      }}
                    >
                      ¥{product.originalPrice}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--warm-orange)" stroke="var(--warm-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        color: 'var(--cream-dark)',
                        fontWeight: 500,
                      }}
                    >
                      {product.rating}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "'Lora',var(--font-sans)",
                      fontSize: '0.75rem',
                      color: 'var(--cream-text-muted)',
                    }}
                  >
                    已售 {product.sales}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <motion.div
          className="text-center py-16"
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
            暂无数据
          </p>
        </motion.div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.6)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] sm:w-[760px] max-w-[90vw] max-h-[90vh] rounded-2xl overflow-hidden"
              style={{ background: 'var(--cream-bg)', boxShadow: 'var(--shadow-2xl)' }}
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex flex-col sm:flex-row h-full">
                <div className="w-full sm:w-[320px] flex-shrink-0" style={{ background: '#fafafa' }}>
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '300px' }}
                  />
                </div>
                <div className="flex-1 p-4 sm:p-5 flex flex-col" style={{ minHeight: 0 }}>
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className="px-2.5 py-0.5 rounded-full"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: 'var(--text-on-primary)',
                        background: platformColors[selectedProduct.platform] || 'var(--warm-orange)',
                      }}
                    >
                      {selectedProduct.platform}
                    </span>
                    <motion.button
                      type="button"
                      onClick={() => setSelectedProduct(null)}
                      className="w-11 h-11 min-h-11 rounded-lg flex items-center justify-center"
                      style={{ background: 'transparent', border: 'none', color: 'var(--cream-text-muted)', cursor: 'pointer' }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </motion.button>
                  </div>

                  <span
                    className="inline-block mb-2 px-2 py-0.5 rounded"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      color: 'var(--cream-text-muted)',
                      background: 'rgba(0,0,0,0.04)',
                      width: 'fit-content',
                    }}
                  >
                    {selectedProduct.category}
                  </span>

                  <h3
                    className="m-0 mb-3"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: 'var(--cream-dark)',
                      lineHeight: 1.4,
                    }}
                  >
                    {selectedProduct.name}
                  </h3>

                  <div className="flex flex-wrap items-baseline gap-2 mb-4 pb-4" style={{ borderBottom: '1px solid var(--cream-border)' }}>
                    <span
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        color: 'var(--warm-orange)',
                        fontWeight: 500,
                      }}
                    >
                      ¥
                    </span>
                    <span
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '1.5rem',
                        color: 'var(--warm-orange)',
                        fontWeight: 700,
                      }}
                    >
                      {selectedProduct.price}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Lora',var(--font-sans)",
                        fontSize: '0.75rem',
                        color: 'var(--cream-text-muted)',
                        textDecoration: 'line-through',
                      }}
                    >
                      原价 ¥{selectedProduct.originalPrice}
                    </span>
                    <span
                      className="ml-auto px-2 py-0.5 rounded-full flex items-center gap-1"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: getTrendColor(selectedProduct.trend),
                        background: `color-mix(in srgb, ${getTrendColor(selectedProduct.trend)} 12%, transparent)`,
                      }}
                    >
                      {selectedProduct.trend === 'up' ? '↑' : selectedProduct.trend === 'down' ? '↓' : '→'}
                      {Math.abs(selectedProduct.growthRate)}%
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div
                      className="p-3 rounded-xl text-center"
                      style={{ background: 'color-mix(in srgb, var(--warm-orange) 8%, transparent)' }}
                    >
                      <p
                        className="m-0"
                        style={{
                          fontFamily: "'Poppins',var(--font-sans)",
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: 'var(--warm-orange)',
                        }}
                      >
                        {selectedProduct.sales}
                      </p>
                      <p
                        className="m-0"
                        style={{
                          fontFamily: "'Lora',var(--font-sans)",
                          fontSize: '0.75rem',
                          color: 'var(--cream-text-muted)',
                        }}
                      >
                        销量
                      </p>
                    </div>
                    <div
                      className="p-3 rounded-xl text-center"
                      style={{ background: 'color-mix(in srgb, var(--moss-green) 8%, transparent)' }}
                    >
                      <p
                        className="m-0"
                        style={{
                          fontFamily: "'Poppins',var(--font-sans)",
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: 'var(--moss-green)',
                        }}
                      >
                        {selectedProduct.rating}
                      </p>
                      <p
                        className="m-0"
                        style={{
                          fontFamily: "'Lora',var(--font-sans)",
                          fontSize: '0.75rem',
                          color: 'var(--cream-text-muted)',
                        }}
                      >
                        评分
                      </p>
                    </div>
                    <div
                      className="p-3 rounded-xl text-center"
                      style={{ background: 'color-mix(in srgb, var(--soft-blue) 8%, transparent)' }}
                    >
                      <p
                        className="m-0"
                        style={{
                          fontFamily: "'Poppins',var(--font-sans)",
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: 'var(--soft-blue)',
                        }}
                      >
                        {selectedProduct.reviewCount.toLocaleString()}
                      </p>
                      <p
                        className="m-0"
                        style={{
                          fontFamily: "'Lora',var(--font-sans)",
                          fontSize: '0.75rem',
                          color: 'var(--cream-text-muted)',
                        }}
                      >
                        评价数
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p
                      className="m-0 mb-2"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--cream-dark)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      产品标签
                    </p>
                    <div className="flex gap-1.5 flex-wrap">
                      {selectedProduct.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-full"
                          style={{
                            fontFamily: "'Lora',var(--font-sans)",
                            fontSize: '0.75rem',
                            color: 'var(--soft-blue)',
                            background: 'color-mix(in srgb, var(--soft-blue) 10%, transparent)',
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <p
                      className="m-0 mb-2"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--cream-dark)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      产品描述
                    </p>
                    <p
                      className="m-0"
                      style={{
                        fontFamily: "'Lora',var(--font-sans)",
                        fontSize: '0.8125rem',
                        color: 'var(--cream-text-muted)',
                        lineHeight: 1.7,
                      }}
                    >
                      {selectedProduct.description}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4" style={{ borderTop: '1px solid var(--cream-border)' }}>
                    <motion.button
                      type="button"
                      onClick={() => selectedProduct && handleEdit(selectedProduct)}
                      className="flex-1 py-2.5 rounded-xl min-h-11"
                      style={{
                        background: 'var(--surface)',
                        color: 'var(--cream-dark)',
                        border: '1px solid var(--cream-border)',
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      编辑
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => selectedProduct && handleDelete(selectedProduct.id)}
                      className="flex-1 py-2.5 rounded-xl min-h-11"
                      style={{
                        background: 'transparent',
                        color: 'var(--warm-orange)',
                        border: '1px solid var(--warm-orange)',
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      删除
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditProduct(null); }}
        editProduct={editProduct}
      />
    </div>
  );
}
