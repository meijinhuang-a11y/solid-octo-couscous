import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { wgs84ToGcj02 } from '@/utils/coordTransform';

const DEFAULT_LNG = 116.4551;
const DEFAULT_LAT = 39.9269;
const DEFAULT_ZOOM = 14;

export default function WeatherWidget() {
  const [location, setLocation] = useState('北京市 · 朝阳区');
  const [lng, setLng] = useState(DEFAULT_LNG);
  const [lat, setLat] = useState(DEFAULT_LAT);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const weatherData = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    
    const baseWeather = [
      { icon: '☀️', high: 35, low: 25 },
      { icon: '⛅', high: 33, low: 24 },
      { icon: '🌤️', high: 34, low: 25 },
      { icon: '🌧️', high: 29, low: 23 },
      { icon: '⛈️', high: 27, low: 22 },
      { icon: '☀️', high: 32, low: 24 },
      { icon: '🌤️', high: 33, low: 24 },
    ];

    const result = [];
    for (let i = 0; i < 7; i++) {
      const idx = (dayOfWeek + i) % 7;
      result.push({
        day: i === 0 ? '今天' : weekDays[idx],
        ...baseWeather[i],
      });
    }
    return result;
  }, []);

  const [gcjLng, gcjLat] = useMemo(() => {
    return wgs84ToGcj02(lng, lat);
  }, [lng, lat]);

  const customIcon = useMemo(() => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: 32px;
        height: 32px;
        background: #FF6B35;
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
          width: 9px;
          height: 9px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  }, []);

  const initMap = useCallback(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [gcjLat, gcjLng],
      zoom: zoom,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      tap: false,
      touchZoom: false,
    });

    L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
      subdomains: ['1', '2', '3', '4'],
      maxZoom: 18,
    }).addTo(map);

    const marker = L.marker([gcjLat, gcjLng], { icon: customIcon, interactive: false }).addTo(map);

    mapInstanceRef.current = map;
    markerRef.current = marker;

    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [gcjLat, gcjLng, zoom, customIcon]);

  useEffect(() => {
    initMap();
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initMap]);

  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([gcjLat, gcjLng], zoom);
      markerRef.current.setLatLng([gcjLat, gcjLng]);
    }
  }, [gcjLat, gcjLng, zoom]);

  const handleLocationClick = () => {
    const [gcjLng, gcjLat] = wgs84ToGcj02(lng, lat);
    const mapUrl = `https://uri.amap.com/marker?position=${gcjLng},${gcjLat}&name=${encodeURIComponent(location)}`;
    window.open(mapUrl, '_blank');
  };

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((z) => Math.min(z + 1, 18));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((z) => Math.max(z - 1, 10));
  };

  const handleRefreshLocation = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLng(longitude);
            setLat(latitude);
            setLocation(`当前位置`);
            setTimeout(() => setIsLoading(false), 1000);
          },
          () => {
            setLocation('北京市 · 朝阳区');
            setLng(DEFAULT_LNG);
            setLat(DEFAULT_LAT);
            setTimeout(() => setIsLoading(false), 1000);
          },
          { timeout: 10000, enableHighAccuracy: true }
        );
      } else {
        setTimeout(() => setIsLoading(false), 1000);
      }
    } catch {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  return (
    <motion.section
      className="p-4 rounded-2xl flex flex-col"
      style={{
        background: 'var(--cream-bg)',
        border: '1px solid var(--cream-border)',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            style={{
              width: '4px',
              height: '16px',
              borderRadius: '2px',
              background: 'linear-gradient(180deg, var(--soft-blue), var(--moss-green))',
            }}
          />
          <motion.h3
            className="m-0"
            style={{
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--cream-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.3 }}
          >
            我的位置与天气
          </motion.h3>
        </div>
        <motion.button
          type="button"
          onClick={handleLocationClick}
          className="flex items-center gap-1 px-2 py-1 rounded-lg"
          style={{
            fontFamily: "'Lora',var(--font-sans)",
            fontSize: '0.75rem',
            color: 'var(--soft-blue)',
            background: 'color-mix(in srgb, var(--soft-blue) 8%, transparent)',
            border: 'none',
            cursor: 'pointer',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {location}
        </motion.button>
      </div>
      <motion.div
        style={{
          width: '16px',
          height: '2px',
          background: 'var(--soft-blue)',
          borderRadius: '1px',
          marginBottom: '8px',
          originX: 0,
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      />

      <motion.div
        className="w-full rounded-xl relative overflow-hidden mb-3 flex-shrink-0"
        style={{
          aspectRatio: '16/7',
          cursor: 'pointer',
          border: '1px solid var(--cream-border)',
          background: 'var(--surface)',
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35, duration: 0.3 }}
        onClick={handleLocationClick}
      >
        <div
          ref={mapRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}
        />

        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-20"
              style={{
                background: 'color-mix(in srgb, var(--cream-bg) 70%, transparent)',
                backdropFilter: 'blur(2px)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{
                  width: '24px',
                  height: '24px',
                  border: '2px solid var(--cream-border)',
                  borderTopColor: 'var(--soft-blue)',
                  borderRadius: '50%',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-2 right-2 flex flex-col gap-1 z-10">
          <motion.button
            type="button"
            onClick={handleZoomIn}
            className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{
              background: 'var(--cream-bg)',
              border: '1px solid var(--cream-border)',
              color: 'var(--cream-dark)',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
              fontSize: '1rem',
              fontWeight: 600,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            +
          </motion.button>
          <motion.button
            type="button"
            onClick={handleZoomOut}
            className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{
              background: 'var(--cream-bg)',
              border: '1px solid var(--cream-border)',
              color: 'var(--cream-dark)',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
              fontSize: '1rem',
              fontWeight: 600,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            −
          </motion.button>
          <motion.button
            type="button"
            onClick={handleRefreshLocation}
            className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{
              background: 'var(--cream-bg)',
              border: '1px solid var(--cream-border)',
              color: 'var(--soft-blue)',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-3-6.7L21 8"/>
              <path d="M21 3v5h-5"/>
            </svg>
          </motion.button>
        </div>
      </motion.div>

      <div
        className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 hide-scrollbar"
      >
        {weatherData.map((weather, index) => (
          <motion.div
            key={index}
            className="text-center rounded-xl flex-shrink-0"
            style={{
              padding: '10px 12px',
              minWidth: '56px',
              background: 'var(--surface)',
              border: '1px solid rgba(232,230,220,0.8)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
            whileTap={{ scale: 0.97 }}
          >
            <div
              style={{
                fontFamily: "'Poppins',var(--font-sans)",
                fontSize: '0.75rem',
                color: 'var(--cream-text-muted)',
                marginBottom: '4px',
              }}
            >
              {weather.day}
            </div>
            <div
              className="text-base my-1"
              style={{ lineHeight: 1 }}
            >
              {weather.icon}
            </div>
            <div
              style={{
                fontFamily: "'Poppins',var(--font-sans)",
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--cream-dark)',
                marginTop: '4px',
              }}
            >
              {weather.high}°
            </div>
            <div
              style={{
                fontFamily: "'Poppins',var(--font-sans)",
                fontSize: '0.75rem',
                color: 'var(--cream-text-muted)',
              }}
            >
              {weather.low}°
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
