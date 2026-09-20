import { useEffect, useState } from "react";
import { useUIStore } from "../../stores/useUIStore.js";
import Header from "../components/Header.jsx";
import { useTransaksi } from "../../shared/hooks/useTransaksi.js";
import { formatToRupiah } from "../../shared/utils/numberFormat.js";
import { useNavigate } from "react-router-dom";
import { FileText, Printer, Eye, ChevronLeft, ChevronRight } from "lucide-react";

export default function HistoriTransaksi() {
  const { setActiveTab } = useUIStore();
  const { historiTransaksi, fetchHistoriTransaksi, loading, meta, downloadInvoice } =
    useTransaksi({ mode: "admin" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    setActiveTab("Histori Transaksi");
    fetchHistoriTransaksi(currentPage, limit);
  }, [currentPage]);

  const filteredTransactions = historiTransaksi.filter((transaction) =>
    transaction.kode_transaksi
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= meta.total_page) {
      setCurrentPage(newPage);
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  
  return (
    <div className="flex-1">
      <Header />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Daftar Histori Transaksi</h1>
          <div className="text-sm text-gray-500">
            Total: {meta.total_data || 0} transaksi
          </div>
        </div>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Cari berdasarkan ID Transaksi..."
            className="w-full sm:w-1/2 px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <table className="min-w-full bg-white">
              <thead className="bg-blue-400">
                <tr>
                  <th className="border py-3 px-4">ID Transaksi</th>
                  <th className="border py-3 px-4">Tanggal</th>
                  <th className="border py-3 px-4">Jumlah Item</th>
                  <th className="border py-3 px-4">Total</th>
                  <th className="border py-3 px-4">Status Pelanggan</th>
                  <th className="border py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-4 px-4 text-center text-gray-500"
                    >
                      {searchTerm
                        ? "Tidak ada transaksi ditemukan."
                        : "Belum ada transaksi."}
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id_transaksi}
                      className="border text-center hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-medium">
                        {transaction.kode_transaksi}
                      </td>
                      <td className="border py-3 px-4">
                        {formatDate(transaction.created_at)}
                      </td>
                      <td className="border py-3 px-4">
                        {transaction.jumlah_item || "0"}
                      </td>
                      <td className="border py-3 px-4">
                        {formatToRupiah(parseFloat(transaction.total_harga))}
                      </td>
                      <td className="border py-3 px-4">
                        {transaction.tipe_pelanggan === "member" ? (
                          <span className="bg-green-200 text-green-800 py-1 px-2 rounded-full text-xs">
                            Member
                          </span>
                        ) : (
                          <span className="bg-gray-200 text-black py-1 px-2 rounded-full text-xs">
                            Guest
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/detail-transaksi/${transaction.id_transaksi}`,
                              )
                            }
                            title="Detail Transaksi"
                            className="p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && meta.total_page > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Menampilkan{" "}
              {filteredTransactions.length > 0
                ? (currentPage - 1) * limit + 1
                : 0}{" "}
              - {Math.min(currentPage * limit, meta.total_data)} dari{" "}
              {meta.total_data} data
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-1">
                {Array.from(
                  { length: Math.min(5, meta.total_page) },
                  (_, i) => {
                    let pageNum;
                    if (meta.total_page <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= meta.total_page - 2) {
                      pageNum = meta.total_page - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
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
                    );
                  },
                )}
              </div>
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
      </div>
    </div>
  );
}