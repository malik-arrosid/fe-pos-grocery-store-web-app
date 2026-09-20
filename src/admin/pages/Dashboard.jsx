import Header from "../components/Header.jsx";
import DashboardCards from "../components/DashboardCards.jsx";
import DateRangeSalesChart from "../components/DateRangeSalesChart.jsx";

export default function Dashboard() {
  return (
    <div className="flex-1">
      <Header />
      <DashboardCards />
      <div className="px-6 pb-10">
        <DateRangeSalesChart />
      </div>
    </div>
  );
}