import { useEffect, useState } from "react";
import { useUIStore } from "../../stores/useUIStore.js";
import { useBarangStore } from "../../stores/useBarangStore.js";
import { useBarang } from "../../shared/hooks/useBarang.js";
import { formatToRupiah } from "../../shared/utils/numberFormat.js";
import { formatQty } from "../../shared/utils/qtyFormat.js";

const LIMIT = 10;

export default function DaftarBarang() {
  const { setActiveTab } = useUIStore();
  const { barang, setBarang } = useBarangStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { fetchBarang, search, loading, meta } = useBarang({
    searchQuery,
    setBarang,
    mode: "owner",
  });

  useEffect(() => {
    setActiveTab("Daftar Barang");
    fetchBarang({ page: 1, limit: LIMIT });
  }, []);

  // Saat page berubah (tanpa pencarian aktif), fetch ulang
  useEffect(() => {
    if (!searchQuery.trim()) {
      fetchBarang({ page, limit: LIMIT });
    }
  }, [page]);

  // Saat searchQuery berubah: jika kosong, reset ke halaman 1 dan fetch semua
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setPage(1);
      fetchBarang({ page: 1, limit: LIMIT });
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    if (searchQuery.trim()) {
      search();
    } else {
      fetchBarang({ page: 1, limit: LIMIT });
    }
  };

  const totalPage = meta?.total_page || 1;
  const currentPage = meta?.page || page;

  return (
    <div className="flex-1 p-3 sm:p-6 bg-gray-50 min-h-screen">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Daftar Barang
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          Lihat daftar semua barang (Mode Tampilan)
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-4 sm:mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Cari barang..."
          className="w-full sm:w-1/2 px-3 sm:px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-violet-700 text-white rounded hover:bg-violet-800 text-sm cursor-pointer"
        >
          Cari
        </button>
      </form>

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
                    Kategori
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left font-bold">
                    Stok
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left font-bold">
                    Harga Beli
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left font-bold">
                    Harga Jual
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {barang.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 sm:px-6 py-4 text-center text-gray-500"
                    >
                      Tidak ada data barang
                    </td>
                  </tr>
                ) : (
                  barang.map((item, index) => (
                    <tr key={item.id_barang} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-700">
                        {(currentPage - 1) * LIMIT + index + 1}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-900 font-semibold">
                        {item.nama_barang}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-700">
                        {item.kategori_barang}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-700">
                        {formatQty(item.stok_dasar, item.satuan_dasar)}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-700">
                        {formatToRupiah(parseFloat(item.harga_modal_per_sd))}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-700">
                        {formatToRupiah(parseFloat(item.harga_jual_per_sd))}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination — hanya tampil jika tidak dalam mode search atau ada meta */}
          {!searchQuery.trim() && (
            <div className="flex justify-end gap-2 mt-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer hover:bg-gray-100 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <span className="px-3 py-1">
                Page {currentPage} / {totalPage}
              </span>
              <button
                disabled={page >= totalPage}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer hover:bg-gray-100 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}