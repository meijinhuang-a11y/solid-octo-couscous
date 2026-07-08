import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Icon from '@/components/Icon';

const products = [
  {
    id: 1,
    name: '无线降噪蓝牙耳机 Pro',
    category: '数码配件',
    price: '¥299',
    originalPrice: '¥499',
    sales: '3.2w',
    growth: '+156%',
    trend: 'rise',
    emoji: '🎧',
    color: 'var(--warm-orange)',
  },
  {
    id: 2,
    name: '智能美容仪 家用版',
    category: '美妆个护',
    price: '¥599',
    originalPrice: '¥899',
    sales: '1.8w',
    growth: '+98%',
    trend: 'rise',
    emoji: '💆',
    color: 'var(--soft-blue)',
  },
  {
    id: 3,
    name: '便携式胶囊咖啡机',
    category: '生活电器',
    price: '¥459',
    originalPrice: '¥699',
    sales: '1.5w',
    growth: '+72%',
    trend: 'rise',
    emoji: '☕',
    color: 'var(--moss-green)',
  },
  {
    id: 4,
    name: '儿童编程积木套装',
    category: '母婴玩具',
    price: '¥329',
    originalPrice: '¥499',
    sales: '9.8k',
    growth: '+45%',
    trend: 'rise',
    emoji: '🧩',
    color: 'var(--warm-orange)',
  },
];

export default function TrendingProductSummary() {
  return (
    <motion.section
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
        className="rounded-2xl p-4"
        style={{
          background: 'var(--cream-bg)',
          border: '1px solid var(--cream-border)',
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <div className="flex flex-col gap-3">
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
                  background: `color-mix(in srgb, ${product.color} 15%, transparent)`,
                  fontSize: '1.5rem',
                }}
              >
                {product.emoji}
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
                      color: product.color,
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
                    {product.originalPrice}
                  </span>
                  <span
                    className="ml-auto flex items-center gap-1"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--moss-green)',
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>
                    {product.growth}
                  </span>
                </div>
                <div className="flex items-center gap-2">
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
        </div>
      </motion.div>
    </motion.section>
  );
}
