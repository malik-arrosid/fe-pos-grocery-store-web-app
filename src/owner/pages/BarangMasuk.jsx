import { useEffect, useState } from "react";
import { useUIStore } from "../../stores/useUIStore.js";
import { useBarangMasukStore } from "../../stores/useBarangMasukStore.js";
import { useBarangMasuk } from "../../shared/hooks/useBarangMasuk.js";
import { formatToRupiah } from "../../shared/utils/numberFormat.js";
import { formatQty } from "../../shared/utils/qtyFormat.js";

export default function BarangMasuk() {
  const { setActiveTab } = useUIStore();
  const { barangMasuk, setBarangMasuk } = useBarangMasukStore();
  const [page, setPage] = useState(1);
  const { fetchBarangMasuk, loading, meta } = useBarangMasuk({
    setBarangMasuk,
    mode: "owner",
  });

  useEffect(() => {
    setActiveTab("Riwayat Barang Masuk");
  }, []);

  useEffect(() => {
    fetchBarangMasuk({ page, limit: 10 });
  }, [page]);

  return (
    <div className="flex-1 p-3 sm:p-6 bg-gray-50 min-h-screen">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Riwayat Barang Masuk
        </h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-lg text-gray-600">Memuat data...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-violet-800 text-white">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left font-bold">No</th>
                  <th className="px-4 sm:px-6 py-3 text-left font-bold">
                    Nama Barang
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left font-bold">
                    Jumlah Masuk
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left font-bold">
                    Harga Beli
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left font-bold">
                    Total Harga
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left font-bold">
                    Tanggal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {barangMasuk.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 sm:px-6 py-4 text-center text-gray-500"
                    >
                      Tidak ada data barang masuk
                    </td>
                  </tr>
                ) : (
                  barangMasuk.map((item, index) => (
                    <tr key={item.id_barang_masuk} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-700">
                        {(page - 1) * 10 + index + 1}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-900 font-semibold">
                        {item.nama_barang}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-700">
                        {formatQty(item.qty_dasar, item.satuan_dasar)}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-700">
                        {formatToRupiah(parseFloat(item.harga_beli_per_sd))}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-700">
                        {formatToRupiah(parseFloat(item.harga_beli_total))}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-700">
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer hover:bg-gray-100 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="px-3 py-1">
              Page {meta.page || 1} / {meta.total_page || 1}
            </span>
            <button
              disabled={page >= (meta.total_page || 1)}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer hover:bg-gray-100 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}