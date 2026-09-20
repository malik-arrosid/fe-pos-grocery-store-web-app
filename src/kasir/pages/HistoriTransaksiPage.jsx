import { useState, useEffect } from "react";
import { useTransaksi } from "../../shared/hooks/useTransaksi.js";
import { formatToRupiah } from "../../shared/utils/numberFormat.js";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Printer,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useUIStore } from "../../stores/useUIStore.js";

export const HistoriTransaksiPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    historiTransaksi,
    fetchHistoriTransaksi,
    loading,
    meta,
    downloadInvoice,
  } = useTransaksi({ mode: "kasir" });
  // const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const navigate = useNavigate();
  const { setActiveTab } = useUIStore();

  useEffect(() => {
    setActiveTab("Histori Transaksi");
    fetchHistoriTransaksi(currentPage, limit);
  }, [currentPage]);

  const filteredTransactions = historiTransaksi.filter((transaction) =>
    transaction.kode_transaksi.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // const handlePageChange = (newPage) => {
  //   if (newPage >= 1 && newPage <= meta.total_page) {
  //     setCurrentPage(newPage);
  //   }
  // };
  
  // Komponen badge status — dipakai di card & tabel
  const StatusBadge = ({ tipe }) =>
    tipe === "member" ? (
      <span className="bg-green-800 text-white py-1 px-2 rounded-full text-xs">
        Member
      </span>
    ) : (
      <span className="bg-gray-200 text-black py-1 px-2 rounded-full text-xs">
        Guest
      </span>
    );

  // Komponen tombol aksi — dipakai di card & tabel
  const ActionButtons = ({ transaction }) => (
    <div className="flex gap-1 sm:gap-2 justify-center">
      <button
        onClick={() => downloadInvoice(transaction.id_transaksi)}
        title="Lihat Invoice"
        className="cursor-pointer p-1.5 sm:p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        <FileText size={15} />
      </button>
      {/* <button
        onClick={() => downloadInvoice(transaction.id_transaksi)}
        title="Cetak"
        className="cursor-pointer p-1.5 sm:p-2 bg-green-700 text-white rounded hover:bg-green-800"
      >
        <Printer size={15} />
      </button> */}
      <button
        onClick={() =>
          navigate(`/kasir/detail-transaksi/${transaction.id_transaksi}`)
        }
        title="Detail Transaksi"
        className="cursor-pointer p-1.5 sm:p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        <Eye size={15} />
      </button>
    </div>
  );

  return (
    <div className="container mx-auto p-3 sm:p-4">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">
          Histori Transaksi
        </h1>
        <div className="text-sm text-gray-500">
          Total Data: {meta.total_data || 0} transaksi
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari berdasarkan ID Transaksi..."
          className="w-full sm:w-1/2 px-3 sm:px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
        </div>
      ) : filteredTransactions.length === 0 ? (
        <p className="text-center text-gray-500 py-10 text-sm">
          Tidak ada transaksi ditemukan.
        </p>
      ) : (
        <>
          {/* ── Mobile: card list (< 768px) ─────────────────────────────── */}
          <div className="flex flex-col gap-3 md:hidden">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id_transaksi}
                className="bg-white rounded-xl border shadow-sm p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      {transaction.kode_transaksi}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(transaction.created_at).toLocaleDateString(
                        "id-ID",
                        { day: "2-digit", month: "short", year: "numeric" },
                      )}
                    </p>
                  </div>
                  <StatusBadge tipe={transaction.tipe_pelanggan} />
                </div>
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="text-gray-500">
                    {transaction.jumlah_item || 0} item
                  </span>
                  <span className="font-bold text-green-700">
                    {formatToRupiah(parseFloat(transaction.total_harga))}
                  </span>
                </div>
                <div className="flex justify-end">
                  <ActionButtons transaction={transaction} />
                </div>
              </div>
            ))}
          </div>

          {/* ── Tablet + Desktop: tabel (≥ 768px) ──────────────────────── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-green-700 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">ID Transaksi</th>
                  <th className="py-3 px-4 text-left">Tanggal</th>
                  <th className="py-3 px-4 text-left">Qty Barang</th>
                  <th className="py-3 px-4 text-left">Total Harga</th>
                  <th className="py-3 px-4 text-left">Tipe Pelanggan</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id_transaksi}
                    className="hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm">
                      {transaction.kode_transaksi}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(transaction.created_at).toLocaleDateString(
                        "id-ID",
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {transaction.jumlah_item || "0"}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {formatToRupiah(parseFloat(transaction.total_harga))}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge tipe={transaction.tipe_pelanggan} />
                    </td>
                    <td className="py-3 px-4 flex justify-around">
                      <ActionButtons transaction={transaction} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && meta.total_page > 0 && (
              <div className="flex justify-between items-center mt-4">
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
        </>
      )}
    </div>
  );
};