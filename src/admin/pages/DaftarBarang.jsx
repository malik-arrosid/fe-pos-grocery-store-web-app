import Header from "../components/Header.jsx";
import { useUIStore } from "../../stores/useUIStore.js";
import { useBarangStore } from "../../stores/useBarangStore.js";
import { useState, useEffect } from "react";
import { useBarang } from "../../shared/hooks/useBarang.js";
import SearchBar from "../components/barang/SearchBar.jsx";
import BarangTable from "../components/barang/BarangTable.jsx";
import BarangModal from "../components/barang/BarangModal.jsx";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function DaftarBarang() {
  const navigate = useNavigate();
  const { activeTab, setActiveTab } = useUIStore();
  const { barang, setBarang, searchQuery, setSearchQuery } = useBarangStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBarang, setCurrentBarang] = useState(null);
  const LIMIT = 10;
  const [page, setPage] = useState(1);

  const { fetchBarang, search, remove, loading, error, meta } = useBarang({
    searchQuery,
    setBarang,
    mode: "admin",
  });

  useEffect(() => {
    setActiveTab("Daftar Barang");
    fetchBarang({ page: 1, limit: LIMIT });
  }, []);

  useEffect(() => {
    if (!(searchQuery ?? "").trim()) {
      setPage(1);
      fetchBarang({ page: 1, limit: LIMIT });
    }
  }, [searchQuery]);

  useEffect(() => {
    if (!(searchQuery ?? "").trim()) {
      fetchBarang({ page, limit: LIMIT });
    }
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    if (!searchQuery.trim()) {
      fetchBarang({ page: 1, limit: LIMIT });
    } else {
      search();
    }
  };

  return (
    <div className="flex-1">
      <Header />
      <div className="p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Daftar Barang</h1>
          {/* <button
            onClick={() => {
              setCurrentBarang(null);
              setIsModalOpen(true);
            }}
            className="bg-400 text-900 px-4 py-2 rounded-lg font-semibold hover:bg-500"
          >
            Tambah Barang
          </button> */}

          <div className="text-sm">
            Untuk menambah barang baru atau menambah stok, gunakan menu{" "}
            <button
              onClick={() => navigate("/admin/barang-masuk")}
              className="bg-blue-500 font-semibold px-4 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-blue-600 active:bg-blue-700 cursor-pointer"
            >
              Barang Masuk
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSubmit={handleSearch}
        />

        <BarangTable
          barang={barang}
          pageOffset={(meta?.page ? meta.page - 1 : 0) * LIMIT}
          isLoading={loading}
          error={error}
          onEdit={setCurrentBarang}
          onDelete={remove}
          openModal={() => setIsModalOpen(true)}
        />

        {!(searchQuery ?? "").trim() && (
          <div className="flex justify-end gap-2 mt-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer hover:bg-gray-100 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="px-3 py-1">
              Page {meta?.page || page} / {meta?.total_page || 1}
            </span>
            <button
              disabled={page >= (meta?.total_page || 1)}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer hover:bg-gray-100 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {isModalOpen && (
          <BarangModal
            currentBarang={currentBarang}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              fetchBarang({ page, limit: LIMIT });
              setIsModalOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
}