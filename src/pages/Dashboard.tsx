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
      {/* Row 1: Welcome + Calendar + Weather — 移动端单列，桌面端三列 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <WelcomeCard />
        <CalendarWidget />
        <WeatherWidget />
      </div>

      {/* Row 2: Quick Actions */}
      <div className="mb-5">
        <QuickActions />
      </div>

      {/* Row 3-7: 今日任务、最新动态、行业日报、爆款视频、爆款产品 — 自适应高度 */}
      <div className="flex flex-col gap-4">
        <TodayTasks />
        <RecentActivity />
        <IndustryReport />
        <TrendingVideoSummary />
        <TrendingProductSummary />
      </div>
    </div>
  );
}
