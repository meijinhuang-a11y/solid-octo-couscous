import WelcomeCard from '@/components/dashboard/WelcomeCard';
import CalendarWidget from '@/components/dashboard/CalendarWidget';
import WeatherWidget from '@/components/dashboard/WeatherWidget';
import QuickActions from '@/components/dashboard/QuickActions';
import TodayTasks from '@/components/dashboard/TodayTasks';
import RecentActivity from '@/components/dashboard/RecentActivity';
import IndustryReport from '@/components/dashboard/IndustryReport';
import TrendingVideoSummary from '@/components/dashboard/TrendingVideoSummary';
import TrendingProductSummary from '@/components/dashboard/TrendingProductSummary';

export default function Dashboard() {
  return (
    <div className="p-4 sm:p-6">
      {/* Row 1: Welcome + Calendar + Weather */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <WelcomeCard />
        <CalendarWidget />
        <WeatherWidget />
      </div>

      {/* Row 2: Quick Actions */}
      <div className="mb-4">
        <QuickActions />
      </div>

      {/* Row 3: 今日任务 + 最新动态 — 等高，固定高度，内部滚动 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 flex flex-col" style={{ height: '320px' }}>
          <TodayTasks />
        </div>
        <div className="flex flex-col" style={{ height: '320px' }}>
          <RecentActivity />
        </div>
      </div>

      {/* Row 4: 行业日报 + 爆款视频 + 爆款产品 — 三列等高，固定高度，内部滚动 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="flex flex-col" style={{ height: '360px' }}>
          <IndustryReport />
        </div>
        <div className="flex flex-col" style={{ height: '360px' }}>
          <TrendingVideoSummary />
        </div>
        <div className="flex flex-col" style={{ height: '360px' }}>
          <TrendingProductSummary />
        </div>
      </div>
    </div>
  );
}
