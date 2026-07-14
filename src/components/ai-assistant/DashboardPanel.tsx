import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProductExtractorStore } from '@/store/productExtractor';
import { categoryColors } from '@/store/productExtractor';
import type { ProductCategory } from '@/types';

export default function DashboardPanel() {
  const products = useProductExtractorStore((state) => state.products);

  const stats = useMemo(() => {
    const listed = products.filter((p) => p.status === 'listed');
    const totalProfit = listed.reduce((sum, p) => sum + p.profit.profitPerUnit, 0);
    const avgMargin = listed.length > 0
      ? +(listed.reduce((sum, p) => sum + p.profit.profitMargin, 0) / listed.length).toFixed(1)
      : 0;

    const categories: { category: ProductCategory; total: number; listed: number; ready: number; pending: number; totalProfit: number; avgMargin: number; color: string }[] = [];
    const categoryKeywords = Object.keys(categoryColors) as ProductCategory[];

    for (const category of categoryKeywords) {
      if (category === '其他') continue;
      const catProducts = products.filter((p) => p.category === category);
      if (catProducts.length === 0) continue;
      const catListed = catProducts.filter((p) => p.status === 'listed');
      const catTotalProfit = catListed.reduce((sum, p) => sum + p.profit.profitPerUnit, 0);
      const catAvgMargin = catListed.length > 0
        ? +(catListed.reduce((sum, p) => sum + p.profit.profitMargin, 0) / catListed.length).toFixed(1)
        : 0;
      categories.push({
        category,
        total: catProducts.length,
        listed: catListed.length,
        ready: catProducts.filter((p) => p.status === 'ready').length,
        pending: catProducts.filter((p) => p.status === 'pending').length,
        totalProfit: +catTotalProfit.toFixed(2),
        avgMargin: catAvgMargin,
        color: categoryColors[category],
      });
    }

    categories.sort((a, b) => b.totalProfit - a.totalProfit);

    return {
      totalProducts: products.length,
      listedProducts: listed.length,
      totalProfit: +totalProfit.toFixed(2),
      avgMargin,
      categories,
    };
  }, [products]);

  const overviewCards = [
    { label: '总商品数', value: stats.totalProducts, color: 'var(--cream-dark)', icon: '📦' },
    { label: '已上架', value: stats.listedProducts, color: 'var(--soft-blue)', icon: '🏪' },
    { label: '总利润额', value: `¥${stats.totalProfit.toFixed(2)}`, color: 'var(--moss-green)', icon: '💰' },
    { label: '平均利润率', value: `${stats.avgMargin}%`, color: 'var(--warm-orange)', icon: '📈' },
  ];

  return (
    <motion.div
      className="mb-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05, duration: 0.4 }}
    >
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {overviewCards.map((card, i) => (
          <motion.div
            key={card.label}
            className="p-4 rounded-2xl"
            style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span style={{ fontSize: '1.25rem' }}>{card.icon}</span>
              <span
                className="uppercase"
                style={{
                  fontFamily: "'Lora',var(--font-sans)",
                  fontSize: '0.75rem',
                  color: 'var(--cream-text-muted)',
                }}
              >
                {card.label}
              </span>
            </div>
            <p
              className="m-0"
              style={{
                fontFamily: "'Poppins',var(--font-sans)",
                fontSize: '1.25rem',
                fontWeight: 700,
                color: card.color,
              }}
            >
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Category Breakdown */}
      {stats.categories.length > 0 && (
        <motion.div
          className="p-4 rounded-2xl"
          style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <h3
            className="m-0 mb-3 uppercase"
            style={{
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--cream-dark)',
            }}
          >
            垂类利润分布
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.categories.map((cat, i) => (
              <motion.div
                key={cat.category}
                className="p-4 rounded-2xl"
                style={{
                  background: 'var(--background)',
                  border: `1px solid ${cat.color}30`,
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + i * 0.05, duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: cat.color }}
                  />
                  <span
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--cream-dark)',
                    }}
                  >
                    {cat.category}
                  </span>
                  <span
                    className="ml-auto px-1.5 py-0.5 rounded"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.625rem',
                      fontWeight: 500,
                      color: cat.color,
                      background: `${cat.color}15`,
                    }}
                  >
                    {cat.total} 个
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontFamily: "'Lora',var(--font-sans)",
                        fontSize: '0.6875rem',
                        color: 'var(--cream-text-muted)',
                      }}
                    >
                      已上架
                    </span>
                    <span
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: 'var(--soft-blue)',
                      }}
                    >
                      {cat.listed}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontFamily: "'Lora',var(--font-sans)",
                        fontSize: '0.6875rem',
                        color: 'var(--cream-text-muted)',
                      }}
                    >
                      准备上架
                    </span>
                    <span
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: 'var(--warm-orange)',
                      }}
                    >
                      {cat.ready}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontFamily: "'Lora',var(--font-sans)",
                        fontSize: '0.6875rem',
                        color: 'var(--cream-text-muted)',
                      }}
                    >
                      总利润
                    </span>
                    <span
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        color: 'var(--moss-green)',
                      }}
                    >
                      ¥{cat.totalProfit.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontFamily: "'Lora',var(--font-sans)",
                        fontSize: '0.6875rem',
                        color: 'var(--cream-text-muted)',
                      }}
                    >
                      平均利润率
                    </span>
                    <span
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: cat.avgMargin >= 50 ? 'var(--moss-green)' : 'var(--warm-orange)',
                      }}
                    >
                      {cat.avgMargin}%
                    </span>
                  </div>
                </div>
                {/* Profit bar */}
                <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--cream-border)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: cat.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((cat.totalProfit / (stats.categories[0]?.totalProfit || 1)) * 100, 100)}%` }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
