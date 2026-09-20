import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import { useUIStore } from "../../stores/useUIStore.js";
import { usePelangganStore } from "../../stores/usePelangganStore.js";
import { usePelanggan } from "../../shared/hooks/usePelanggan.js";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function DaftarPelanggan() {
  const { setActiveTab } = useUIStore();
  const { pelanggan, setPelanggan, searchQuery, setSearchQuery } =
    usePelangganStore();
  const { fetchPelanggan, search, loading, error, meta } = usePelanggan({
    searchQuery,
    setPelanggan,
    mode: "admin"
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [isSearching, setIsSearching] = useState(false);
  
  useEffect(() => {
    setActiveTab("Daftar Pelanggan");
    if (!isSearching) {
      fetchPelanggan(currentPage, limit);
    }
  }, [currentPage]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setCurrentPage(1);

    if (searchQuery && searchQuery.trim()) {
      await search(1, limit);
    } else {
      setIsSearching(false);
      await fetchPelanggan(1, limit);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setCurrentPage(1);
    fetchPelanggan(1, limit);
  };
  
  // useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     if (searchQuery.trim()) {
  //       setIsSearching(true);
  //       setCurrentPage(1);
  //       search(1, limit);
  //     } else if (isSearching) {
  //       setIsSearching(false);
  //       setCurrentPage(1);
  //       fetchPelanggan(1, limit);
  //     }
  //   }, 500);

  //   return () => clearTimeout(delayDebounceFn);
  // }, [searchQuery]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= meta.total_page) {
      setCurrentPage(newPage);  
      if (isSearching && searchQuery.trim()) {
        search(newPage, limit);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  
  const getPageNumbers = () => {
    const total = meta.total_page || 1;
    const current = currentPage;
    const pages = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
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
    }
    return pages;
  };
  
  return (
    <div className="flex-1">
      <Header />
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Daftar Pelanggan</h1>
            <div className="text-sm text-gray-500">
              {isSearching
                ? `Hasil pencarian: ${meta.total_data || 0}`
                : `Total: ${meta.total_data || 0} pelanggan`}
            </div>
          </div>

          {/* Search Form - MANUAL search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Cari pelanggan (nama atau no HP)..."
                className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-800 cursor-pointer"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
            >
              Cari
            </button>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Memuat data pelanggan...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong>Error!</strong> {error}
          </div>
        ) : (
          <>
            {/* Table - Desktop */}
            <div className="hidden md:block overflow-x-auto shadow rounded-lg">
              <table className="min-w-full bg-white">
                <thead className="bg-blue-400">
                  <tr className="border">
                    <th className="px-6 py-3 text-sm font-bold">No</th>
                    <th className="border px-6 py-3 text-sm font-bold">Nama</th>
                    <th className="border px-6 py-3 text-sm font-bold">
                      No. HP
                    </th>
                    <th className="border px-6 py-3 text-sm font-bold">
                      Total Pembelian
                    </th>
                    <th className="border px-6 py-3 text-sm font-bold">
                      Frekuensi
                    </th>
                    <th className="px-6 py-3 text-sm font-bold">Poin</th>
                    <th className="border px-6 py-3 text-sm font-bold">
                      Terdaftar
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pelanggan.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        {searchQuery
                          ? "Pelanggan tidak ditemukan"
                          : "Tidak ada data pelanggan"}
                      </td>
                    </tr>
                  ) : (
                    pelanggan.map((p, i) => (
                      <tr
                        key={p.id_pelanggan}
                        className="border text-center hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 text-sm">
                          {(currentPage - 1) * limit + i + 1}
                        </td>
                        <td className="border px-6 py-4 text-sm font-semibold">
                          {p.nama_pelanggan}
                        </td>
                        <td className="border px-6 py-4 text-sm">
                          {p.no_hp || "-"}
                        </td>
                        <td className="border px-6 py-4 text-sm">
                          Rp{p.total_pembelian.toLocaleString("id-ID")}
                        </td>
                        <td className="border px-6 py-4 text-sm">
                          {p.frekuensi_transaksi}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {p.poin_loyalitas}
                        </td>
                        <td className="border px-6 py-4 text-sm">
                          {formatDate(p.created_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Card View - Mobile */}
            <div className="md:hidden space-y-4">
              {pelanggan.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                  {searchQuery
                    ? "Pelanggan tidak ditemukan"
                    : "Tidak ada data pelanggan"}
                </div>
              ) : (
                pelanggan.map((p, i) => (
                  <div
                    key={p.id_pelanggan}
                    className="bg-white rounded-lg shadow p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-sm">
                          {p.nama_pelanggan}
                        </p>
                        <p className="text-xs text-gray-500">
                          {p.no_hp || "-"}
                        </p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        #{i + 1}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Total Belanja</p>
                        <p className="font-semibold">
                          Rp{p.total_pembelian.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Frekuensi</p>
                        <p className="font-semibold">{p.frekuensi_transaksi}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Poin</p>
                        <p className="font-semibold">{p.poin_loyalitas}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {meta.total_page > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                <div className="text-sm text-gray-500">
                  Menampilkan{" "}
                  {pelanggan.length > 0 ? (currentPage - 1) * limit + 1 : 0} -{" "}
                  {Math.min(currentPage * limit, meta.total_data)} dari{" "}
                  {meta.total_data} data
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {getPageNumbers().map((pageNum, index) =>
                    pageNum === "..." ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-2 text-gray-500"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded border ${
                          currentPage === pageNum
                            ? "bg-blue-500 text-white border-blue-500"
                            : "hover:bg-gray-100"
                        } cursor-pointer`}
                      >
                        {pageNum}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= meta.total_page}
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
    </div>
  );
}