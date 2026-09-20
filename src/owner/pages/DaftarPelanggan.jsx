import { useEffect, useState } from "react";
import { useUIStore } from "../../stores/useUIStore.js";
import { usePelangganStore } from "../../stores/usePelangganStore.js";
import { usePelanggan } from "../../shared/hooks/usePelanggan.js";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DaftarPelanggan() {
  const { setActiveTab } = useUIStore();
  const { pelanggan, setPelanggan } = usePelangganStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const { fetchPelanggan, loading, meta } = usePelanggan({
    setPelanggan,
    mode: "owner",
  });

  useEffect(() => {
    setActiveTab("Daftar Pelanggan");
    fetchPelanggan(currentPage, limit);
  }, [currentPage]);

  return (
    <div className="flex-1 p-3 sm:p-6 bg-gray-50 min-h-screen">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Daftar Pelanggan Member
        </h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-lg text-gray-600">Memuat data...</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-violet-800 text-white">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left font-bold">No</th>
                <th className="px-4 sm:px-6 py-3 text-left font-bold">Nama</th>
                <th className="px-4 sm:px-6 py-3 text-left font-bold">
                  No. HP
                </th>
                <th className="px-4 sm:px-6 py-3 text-left font-bold">
                  Total Pembelian
                </th>
                <th className="px-4 sm:px-6 py-3 text-left font-bold">
                  Frekuensi
                </th>
                <th className="px-4 sm:px-6 py-3 text-left font-bold">Poin</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pelanggan.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 sm:px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada data pelanggan
                  </td>
                </tr>
              ) : (
                pelanggan.map((p, i) => (
                  <tr key={p.id_pelanggan} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-700">
                      {i + 1}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-900 font-semibold">
                      {p.nama_pelanggan}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-700">
                      {p.no_hp || "-"}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-700">
                      Rp{p.total_pembelian.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-700">
                      {p.frekuensi_transaksi}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-700">
                      {p.poin_loyalitas}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {meta.total_page > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <div className="text-sm text-gray-500">
            Menampilkan {(currentPage - 1) * limit + 1} -{" "}
            {Math.min(currentPage * limit, meta.total_data)} dari{" "}
            {meta.total_data} data
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="px-3 py-1 text-sm">
              Halaman {currentPage} dari {meta.total_page}
            </span>
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(meta.total_page, p + 1))
              }
              disabled={currentPage >= meta.total_page}
              className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}