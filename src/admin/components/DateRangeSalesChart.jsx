import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getDateRangeSales } from "../../shared/services/transaksiService.js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const getDefaultDates = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 2);

  const format = (date) => date.toISOString().split("T")[0];

  return {
    startDate: format(firstDay),
    endDate: format(today),
  };
};

export default function DateRangeSalesChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const defaults = getDefaultDates();
    setStartDate(defaults.startDate);
    setEndDate(defaults.endDate);
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) return;
    fetchChartData();
  }, [startDate, endDate]);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const res = await getDateRangeSales(startDate, endDate);
      const mapped = res.data.data.map((d) => ({
        day: new Date(d.date_iso + "T00:00:00").toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
        }),
        total: d.total_harian,
      }));
      setData(mapped);
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "Gagal memuat data grafik", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">
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

      {loading && (
        <div className="p-4 text-center text-gray-600">Memuat grafik...</div>
      )}

      {!loading && (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis tickFormatter={(v) => v.toLocaleString("id-ID")} />
              <Tooltip
                formatter={(value) =>
                  `Rp${Number(value).toLocaleString("id-ID")}`
                }
                labelFormatter={(l) => `Tanggal: ${l}`}
              />
              <Line type="monotone" dataKey="total" dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}