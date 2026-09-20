import { useEffect, useState } from "react";
import { useBarangMasukStore } from "../../../stores/useBarangMasukStore.js";
import { useBarangMasuk } from "../../../shared/hooks/useBarangMasuk.js";
import { formatQty } from "../../../shared/utils/qtyFormat.js";

export default function HistoriBarangMasuk() {
  const { barangMasuk, setBarangMasuk } = useBarangMasukStore();
  const [page, setPage] = useState(1);

  const { fetchBarangMasuk, meta, loading } = useBarangMasuk({
    setBarangMasuk,
    mode: "admin",
  });

  useEffect(() => {
    fetchBarangMasuk({ page, limit: 10 });
  }, [page]);

  if (loading) {
    return <p className="text-center py-6">Memuat riwayat...</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Riwayat Barang Masuk</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-blue-400">
            <tr>
              <th className="border px-3 py-2">No</th>
              <th className="border px-3 py-2">Nama Barang</th>
              <th className="border px-3 py-2">Qty</th>
              <th className="border px-3 py-2">HB per Satuan Dasar</th>
              <th className="border px-3 py-2">Total</th>
              <th className="border px-3 py-2">Tanggal Masuk</th>
            </tr>
          </thead>
          <tbody>
            {barangMasuk.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  Belum ada data barang masuk
                </td>
              </tr>
            ) : (
              barangMasuk.map((item, idx) => (
                <tr key={item.id_barang_masuk} className="text-center">
                  <td className="border px-3 py-2">
                    {(page - 1) * 10 + idx + 1}
                  </td>
                  <td className="border px-3 py-2">{item.nama_barang}</td>
                  <td className="border px-3 py-2">
                    {formatQty(item.qty_dasar, item.satuan_dasar)}
                  </td>
                  <td className="border px-3 py-2">
                    Rp {Number(item.harga_beli_per_sd).toLocaleString("id-ID")}
                  </td>
                  <td className="border px-3 py-2">
                    Rp {Number(item.harga_beli_total).toLocaleString("id-ID")}
                  </td>
                  <td className="border px-3 py-2">
                    {new Date(item.created_at).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination sederhana */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
        >
          Prev
        </button>
        <span className="px-3 py-1">
          Page {meta.page} / {meta.total_page}
        </span>
        <button
          disabled={page >= meta.total_page}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}