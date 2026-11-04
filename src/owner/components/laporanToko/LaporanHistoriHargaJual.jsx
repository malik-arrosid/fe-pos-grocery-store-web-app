import { useEffect, useState, useMemo } from "react";
import { useBarangSalesByPrice } from "../../../shared/hooks/useBarangSalesByPrice.js";
import { formatToRupiah } from "../../../shared/utils/numberFormat.js";
import { formatQty } from "../../../shared/utils/qtyFormat.js";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";

const formatDateInput = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export default function LaporanHistoriHargaJual() {
  const { data, meta, loading, error, fetchData } = useBarangSalesByPrice();

  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const [startDate, setStartDate] = useState(formatDateInput(firstDay));
  const [endDate, setEndDate] = useState(formatDateInput(today));
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  useEffect(() => {
    if (!startDate || !endDate) return;
    fetchData({ page, limit: LIMIT, startDate, endDate });
  }, [page, startDate, endDate, fetchData]);

  // Group by barang untuk tampilan yang lebih rapi
  const grouped = useMemo(() => {
    const map = new Map();
    for (const row of data) {
      if (!map.has(row.id_barang)) {
        map.set(row.id_barang, {
          id_barang: row.id_barang,
          nama_barang: row.nama_barang,
          satuan_dasar: row.satuan_dasar,
          prices: [],
        });
      }
      map.get(row.id_barang).prices.push(row);
    }
    return Array.from(map.values());
  }, [data]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (meta.total_page || 1)) setPage(newPage);
  };

  const handleDateChange = (which, value) => {
    if (which === "start") {
      setStartDate(value);
      setPage(1);
    } else {
      setEndDate(value);
      setPage(1);
    }
  };

  const getPageNumbers = () => {
    const total = meta.total_page || 1;
    const current = page;
    const pages = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push("...");
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push("...");
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push("...");
      pages.push(total);
    }
    return pages;
  };

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp className="text-violet-700" size={28} />
          Histori Penjualan per Harga Jual
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Rekapitulasi perubahan jumlah terjual atas harga jual barang yang diubah
        </p>
      </div>

      {/* Filter Tanggal */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex flex-col flex-1">
            <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Dari Tanggal
            </label>
            <input
              type="date"
              value={startDate}
              max={endDate}
              onChange={(e) => handleDateChange("start", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Sampai Tanggal
            </label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => handleDateChange("end", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-lg text-gray-600">Memuat data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error!</strong> {error}
        </div>
      ) : grouped.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Tidak ada data penjualan pada rentang tanggal ini.
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {grouped.map((group) => {
              const totalQty = group.prices.reduce(
                (s, p) => s + p.total_quantity,
                0,
              );
              const totalSubtotal = group.prices.reduce(
                (s, p) => s + p.total_subtotal,
                0,
              );

              return (
                <div
                  key={group.id_barang}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  <div className="bg-violet-800 text-white px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-base sm:text-lg">
                        {group.nama_barang}
                      </h3>
                      <p className="text-xs sm:text-sm text-violet-200">
                        Satuan dasar: {group.satuan_dasar || "-"}
                      </p>
                    </div>
                    <div className="text-sm sm:text-right">
                      <p>
                        Total Terjual:{" "}
                        <strong>
                          {formatQty(totalQty, group.satuan_dasar)}
                        </strong>
                      </p>
                      <p>
                        Total: <strong>{formatToRupiah(totalSubtotal)}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-violet-100 text-violet-900">
                        <tr>
                          <th className="px-4 py-2 text-left">
                            Harga Jual / Satuan
                          </th>
                          <th className="px-4 py-2 text-right">
                            Jumlah Terjual
                          </th>
                          <th className="px-4 py-2 text-right">
                            Jumlah Transaksi
                          </th>
                          <th className="px-4 py-2 text-right">
                            Total Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.prices.map((p, idx) => (
                          <tr
                            key={`${p.harga_jual_per_sd}-${idx}`}
                            className={
                              idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td className="px-4 py-2 font-medium text-gray-800">
                              {formatToRupiah(p.harga_jual_per_sd)}
                            </td>
                            <td className="px-4 py-2 text-right text-gray-700">
                              {formatQty(p.total_quantity, group.satuan_dasar)}
                            </td>
                            <td className="px-4 py-2 text-right text-gray-700">
                              {p.total_transaksi}
                            </td>
                            <td className="px-4 py-2 text-right font-semibold text-violet-700">
                              {formatToRupiah(p.total_subtotal)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {(meta.total_page || 0) > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <div className="text-sm text-gray-500">
                Menampilkan {data.length > 0 ? (page - 1) * LIMIT + 1 : 0} -{" "}
                {Math.min(page * LIMIT, meta.total_data)} dari {meta.total_data}{" "}
                data
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>
                {getPageNumbers().map((pageNum, index) =>
                  pageNum === "..." ? (
                    <span key={`e-${index}`} className="px-2 text-gray-500">
                      ...
                    </span>
                  ) : (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded border ${
                        page === pageNum
                          ? "bg-violet-700 text-white border-violet-700"
                          : "hover:bg-gray-100"
                      } cursor-pointer`}
                    >
                      {pageNum}
                    </button>
                  ),
                )}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= (meta.total_page || 1)}
                  className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}