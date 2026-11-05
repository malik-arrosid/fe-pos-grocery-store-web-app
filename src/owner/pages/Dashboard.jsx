import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ShoppingCart,
  Wallet,
  PackagePlus,
  TrendingUp,
  Award,
  Coins,
  Repeat,
} from "lucide-react";
import { useUIStore } from "../../stores/useUIStore.js";
import { useDashboardStore } from "../../stores/useDashboardStore.js";
import { useDashboard } from "../../shared/hooks/useDashboard.js";
import { formatToRupiah } from "../../shared/utils/numberFormat.js";
import { formatQty } from "../../shared/utils/qtyFormat.js";

const getDefaultDates = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 2);

  const format = (date) => date.toISOString().split("T")[0];

  return {
    startDate: format(firstDay),
    endDate: format(today),
  };
};

function TopBarangTable({
  items,
  valueKey,
  valueLabel,
  middleKey,
  middleLabel,
  icon,
  emptyText,
  accentColor,
  colorClass = "text-violet-700",
}) {
  const Icon = icon;
  const rightHeaderLabel =
    valueLabel === "Top 5 Paling Sering Dibeli"
      ? "Total Belanja"
      : valueLabel.split(" ").slice(-2).join(" ");
  
  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={22} className={accentColor} />
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          {valueLabel}
        </h3>
      </div>
      {items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-gray-500 py-6">{emptyText}</p>
        </div>
      ) : (
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-600">
                <th className="text-left py-2 pr-2 w-8">#</th>
                <th className="text-left py-2 px-2">Nama Barang</th>
                <th className="text-right py-2 px-2 whitespace-nowrap">
                  {middleLabel}
                </th>
                <th className="text-right py-2 pl-2 whitespace-nowrap">
                  {rightHeaderLabel}
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const middleValue = item[middleKey];
                const isQtyField = middleKey === "total_quantity";
                const rightValue = Number(item[valueKey] || 0);
                return (
                  <tr
                    key={item.id_barang || idx}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-2 pr-2 text-gray-500 font-medium">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-2 text-gray-900 font-medium">
                      {item.nama_barang}
                    </td>
                    <td className="py-2 px-2 text-right text-gray-700 whitespace-nowrap">
                      {isQtyField
                        ? formatQty(middleValue, item.satuan_dasar)
                        : middleValue}
                    </td>
                    <td
                      className={`py-2 pl-2 text-right font-semibold whitespace-nowrap ${
                        valueKey === "total_laba"
                          ? rightValue >= 0
                            ? "text-emerald-700"
                            : "text-red-600"
                          : colorClass
                      }`}
                    >
                      {formatToRupiah(rightValue)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { setActiveTab } = useUIStore();
  const { dashboardStats, todayStats, dateRangeData, setDashboardStats, setDateRangeData, setTodayStats } =
    useDashboardStore();
  const { fetchAllDashboardData, loading } = useDashboard({
    mode: "owner",
    setDashboardStats,
    setDateRangeData,
    setTodayStats,
  });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    setActiveTab("Dashboard");
    const defaults = getDefaultDates();
    setStartDate(defaults.startDate);
    setEndDate(defaults.endDate);
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) return;
    fetchAllDashboardData(startDate, endDate);
  }, [startDate, endDate]);

  const cardData = [
    {
      title: "Jumlah Barang",
      value: dashboardStats.totalBarang,
      color: "bg-violet-700",
    },
    {
      title: "Jumlah Transaksi",
      value: dashboardStats.totalTransaksi,
      color: "bg-violet-700",
    },
    {
      title: "Jumlah Pelanggan",
      value: dashboardStats.totalPelanggan,
      color: "bg-violet-700",
    },
  ];

  const untungRugiOmset = Number(todayStats?.untung_rugi_omset || 0);
  const isRugi = untungRugiOmset < 0;
  const labelUntungRugi = isRugi ? "Rugi" : "Untung";
  
  const todayCards = [
    {
      title: "Transaksi Hari Ini",
      value: todayStats?.total_transaksi_hari_ini || 0,
      subtitle: "transaksi berhasil",
      icon: ShoppingCart,
      bg: "bg-violet-700",
    },
    {
      title: "Omset Hari Ini",
      value: formatToRupiah(todayStats?.omset_hari_ini || 0),
      subtitle: "total penjualan",
      icon: Wallet,
      bg: "bg-emerald-600",
    },
    {
      title: "Pembelian Barang Hari Ini",
      value: formatToRupiah(todayStats?.total_pembelian_barang_hari_ini || 0),
      subtitle: `${todayStats?.jumlah_barang_masuk_hari_ini || 0} barang masuk`,
      icon: PackagePlus,
      bg: "bg-amber-600",
    },
    {
      title: "Keuntungan Barang Hari Ini",
      value: formatToRupiah(todayStats?.keuntungan_bersih_hari_ini || 0),
      subtitle: `${todayStats?.jumlah_barang_terjual_hari_ini || 0} Barang Terjual`,
      icon: TrendingUp,
      bg:
        (todayStats?.keuntungan_bersih_hari_ini || 0) >= 0
          ? "bg-blue-700"
          : "bg-red-600",
    },
  ];
  
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  if (loading && !dateRangeData.length) {
    return (
      <div className="flex-1 p-3 sm:p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Memuat data...</p>
      </div>
    );
  }

  const topLaba = todayStats?.top_barang_laba || [];
  const topBelanja = todayStats?.top_barang_belanja || [];
  const topSering = todayStats?.top_barang_sering || [];
  
  return (
    <div className="flex-1 p-3 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Dashboard Owner
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          Ringkasan data toko kelontong Anda
        </p>
      </div>

      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">
          Ringkasan Hari Ini
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {/* ===== Card 1: Transaksi Hari Ini ===== */}
          <div className="bg-violet-700 text-white p-4 sm:p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm sm:text-base">
                Transaksi Hari Ini
              </h3>
              <ShoppingCart size={22} className="opacity-80" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold mt-2 sm:mt-3">
              {todayStats?.total_transaksi_hari_ini || 0}
            </p>
            <p className="text-xs sm:text-sm opacity-80 mt-1">
              transaksi berhasil
            </p>
          </div>

          {/* ===== Card 2: Omset Hari Ini (dengan Untung/Rugi) ===== */}
          <div
            className={`${
              isRugi ? "bg-red-600" : "bg-emerald-600"
            } text-white p-4 sm:p-6 rounded-lg shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm sm:text-base">
                Omset Hari Ini
              </h3>
              <Wallet size={22} className="opacity-80" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold mt-2 sm:mt-3 break-words">
              {formatToRupiah(todayStats?.omset_hari_ini || 0)}
            </p>
            {/* Baris Untung/Rugi di bawah nilai omset */}
            <div className="mt-2 pt-2 border-t border-white/30">
              <p className="text-xs sm:text-sm opacity-90">
                {labelUntungRugi}:{" "}
                <span className="font-semibold">
                  {isRugi ? "-" : ""}
                  {formatToRupiah(Math.abs(untungRugiOmset))}
                </span>
              </p>
              <p className="text-[10px] sm:text-xs opacity-75 mt-0.5">
                (omset - pembelian barang)
              </p>
            </div>
          </div>

          {/* ===== Card 3 & 4: Pembelian & Keuntungan Bersih ===== */}
          {todayCards
            .filter(
              (c) =>
                c.title !== "Transaksi Hari Ini" &&
                c.title !== "Omset Hari Ini",
            )
            .map(({ title, value, subtitle, icon: Icon, bg }) => (
              <div
                key={title}
                className={`${bg} text-white p-4 sm:p-6 rounded-lg shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm sm:text-base">
                    {title}
                  </h3>
                  <Icon size={22} className="opacity-80" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold mt-2 sm:mt-3 break-words">
                  {value}
                </p>
                {subtitle && (
                  <p className="text-xs sm:text-sm opacity-80 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            ))}
        </div>
      </div>

      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">
          Performa Barang Hari Ini
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <TopBarangTable
            items={topLaba}
            valueKey="total_laba"
            valueLabel="Top 5 Laba Tertinggi"
            middleKey="total_quantity"
            middleLabel="Terjual"
            icon={Award}
            accentColor="text-emerald-700"
            emptyText="Belum ada penjualan hari ini"
          />
          <TopBarangTable
            items={topBelanja}
            valueKey="total_subtotal"
            valueLabel="Top 5 Total Belanja Terbanyak"
            middleKey="total_quantity"
            middleLabel="Terjual"
            icon={Coins}
            accentColor="text-violet-700"
            emptyText="Belum ada penjualan hari ini"
            colorClass="text-violet-700"
          />
          <TopBarangTable
            items={topSering}
            valueKey="total_subtotal"
            valueLabel="Top 5 Paling Sering Dibeli"
            middleKey="total_transaksi"
            middleLabel="Frekuensi"
            icon={Repeat}
            accentColor="text-orange-600"
            emptyText="Belum ada penjualan hari ini"
            colorClass="text-blue-700"
          />
        </div>
      </div>

      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">
          Ringkasan Keseluruhan
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {cardData.map(({ title, value }) => (
            <div
              key={title}
              className="bg-violet-700 text-white p-4 sm:p-6 rounded-lg shadow-lg"
            >
              <h3 className="font-semibold text-sm sm:text-lg">{title}</h3>
              <p className="text-2xl sm:text-4xl font-bold mt-2 sm:mt-4">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
          Total Penjualan ({startDate.split("-").reverse().join("-")} s/d{" "}
          {endDate.split("-").reverse().join("-")})
        </h3>

        {/* Date Range Filter */}
        <div className="mb-4 flex flex-wrap gap-2 items-end">
          <div className="flex flex-col">
            <label
              htmlFor="startDate"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Dari Tanggal
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={handleDateChange}
              max={endDate}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="endDate"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Sampai Tanggal
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={endDate}
              onChange={handleDateChange}
              min={startDate}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>

        {/* Chart height responsif: 300px mobile, 400px tablet, 500px desktop */}
        <div className="h-72 sm:h-96 lg:h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dateRangeData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" style={{ fontSize: "12px" }} />
              <YAxis
                tickFormatter={(v) => v.toLocaleString("id-ID")}
                style={{ fontSize: "12px" }}
              />
              <Tooltip
                formatter={(value) =>
                  `Rp${Number(value).toLocaleString("id-ID")}`
                }
                labelFormatter={(l) => `Tanggal: ${l}`}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#7c3aed"
                strokeWidth={2}
                dot
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}