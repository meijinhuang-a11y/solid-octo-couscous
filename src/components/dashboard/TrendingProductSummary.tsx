import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Icon from '@/components/Icon';
import { useTrendingProductStore } from '@/store/trendingProduct';

const platformColors: Record<string, string> = {
  抖音: '#000',
  淘宝: '#FF4200',
  京东: '#E4393C',
  小红书: '#FE2C55',
  拼多多: '#E02E24',
  视频号: '#07C160',
};

const categoryEmoji: Record<string, string> = {
  数码配件: '🎧',
  家居生活: '🏠',
  智能穿戴: '⌚',
  厨房电器: '🍳',
  个护健康: '💆',
  美妆个护: '💄',
  母婴玩具: '🧸',
};

export default function TrendingProductSummary() {
  const { getFilteredProducts } = useTrendingProductStore();
  const products = getFilteredProducts().slice(0, 4);

  return (
    <motion.section
      className="flex flex-col h-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.h3
        className="m-0 mb-4 flex items-center gap-1.5"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35, duration: 0.3 }}
      >
        <span
          className="inline-block rounded-full"
          style={{ width: '6px', height: '6px', background: 'var(--moss-green)' }}
        />
        <span
          style={{
            fontFamily: "'Poppins',var(--font-sans)",
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--cream-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          爆款产品
        </span>
        <Link
          to="/trending-product"
          className="ml-auto no-underline flex items-center gap-1"
          style={{
            fontFamily: "'Poppins',var(--font-sans)",
            fontSize: '0.75rem',
            color: 'var(--cream-text-muted)',
          }}
        >
          查看全部
          <Icon name="arrow" size={12} />
        </Link>
      </motion.h3>

      <motion.div
        className="rounded-2xl p-4 flex-1 flex flex-col overflow-hidden"
        style={{
          background: 'var(--cream-bg)',
          border: '1px solid var(--cream-border)',
          minHeight: 0,
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar flex-1">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="flex items-center gap-4 p-4 rounded-xl"
              style={{
                background: 'var(--surface)',
                border: '1px solid rgba(232,230,220,0.8)',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + index * 0.05, duration: 0.3 }}
              whileTap={{ scale: 0.99 }}
            >
              <div
                className="flex-shrink-0 rounded-xl flex items-center justify-center"
                style={{
                  width: '3rem',
                  height: '3rem',
                  background: `color-mix(in srgb, ${platformColors[product.platform] || 'var(--warm-orange)'} 15%, transparent)`,
                  fontSize: '1.5rem',
                  overflow: 'hidden',
                }}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  categoryEmoji[product.category] || '📦'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="m-0 mb-1"
                  style={{
                    fontFamily: "'Poppins',var(--font-sans)",
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    color: 'var(--cream-dark)',
                    lineHeight: 1.4,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {product.name}
                </p>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    style={{
                      fontFamily: "'Lora',var(--font-sans)",
                      fontSize: '0.8125rem',
                      color: 'var(--cream-text-muted)',
                    }}
                  >
                    {product.category}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: platformColors[product.platform] || 'var(--warm-orange)',
                    }}
                  >
                    ¥{product.price}
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
                  <span
                    className="ml-auto flex items-center gap-1"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: product.trend === 'up' ? 'var(--moss-green)' : product.trend === 'down' ? 'var(--soft-blue)' : 'var(--cream-text-muted)',
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>
                    {product.growthRate}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="px-1.5 py-0.5 rounded text-[0.625rem]"
                    style={{
                      background: platformColors[product.platform] || 'var(--warm-orange)',
                      color: '#fff',
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontWeight: 500,
                    }}
                  >
                    {product.platform}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      color: 'var(--cream-text-muted)',
                    }}
                  >
                    销量 {product.sales}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
          {products.length === 0 && (
            <div
              className="flex-1 flex items-center justify-center"
              style={{
                fontFamily: "'Lora',var(--font-sans)",
                fontSize: '0.8125rem',
                color: 'var(--cream-text-muted)',
              }}
            >
              暂无产品数据
            </div>
          )}
        </div>
      </motion.div>
    </motion.section>
  );
}
