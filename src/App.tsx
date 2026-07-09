import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";

const TasksPage = lazy(() => import("@/pages/TasksPage"));
const NotesPage = lazy(() => import("@/pages/NotesPage"));
const PhotoPage = lazy(() => import("@/pages/PhotoPage"));
const CopywritingPage = lazy(() => import("@/pages/CopywritingPage"));
const VideoPage = lazy(() => import("@/pages/VideoPage"));
const FilePage = lazy(() => import("@/pages/FilePage"));
const NewsPage = lazy(() => import("@/pages/NewsPage"));
const WhitepaperPage = lazy(() => import("@/pages/WhitepaperPage"));
const ProductExtractorPage = lazy(() => import("@/pages/ProductExtractorPage"));
const TrendingVideoPage = lazy(() => import("@/pages/TrendingVideoPage"));
const TrendingProductPage = lazy(() => import("@/pages/TrendingProductPage"));
const HotSearchPage = lazy(() => import("@/pages/HotSearchPage"));

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--soft-blue)', borderTopColor: 'transparent' }} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={
            <Suspense fallback={<Loading />}>
              <TasksPage />
            </Suspense>
          } />
          <Route path="notes" element={
            <Suspense fallback={<Loading />}>
              <NotesPage />
            </Suspense>
          } />
          <Route path="photo" element={
            <Suspense fallback={<Loading />}>
              <PhotoPage />
            </Suspense>
          } />
          <Route path="copywriting" element={
            <Suspense fallback={<Loading />}>
              <CopywritingPage />
            </Suspense>
          } />
          <Route path="video" element={
            <Suspense fallback={<Loading />}>
              <VideoPage />
            </Suspense>
          } />
          <Route path="files" element={
            <Suspense fallback={<Loading />}>
              <FilePage />
            </Suspense>
          } />
          <Route path="news" element={
            <Suspense fallback={<Loading />}>
              <NewsPage />
            </Suspense>
          } />
          <Route path="whitepaper" element={
            <Suspense fallback={<Loading />}>
              <WhitepaperPage />
            </Suspense>
          } />
          <Route path="product-extractor" element={
            <Suspense fallback={<Loading />}>
              <ProductExtractorPage />
            </Suspense>
          } />
          <Route path="trending-video" element={
            <Suspense fallback={<Loading />}>
              <TrendingVideoPage />
            </Suspense>
          } />
          <Route path="trending-product" element={
            <Suspense fallback={<Loading />}>
              <TrendingProductPage />
            </Suspense>
          } />
          <Route path="hot-search" element={
            <Suspense fallback={<Loading />}>
              <HotSearchPage />
            </Suspense>
          } />
        </Route>
      </Routes>
    </Router>
  );
}
