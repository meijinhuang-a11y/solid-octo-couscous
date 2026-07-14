import { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductExtractorStore } from '@/store/productExtractor';
import type { ProductInfo, ProductStatus } from '@/types';
import DashboardPanel from '@/components/ai-assistant/DashboardPanel';
import { useDeviceDetect } from '@/hooks/useDeviceDetect';

const tabOptions: { value: ProductStatus | 'all'; label: string; desc: string }[] = [
  { value: 'pending', label: '未上架', desc: '1688提取，待评估' },
  { value: 'ready', label: '准备上架', desc: '利润已测算' },
  { value: 'listed', label: '已上架', desc: '小红书在售' },
  { value: 'downlisted', label: '已下架', desc: '已下架商品' },
];

export default function ProductExtractorPage() {
  const {
    isExtracting,
    extractError,
    refresh,
    lastRefresh,
    isRefreshing,
    activeTab,
    setActiveTab,
    extractFromHtml,
    products,
    updateProductProfit,
    updateProductNotes,
    updateDropshippingRules,
    updateProductStatus,
    deleteProduct,
    listProduct,
    downlistProduct,
  } = useProductExtractorStore((state) => state);

  const device = useDeviceDetect();
  const [url, setUrl] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [sellingPriceInput, setSellingPriceInput] = useState('');
  const [shippingCostInput, setShippingCostInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [xhsUrlInput, setXhsUrlInput] = useState('');
  const [xhsTitleInput, setXhsTitleInput] = useState('');
  const [xhsPriceInput, setXhsPriceInput] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useMemo(() => {
    if (activeTab === 'all') return products;
    return products.filter((p) => p.status === activeTab);
  }, [products, activeTab]);

  const stats = useMemo(() => {
    const pending = products.filter((p) => p.status === 'pending');
    const ready = products.filter((p) => p.status === 'ready');
    const listed = products.filter((p) => p.status === 'listed');
    const downlisted = products.filter((p) => p.status === 'downlisted');
    const allProfit = [...ready, ...listed];
    const avgMargin = allProfit.length > 0
      ? +(allProfit.reduce((sum, p) => sum + p.profit.profitMargin, 0) / allProfit.length).toFixed(1)
      : 0;
    return {
      pending: pending.length,
      ready: ready.length,
      listed: listed.length,
      downlisted: downlisted.length,
      total: products.length,
      avgMargin,
    };
  }, [products]);
  const selectedProduct = filteredProducts.find((p) => p.id === selectedId) || null;

  const handleExtractHtml = async () => {
    if (!htmlContent.trim()) return;
    const result = await extractFromHtml(htmlContent.trim(), url.trim());
    if (result.success) {
      setHtmlContent('');
      setUrl('');
      setSuccessMsg('✅ 商品提取成功，已添加到未上架列表');
      setTimeout(() => setSuccessMsg(null), 3000);
      // 滚动到列表顶部查看新商品
      setTimeout(() => {
        listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setHtmlContent(text);
      }
    } catch {
      // 剪贴板不可用，忽略
    }
  };

  const handleSelectProduct = (product: ProductInfo) => {
    setSelectedId(product.id);
    setActiveImageIndex(0);
    setSellingPriceInput(product.profit.sellingPrice > 0 ? product.profit.sellingPrice.toString() : '');
    setShippingCostInput(product.profit.shippingCost.toString());
    setNotesInput(product.notes);
    setXhsUrlInput(product.xhsUrl || '');
    setXhsTitleInput(product.xhsTitle || product.title);
    setXhsPriceInput(product.xhsPrice ? product.xhsPrice.toString() : product.profit.sellingPrice.toString());
    if (device.isMobile) {
      setSheetOpen(true);
    }
  };

  const handleUpdateProfit = () => {
    if (!selectedProduct) return;
    const sp = parseFloat(sellingPriceInput);
    const sc = parseFloat(shippingCostInput);
    if (!isNaN(sp) && !isNaN(sc) && sp > 0) {
      updateProductProfit(selectedProduct.id, sp, sc);
      // 保存后保持在当前 Tab，用户可手动切换到准备上架
    }
  };

  const handleUpdateNotes = () => {
    if (!selectedProduct) return;
    updateProductNotes(selectedProduct.id, notesInput);
  };

  const handleOpenListModal = () => {
    if (!selectedProduct || !xhsUrlInput.trim()) return;
    const xhsPrice = parseFloat(xhsPriceInput);
    listProduct(selectedProduct.id, xhsUrlInput.trim(), xhsTitleInput.trim(), isNaN(xhsPrice) ? selectedProduct.profit.sellingPrice : xhsPrice);
    setActiveTab('listed');
    if (device.isMobile) {
      setSheetOpen(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const tabCounts = {
    pending: stats.pending,
    ready: stats.ready,
    listed: stats.listed,
    downlisted: stats.downlisted || 0,
  };

  const tabColorMap: Record<string, string> = {
    pending: 'var(--warm-orange)',
    ready: 'var(--moss-green)',
    listed: 'var(--soft-blue)',
    downlisted: 'var(--cream-text-muted)',
  };

  // 移动端禁止背景滚动
  useEffect(() => {
    if (device.isMobile && sheetOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sheetOpen, device.isMobile]);

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <motion.div className="mb-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex flex-wrap items-center gap-2.5 mb-1">
          <h2 className="m-0" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '1.125rem', fontWeight: 600, color: 'var(--cream-dark)' }}>
            商品选品中心
          </h2>
          <span
            className="px-2.5 py-0.5 rounded-full"
            style={{
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: 'var(--cream-text-muted)',
              background: 'var(--cream-border)',
            }}
            title="链接提取为模拟演示，接入1688 API后将获取真实商品信息"
          >
            模拟提取
          </span>
        </div>
        <p className="m-0" style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>
          1688 选品 → 利润测算 → 小红书上架，全流程管理
        </p>
      </motion.div>

      {/* Dashboard */}
      <DashboardPanel />

      {/* Extract Mode Label */}
      <motion.div className="mb-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03, duration: 0.4 }}>
        <div className="flex gap-1 p-1 rounded-xl inline-flex" style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)' }}>
          <div
            className="px-4 py-1.5 rounded-lg"
            style={{
              background: 'var(--moss-green)',
              color: '#fff',
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            粘贴页面源码提取
          </div>
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: 'transparent',
              color: 'var(--cream-text-muted)',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            怎么用？
          </button>
        </div>
      </motion.div>

      {/* Guide Panel */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 overflow-hidden"
          >
            <div className="p-4 rounded-2xl" style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)' }}>
              <div className="space-y-2" style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-dark)', lineHeight: 1.7 }}>
                <p style={{ fontFamily: "'Poppins',var(--font-sans)", fontWeight: 600, marginBottom: '8px' }}>粘贴页面源码使用说明</p>
                <p>1. 在1688商品页面，按 <kbd style={{ padding: '2px 6px', borderRadius: '4px', background: 'var(--cream-border)', fontFamily: 'monospace' }}>F12</kbd> 打开开发者工具</p>
                <p>2. 点击顶部的 <span style={{ color: 'var(--soft-blue)', fontWeight: 500 }}>Elements</span>（元素）标签</p>
                <p>3. 选中 <code style={{ padding: '2px 6px', borderRadius: '4px', background: 'var(--cream-border)', fontFamily: 'monospace' }}>&lt;html&gt;</code> 标签，按 <kbd style={{ padding: '2px 6px', borderRadius: '4px', background: 'var(--cream-border)', fontFamily: 'monospace' }}>Ctrl+C</kbd> 复制</p>
                <p>4. 粘贴到下方文本框，同时在链接框粘贴商品URL，点击"提取"</p>
                <p style={{ color: 'var(--moss-green)' }}>✅ 可提取：商品标题、价格、图片、规格、店铺信息、发货信息等完整数据</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {extractError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 p-3 rounded-xl"
          style={{ background: 'color-mix(in srgb, var(--warm-orange) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--warm-orange) 30%, transparent)', color: 'var(--warm-orange)', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem' }}
        >
          {extractError}
        </motion.div>
      )}

      {/* Success Message */}
      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-3 p-3 rounded-xl"
          style={{ background: 'color-mix(in srgb, var(--moss-green) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--moss-green) 30%, transparent)', color: 'var(--moss-green)', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem' }}
        >
          {successMsg}
        </motion.div>
      )}

      {/* HTML Input Mode */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-3 mb-4"
      >
        <div className="relative">
          <textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            placeholder="在此粘贴1688商品页面源码（F12 → 复制html标签内容）..."
            className="w-full px-4 py-3 rounded-xl outline-none resize-none transition-all overflow-auto"
            style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)', fontFamily: "'Monaco','JetBrains Mono',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-dark)', minHeight: '110px', maxHeight: '200px', lineHeight: 1.5 }}
            disabled={isExtracting}
            rows={5}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--cream-text-muted)', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
              <path d="M10 13a5 5 0 0 1 5-5h4a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-4a5 5 0 0 1-5-5z" />
            </svg>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="商品链接（可选，用于记录来源）"
              className="w-full h-10 pl-9 pr-3 rounded-xl outline-none transition-all"
              style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-dark)' }}
              disabled={isExtracting}
            />
          </div>
          <motion.button
            type="button"
            onClick={handlePasteFromClipboard}
            disabled={isExtracting}
            className="h-10 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all flex-shrink-0"
            style={{ background: 'var(--cream-bg)', color: 'var(--soft-blue)', border: '1px solid var(--cream-border)', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, cursor: isExtracting ? 'not-allowed' : 'pointer' }}
            whileTap={isExtracting ? {} : { scale: 0.97 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M8 10h8" /><path d="M8 14h8" /><path d="M8 18h5" /></svg>
            粘贴
          </motion.button>
          <motion.button
            type="button"
            onClick={handleExtractHtml}
            disabled={!htmlContent.trim() || isExtracting}
            className="h-10 px-5 rounded-xl flex items-center justify-center gap-2 transition-all flex-shrink-0"
            style={{ background: (!htmlContent.trim() || isExtracting) ? 'var(--cream-border)' : 'var(--moss-green)', color: 'var(--text-on-primary)', border: 'none', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.8125rem', fontWeight: 500, cursor: (!htmlContent.trim() || isExtracting) ? 'not-allowed' : 'pointer', boxShadow: (!htmlContent.trim() || isExtracting) ? 'none' : '0 4px 12px rgba(120,140,93,0.3)' }}
            whileTap={(!htmlContent.trim() || isExtracting) ? {} : { scale: 0.97 }}
          >
            {isExtracting ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                解析中...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                解析提取
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
      <div className="mb-4 text-right hidden sm:block" style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.6875rem', color: 'var(--cream-text-muted)' }}>
        {formatDate(lastRefresh)} 更新
      </div>

      {/* Tabs - Segmented Control */}
      <motion.div className="mb-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
        <div className="flex gap-1.5 p-1 rounded-xl overflow-x-auto no-scrollbar" style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)' }}>
          {tabOptions.map((tab) => {
            const count = tabCounts[tab.value as keyof typeof tabCounts] || 0;
            const isActive = activeTab === tab.value;
            const color = tabColorMap[tab.value];
            return (
              <motion.button
                key={tab.value}
                type="button"
                onClick={() => { setActiveTab(tab.value); setSelectedId(null); }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg flex-shrink-0 transition-all"
                style={{
                  background: isActive ? color : 'transparent',
                  color: isActive ? '#fff' : 'var(--cream-dark)',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Poppins',var(--font-sans)",
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  minHeight: '36px',
                }}
                whileTap={{ scale: 0.97 }}
              >
                <span>{tab.label}</span>
                <span
                  className="px-1.5 py-0.5 rounded-full"
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    background: isActive ? 'var(--surface-light)' : `${color}20`,
                    color: isActive ? '#fff' : color,
                    minWidth: '18px',
                    textAlign: 'center',
                  }}
                >
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Product List */}
        <motion.div ref={listRef} className="w-full lg:w-[340px] flex flex-col" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="m-0 uppercase" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 600, color: 'var(--cream-dark)' }}>商品列表</h3>
            <span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>{filteredProducts.length} 个商品</span>
          </div>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => {
                const stColors: Record<ProductStatus, { label: string; color: string; bg: string }> = {
                  pending: { label: '未上架', color: 'var(--warm-orange)', bg: 'color-mix(in srgb, var(--warm-orange) 12%, transparent)' },
                  ready: { label: '准备上架', color: 'var(--moss-green)', bg: 'color-mix(in srgb, var(--moss-green) 12%, transparent)' },
                  listed: { label: '已上架', color: 'var(--soft-blue)', bg: 'color-mix(in srgb, var(--soft-blue) 12%, transparent)' },
                  downlisted: { label: '已下架', color: 'var(--cream-text-muted)', bg: 'color-mix(in srgb, var(--cream-text-muted) 12%, transparent)' },
                  rejected: { label: '已驳回', color: 'var(--cream-text-muted)', bg: 'color-mix(in srgb, var(--cream-text-muted) 12%, transparent)' },
                };
                const st = stColors[product.status];
                const categoryColors: Record<string, string> = {
                  '服饰': '#E87C6B', '家居': '#7BA3A8', '数码': '#5B8DB8', '美妆': '#D478A8',
                  '食品': '#C4A35A', '母婴': '#8FB8A8', '运动': '#7A9E7E', '配饰': '#A890C4', '其他': '#B8B0A0',
                };
                const catColor = categoryColors[product.category] || '#B8B0A0';
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.03, duration: 0.3 }}
                    className="p-3 rounded-2xl cursor-pointer group relative"
                    style={{
                      background: 'var(--cream-bg)',
                      border: `1px solid ${selectedId === product.id && !device.isMobile ? 'var(--soft-blue)' : 'var(--cream-border)'}`,
                    }}
                    onClick={() => handleSelectProduct(product)}
                    whileTap={{ scale: 0.97 }}
                  >
                    <motion.button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); deleteProduct(product.id); }}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-md flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all z-10"
                      style={{ background: 'rgba(217,119,87,0.1)', border: 'none', color: 'var(--warm-orange)', cursor: 'pointer' }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </motion.button>
                    <div className="flex gap-3">
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ background: 'var(--cream-border)' }}>
                        {product.images[0]?.url ? (
                          <img src={product.images[0].url} alt={product.images[0].alt} className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        ) : (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--cream-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="px-1.5 py-0.5 rounded flex-shrink-0" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.625rem', fontWeight: 500, color: st.color, background: st.bg }}>{st.label}</span>
                          <span className="px-1.5 py-0.5 rounded flex-shrink-0" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.625rem', fontWeight: 500, color: catColor, background: `${catColor}18` }}>{product.category}</span>
                        </div>
                        <h4 className="m-0 mb-1.5" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.8125rem', fontWeight: 600, color: 'var(--cream-dark)', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {product.title}
                        </h4>
                        {product.supplier.tags && product.supplier.tags.length > 0 && (
                          <div className="flex flex-nowrap gap-1 mb-1.5">
                            {product.supplier.tags.slice(0, 2).map((tag, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded text-xs font-medium" style={{
                                background: tag === '超级工厂' ? 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)' :
                                  tag === '源头旗舰' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' :
                                  tag === '实力商家' ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' :
                                  'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                                color: 'var(--text-on-primary)',
                                fontFamily: "'Poppins',var(--font-sans)",
                                fontSize: '0.625rem',
                              }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.875rem', fontWeight: 600, color: 'var(--warm-orange)' }}>{product.price}</span>
                          {product.profit.sellingPrice > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ fontFamily: "'Poppins',var(--font-sans)", color: 'var(--text-on-primary)', background: product.profit.profitMargin >= 50 ? 'var(--moss-green)' : 'var(--warm-orange)' }}>
                              利润 {product.profit.profitMargin}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {filteredProducts.length === 0 && (
              <motion.div className="text-center py-12 rounded-2xl" style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--cream-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 1 5-5h4a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-4a5 5 0 0 1-5-5z" /><polyline points="10 13 7 16 10 19" /></svg>
                <p className="m-0 mt-2" style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>
                  {activeTab === 'pending' ? '暂无未上架商品，粘贴1688链接开始选品' : activeTab === 'ready' ? '暂无准备上架商品' : activeTab === 'listed' ? '暂无已上架商品' : '暂无已下架商品'}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Product Detail - Desktop Only */}
        {!device.isMobile && (
          <motion.div className="flex-1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
            {selectedProduct ? (
              <ProductDetail
                product={selectedProduct}
                activeImageIndex={activeImageIndex}
                setActiveImageIndex={setActiveImageIndex}
                sellingPriceInput={sellingPriceInput}
                setSellingPriceInput={setSellingPriceInput}
                shippingCostInput={shippingCostInput}
                setShippingCostInput={setShippingCostInput}
                notesInput={notesInput}
                setNotesInput={setNotesInput}
                xhsUrlInput={xhsUrlInput}
                setXhsUrlInput={setXhsUrlInput}
                handleUpdateProfit={handleUpdateProfit}
                handleUpdateNotes={handleUpdateNotes}
                handleOpenListModal={handleOpenListModal}
                updateDropshippingRules={updateDropshippingRules}
                updateProductStatus={updateProductStatus}
                downlistProduct={downlistProduct}
                setActiveTab={setActiveTab}
                onClose={() => setSelectedId(null)}
                isSheet={false}
              />
            ) : (
              <div className="h-full rounded-2xl flex flex-col items-center justify-center py-20" style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)' }}>
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--cream-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 1 5-5h4a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-4a5 5 0 0 1-5-5z" /><polyline points="10 13 7 16 10 19" /></svg>
                <p className="m-0 mt-4" style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.875rem', color: 'var(--cream-text-muted)' }}>选择商品查看详情</p>
                <p className="m-0 mt-1" style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>或粘贴1688网址提取新商品</p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Bottom Sheet - Mobile Only */}
      {device.isMobile && (
        <AnimatePresence>
          {sheetOpen && selectedProduct && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 z-40"
                style={{ background: 'rgba(0,0,0,0.4)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSheetOpen(false)}
              />
              {/* Sheet */}
              <motion.div
                ref={sheetRef}
                className="fixed left-0 right-0 bottom-0 z-50 flex flex-col"
                style={{
                  maxHeight: '85vh',
                  background: 'var(--cream-bg)',
                  borderTopLeftRadius: '24px',
                  borderTopRightRadius: '24px',
                }}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 35, mass: 0.9 }}
              >
                {/* Drag Handle */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-10 h-1 rounded-full" style={{ background: 'var(--cream-border)' }} />
                </div>

                {/* Close Button */}
                <div className="flex justify-end px-4 pb-2">
                  <motion.button
                    type="button"
                    onClick={() => setSheetOpen(false)}
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--cream-border)', border: 'none', color: 'var(--cream-dark)', cursor: 'pointer' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </motion.button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-4 pb-8">
                  <ProductDetail
                    product={selectedProduct}
                    activeImageIndex={activeImageIndex}
                    setActiveImageIndex={setActiveImageIndex}
                    sellingPriceInput={sellingPriceInput}
                    setSellingPriceInput={setSellingPriceInput}
                    shippingCostInput={shippingCostInput}
                    setShippingCostInput={setShippingCostInput}
                    notesInput={notesInput}
                    setNotesInput={setNotesInput}
                    xhsUrlInput={xhsUrlInput}
                    setXhsUrlInput={setXhsUrlInput}
                    handleUpdateProfit={handleUpdateProfit}
                    handleUpdateNotes={handleUpdateNotes}
                    handleOpenListModal={handleOpenListModal}
                    updateDropshippingRules={updateDropshippingRules}
                    updateProductStatus={updateProductStatus}
                    downlistProduct={downlistProduct}
                    setActiveTab={setActiveTab}
                    onClose={() => setSheetOpen(false)}
                    isSheet={true}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

interface ProductDetailProps {
  product: ProductInfo;
  activeImageIndex: number;
  setActiveImageIndex: (i: number) => void;
  sellingPriceInput: string;
  setSellingPriceInput: (v: string) => void;
  shippingCostInput: string;
  setShippingCostInput: (v: string) => void;
  notesInput: string;
  setNotesInput: (v: string) => void;
  xhsUrlInput: string;
  setXhsUrlInput: (v: string) => void;
  handleUpdateProfit: () => void;
  handleUpdateNotes: () => void;
  handleOpenListModal: () => void;
  updateDropshippingRules: (id: string, rules: Partial<ProductInfo['dropshipping']>) => void;
  updateProductStatus: (id: string, status: ProductStatus) => void;
  downlistProduct: (id: string) => void;
  setActiveTab: (tab: ProductStatus | 'all') => void;
  onClose: () => void;
  isSheet?: boolean;
}

function ProductDetail(props: ProductDetailProps) {
  const { product, activeImageIndex, setActiveImageIndex, sellingPriceInput, setSellingPriceInput, shippingCostInput, setShippingCostInput, notesInput, setNotesInput, xhsUrlInput, setXhsUrlInput, handleUpdateProfit, handleUpdateNotes, handleOpenListModal, updateDropshippingRules, updateProductStatus, downlistProduct, setActiveTab, onClose } = props;

  const categoryColors: Record<string, string> = {
    '服饰': '#E87C6B', '家居': '#7BA3A8', '数码': '#5B8DB8', '美妆': '#D478A8',
    '食品': '#C4A35A', '母婴': '#8FB8A8', '运动': '#7A9E7E', '配饰': '#A890C4', '其他': '#B8B0A0',
  };
  const catColor = categoryColors[product.category] || '#B8B0A0';

  return (
    <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
      {/* Top Section */}
      <div className="flex flex-col gap-4">
        <div className="w-full flex flex-col">
          <div className="rounded-2xl overflow-hidden mb-3" style={{ background: 'var(--cream-border)', maxHeight: '140px' }}>
            <img
              src={product.images[activeImageIndex]?.url}
              alt={product.images[activeImageIndex]?.alt}
              className="w-full object-contain"
              style={{ maxHeight: '140px', margin: '0 auto', display: 'block' }}
              referrerPolicy="no-referrer"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {product.images.map((img, idx) => (
                <motion.button key={idx} type="button" onClick={() => setActiveImageIndex(idx)} className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 transition-all flex items-center justify-center" style={{ border: `2px solid ${activeImageIndex === idx ? 'var(--soft-blue)' : 'transparent'}`, cursor: 'pointer', background: 'var(--cream-border)' }} whileTap={{ scale: 0.97 }}>
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </motion.button>
              ))}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.625rem', fontWeight: 500, color: 'var(--soft-blue)', background: 'color-mix(in srgb, var(--soft-blue) 15%, transparent)' }}>1688</span>
              <span className="px-2 py-0.5 rounded-full" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.625rem', fontWeight: 500, color: catColor, background: `${catColor}18` }}>{product.category}</span>
            </div>
            <motion.button type="button" onClick={() => window.open(product.url, '_blank')} className="h-10 px-3 rounded-lg flex items-center gap-1 flex-shrink-0" style={{ background: 'color-mix(in srgb, var(--soft-blue) 10%, transparent)', color: 'var(--soft-blue)', border: '1px solid var(--soft-blue)', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.6875rem', fontWeight: 500, cursor: 'pointer' }} whileTap={{ scale: 0.97 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
              原链接
            </motion.button>
          </div>
          <h1 className="m-0 mb-3" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '1.0625rem', fontWeight: 600, color: 'var(--cream-dark)', lineHeight: 1.4 }}>{product.title}</h1>
          <div className="flex items-baseline gap-3 mb-2">
            <span style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '1.25rem', fontWeight: 700, color: 'var(--warm-orange)' }}>{product.price}</span>
            {product.originalPrice && <span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.875rem', color: 'var(--cream-text-muted)', textDecoration: 'line-through' }}>{product.originalPrice}</span>}
            <span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>已售 {product.sales}</span>
          </div>
          <p className="m-0" style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)', lineHeight: 1.5 }}>{product.description}</p>
        </div>
      </div>

      {/* Supplier Card */}
      <div className="p-4 rounded-2xl" style={{ background: 'var(--background)', border: '1px solid var(--cream-border)' }}>
        <h3 className="m-0 mb-3 uppercase" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 600, color: 'var(--cream-dark)' }}>供应商评估</h3>
        <div className="space-y-2.5 mb-3">
          <div>
            <div className="flex items-center justify-between mb-1"><span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>店铺</span><span style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, color: 'var(--cream-dark)' }}>{product.supplier.name}</span></div>
            {product.supplier.tags && product.supplier.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {product.supplier.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded text-xs font-medium" style={{
                    background: tag === '超级工厂' ? 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)' :
                      tag === '源头旗舰' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' :
                      tag === '实力商家' ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' :
                      'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                    color: 'var(--text-on-primary)',
                    fontFamily: "'Poppins',var(--font-sans)",
                    fontSize: '0.625rem',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between"><span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>评分</span><span style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 600, color: 'var(--warm-orange)' }}>{product.supplier.rating} ★</span></div>
          <div className="flex items-center justify-between"><span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>经营年限</span><span style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, color: 'var(--cream-dark)' }}>{product.supplier.yearsInBusiness} 年</span></div>
          <div className="flex items-center justify-between"><span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>响应时间</span><span style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, color: 'var(--cream-dark)' }}>{product.supplier.responseTime}</span></div>
        </div>
        <div className="pt-3 space-y-2" style={{ borderTop: '1px solid var(--cream-border)' }}>
          <CheckItem label="一件代发" checked={product.dropshipping.supportsDropshipping} onToggle={() => updateDropshippingRules(product.id, { supportsDropshipping: !product.dropshipping.supportsDropshipping })} />
          <CheckItem label="小红书面单" checked={product.dropshipping.providesXhsWaybill} onToggle={() => updateDropshippingRules(product.id, { providesXhsWaybill: !product.dropshipping.providesXhsWaybill })} />
          <CheckItem label="包邮退货" checked={product.dropshipping.supportsFreeReturn} onToggle={() => updateDropshippingRules(product.id, { supportsFreeReturn: !product.dropshipping.supportsFreeReturn })} />
        </div>
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--cream-border)' }}>
          <p className="m-0 mb-1" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.625rem', fontWeight: 600, color: 'var(--cream-text-muted)' }}>退货政策</p>
          <p className="m-0" style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.6875rem', color: 'var(--cream-dark)', lineHeight: 1.4 }}>{product.dropshipping.returnPolicy}</p>
        </div>
      </div>

      {/* Profit / Product Info */}
      {product.status !== 'listed' && product.status !== 'downlisted' && (
        <>
          <div className="p-4 rounded-2xl" style={{ background: 'var(--background)', border: '1px solid var(--cream-border)' }}>
            <h3 className="m-0 mb-3 uppercase" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 600, color: 'var(--cream-dark)' }}>利润测算</h3>
            <div className="space-y-2.5 mb-3">
              <div className="flex items-center justify-between"><span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>1688进价</span><span style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, color: 'var(--cream-dark)' }}>¥{product.profit.costPrice}</span></div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>小红书售价</span>
                </div>
                <input
                  type="number"
                  value={sellingPriceInput}
                  onChange={(e) => setSellingPriceInput(e.target.value)}
                  placeholder="输入售价"
                  className="w-full h-11 px-3 rounded-lg outline-none"
                  style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.8125rem', color: 'var(--cream-dark)' }}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>运费成本</span>
                </div>
                <input
                  type="number"
                  value={shippingCostInput}
                  onChange={(e) => setShippingCostInput(e.target.value)}
                  placeholder="运费"
                  className="w-full h-11 px-3 rounded-lg outline-none"
                  style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.8125rem', color: 'var(--cream-dark)' }}
                />
              </div>
              <div className="flex items-center justify-between"><span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>平台服务费(5%)</span><span style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, color: 'var(--cream-dark)' }}>¥{sellingPriceInput ? (parseFloat(sellingPriceInput) * 0.05).toFixed(2) : '0.00'}</span></div>
            </div>
            <div className="pt-3 space-y-1.5" style={{ borderTop: '1px solid var(--cream-border)' }}>
              <div className="flex items-center justify-between"><span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>单件利润</span><span style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.875rem', fontWeight: 700, color: 'var(--moss-green)' }}>¥{sellingPriceInput && shippingCostInput ? (parseFloat(sellingPriceInput) - product.profit.costPrice - parseFloat(shippingCostInput) - parseFloat(sellingPriceInput) * 0.05).toFixed(2) : '0.00'}</span></div>
              <div className="flex items-center justify-between"><span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>利润率</span><span style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.875rem', fontWeight: 700, color: (() => { const sp = parseFloat(sellingPriceInput); if (!sp || sp <= 0) return 'var(--cream-text-muted)'; const sc = parseFloat(shippingCostInput) || 0; const margin = ((sp - product.profit.costPrice - sc - sp * 0.05) / sp) * 100; return margin >= 50 ? 'var(--moss-green)' : 'var(--warm-orange)'; })() }}>{(() => { const sp = parseFloat(sellingPriceInput); if (!sp || sp <= 0) return '0'; const sc = parseFloat(shippingCostInput) || 0; return (((sp - product.profit.costPrice - sc - sp * 0.05) / sp) * 100).toFixed(1); })()}%</span></div>
            </div>
            <motion.button
              type="button"
              onClick={handleUpdateProfit}
              disabled={!sellingPriceInput || parseFloat(sellingPriceInput) <= 0}
              className="w-full mt-3 h-11 rounded-xl"
              style={{ background: (!sellingPriceInput || parseFloat(sellingPriceInput) <= 0) ? 'var(--cream-border)' : 'var(--soft-blue)', color: 'var(--text-on-primary)', border: 'none', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.8125rem', fontWeight: 500, cursor: (!sellingPriceInput || parseFloat(sellingPriceInput) <= 0) ? 'not-allowed' : 'pointer' }}
              whileTap={(!sellingPriceInput || parseFloat(sellingPriceInput) <= 0) ? {} : { scale: 0.97 }}
            >
              保存利润测算
            </motion.button>
          </div>

          <div className="p-4 rounded-2xl" style={{ background: 'var(--background)', border: '1px solid var(--cream-border)' }}>
            <h3 className="m-0 mb-3 uppercase" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 600, color: 'var(--cream-dark)' }}>商品信息</h3>
            <div className="space-y-2.5 mb-3">
              <div className="flex items-center justify-between"><span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>发货地</span><span style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, color: 'var(--cream-dark)' }}>{product.location}</span></div>
              <div className="flex items-center justify-between"><span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>运费</span><span style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, color: 'var(--cream-dark)' }}>{product.shipping}</span></div>
              <div className="flex items-center justify-between"><span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>发货时间</span><span style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, color: 'var(--cream-dark)' }}>{product.deliveryTime}</span></div>
              <div className="flex items-center justify-between"><span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>起订量</span><span style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, color: 'var(--cream-dark)' }}>{product.dropshipping.minOrderQuantity} 件</span></div>
            </div>
            <div className="pt-3 mb-3" style={{ borderTop: '1px solid var(--cream-border)' }}>
              <p className="m-0 mb-2 uppercase" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.625rem', fontWeight: 600, color: 'var(--cream-text-muted)' }}>商品标签</p>
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.625rem', color: 'var(--soft-blue)', background: 'color-mix(in srgb, var(--soft-blue) 10%, transparent)' }}>{tag}</span>
                ))}
              </div>
            </div>
            <div className="pt-3 mb-3" style={{ borderTop: '1px solid var(--cream-border)' }}>
              <p className="m-0 mb-2 uppercase" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.625rem', fontWeight: 600, color: 'var(--cream-text-muted)' }}>小红书商品链接</p>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={xhsUrlInput}
                  onChange={(e) => setXhsUrlInput(e.target.value)}
                  placeholder="商品上线后粘贴链接..."
                  className="w-full h-11 px-3 rounded-lg outline-none"
                  style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.8125rem', color: 'var(--cream-dark)' }}
                />
                <motion.button
                  type="button"
                  onClick={handleOpenListModal}
                  disabled={!xhsUrlInput.trim()}
                  className="w-full h-11 rounded-lg"
                  style={{ background: !xhsUrlInput.trim() ? 'var(--cream-border)' : 'var(--moss-green)', color: 'var(--text-on-primary)', border: 'none', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.8125rem', fontWeight: 500, cursor: !xhsUrlInput.trim() ? 'not-allowed' : 'pointer' }}
                  whileTap={!xhsUrlInput.trim() ? {} : { scale: 0.97 }}
                >
                  绑定上架
                </motion.button>
              </div>
            </div>
            {product.xhsUrl && (
              <motion.button type="button" onClick={() => window.open(product.xhsUrl, '_blank')} className="w-full h-11 rounded-xl flex items-center justify-center gap-1.5 mb-2" style={{ background: 'var(--soft-blue)', color: 'var(--text-on-primary)', border: 'none', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer' }} whileTap={{ scale: 0.97 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                查看小红书商品
              </motion.button>
            )}
            {product.status === 'pending' && product.profit.sellingPrice > 0 && (
              <motion.button type="button" onClick={() => { updateProductStatus(product.id, 'ready'); setActiveTab('ready'); onClose(); }} className="w-full h-11 rounded-xl" style={{ background: 'var(--moss-green)', color: 'var(--text-on-primary)', border: 'none', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer' }} whileTap={{ scale: 0.97 }}>
                准备上架
              </motion.button>
            )}
            {product.status === 'ready' && (
              <motion.button type="button" onClick={() => { updateProductStatus(product.id, 'pending'); setActiveTab('pending'); onClose(); }} className="w-full h-11 rounded-xl" style={{ background: 'var(--cream-border)', color: 'var(--cream-dark)', border: 'none', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer' }} whileTap={{ scale: 0.97 }}>
                退回未上架
              </motion.button>
            )}
          </div>
        </>
      )}

      {product.status === 'listed' && (
        <div className="p-4 rounded-2xl" style={{ background: 'var(--background)', border: '1px solid var(--cream-border)' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="m-0 uppercase" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 600, color: 'var(--cream-dark)' }}>小红书上架</h3>
            {product.matchScore !== undefined && (
              <span className="px-2 py-0.5 rounded-full" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.625rem', fontWeight: 600, color: product.matchScore >= 80 ? 'var(--moss-green)' : 'var(--warm-orange)', background: product.matchScore >= 80 ? 'color-mix(in srgb, var(--moss-green) 12%, transparent)' : 'color-mix(in srgb, var(--warm-orange) 12%, transparent)' }}>
                匹配度 {product.matchScore}分
              </span>
            )}
          </div>
          <div className="space-y-2.5 mb-3">
            <div className="flex items-center justify-between"><span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>上架时间</span><span style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, color: 'var(--cream-dark)' }}>{product.listedAt ? new Date(product.listedAt).toLocaleDateString('zh-CN') : '-'}</span></div>
            <div className="flex items-center justify-between"><span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>1688进价</span><span style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, color: 'var(--cream-dark)' }}>¥{product.profit.costPrice}</span></div>
            <div className="flex items-center justify-between"><span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>小红书售价</span><span style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 600, color: 'var(--warm-orange)' }}>¥{product.xhsPrice || product.profit.sellingPrice}</span></div>
            <div className="flex items-center justify-between"><span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>单件毛利</span><span style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 600, color: 'var(--moss-green)' }}>¥{product.profit.profitPerUnit.toFixed(2)}</span></div>
            <div className="flex items-center justify-between"><span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>利润率</span><span style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 600, color: product.profit.profitMargin >= 50 ? 'var(--moss-green)' : 'var(--warm-orange)' }}>{product.profit.profitMargin}%</span></div>
            <div className="flex items-center justify-between"><span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.75rem', color: 'var(--cream-text-muted)' }}>运费成本</span><span style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, color: 'var(--cream-dark)' }}>¥{product.profit.shippingCost}</span></div>
          </div>
          <motion.button type="button" onClick={() => window.open(product.xhsUrl, '_blank')} className="w-full h-11 rounded-xl flex items-center justify-center gap-1.5 mb-2" style={{ background: 'var(--soft-blue)', color: 'var(--text-on-primary)', border: 'none', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer' }} whileTap={{ scale: 0.97 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
            查看小红书商品
          </motion.button>
          <motion.button type="button" onClick={() => { downlistProduct(product.id); setActiveTab('downlisted'); onClose(); }} className="w-full h-11 rounded-xl" style={{ background: 'var(--warm-orange)', color: 'var(--text-on-primary)', border: 'none', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer' }} whileTap={{ scale: 0.97 }}>
            下架商品
          </motion.button>
          <div className="pt-3 mt-3" style={{ borderTop: '1px solid var(--cream-border)' }}>
            <p className="m-0 mb-1" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.625rem', fontWeight: 600, color: 'var(--cream-text-muted)' }}>匹配分析</p>
            <p className="m-0" style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.6875rem', color: 'var(--cream-dark)', lineHeight: 1.5 }}>{product.matchAnalysis || '正在分析中...'}</p>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="p-4 rounded-2xl" style={{ background: 'var(--background)', border: '1px solid var(--cream-border)' }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="m-0 uppercase" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 600, color: 'var(--cream-dark)' }}>选品备注</h3>
          <motion.button type="button" onClick={handleUpdateNotes} className="px-4 h-10 rounded-lg" style={{ background: 'transparent', color: 'var(--soft-blue)', border: '1px solid var(--soft-blue)', fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer' }} whileTap={{ scale: 0.97 }}>保存</motion.button>
        </div>
        <textarea
          value={notesInput}
          onChange={(e) => setNotesInput(e.target.value)}
          placeholder="记录选品评估要点、供应商沟通情况..."
          className="w-full px-3 py-2 rounded-xl outline-none resize-none"
          style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)', fontFamily: "'Lora',var(--font-sans)", fontSize: '0.8125rem', color: 'var(--cream-dark)', minHeight: '100px' }}
          rows={4}
        />
      </div>
    </motion.div>
  );
}

function CheckItem({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <motion.button type="button" onClick={onToggle} className="w-full min-h-11 flex items-center justify-between" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }} whileTap={{ scale: 0.99 }}>
      <span style={{ fontFamily: "'Lora',var(--font-sans)", fontSize: '0.8125rem', color: 'var(--cream-dark)' }}>{label}</span>
      <span className="px-2 py-0.5 rounded-full" style={{ fontFamily: "'Poppins',var(--font-sans)", fontSize: '0.625rem', fontWeight: 500, color: checked ? 'var(--moss-green)' : 'var(--warm-orange)', background: checked ? 'color-mix(in srgb, var(--moss-green) 12%, transparent)' : 'color-mix(in srgb, var(--warm-orange) 12%, transparent)' }}>
        {checked ? '✓ 支持' : '✗ 不支持'}
      </span>
    </motion.button>
  );
}
