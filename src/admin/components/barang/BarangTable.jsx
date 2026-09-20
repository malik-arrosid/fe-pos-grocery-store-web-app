import { formatToRupiah } from "../../../shared/utils/numberFormat";
import { formatQty } from "../../../shared/utils/qtyFormat";

export default function BarangTable({
  barang,
  isLoading,
  error,
  onEdit,
  onDelete,
  openModal,
  pageOffset = 0,
}) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
        <p className="mt-2">Memuat data barang ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <strong>Error!</strong> {error}
      </div>
    );
  }

  // const parseGramInteger = (v) => {
  //   if (v === null || v === undefined) return 0;
  //   if (typeof v === "number" && Number.isFinite(v)) return Math.trunc(v);

  //   const s = String(v).trim();
  //   if (s === "") return 0;

  //   const cleaned = s.replace(/[^\d-]/g, "");
  //   if (cleaned === "" || cleaned === "-") return 0;

  //   const n = parseInt(cleaned, 10);
  //   return Number.isFinite(n) ? n : 0;
  // };

  // const formatKg = (kg) => {
  //   const num = Number(kg);
  //   if (!isFinite(num)) return "-";
  //   const rounded = Math.round((num + Number.EPSILON) * 10000) / 10000; // 4 decimal precision
  //   return String(rounded).replace(/\.?0+$/, "");
  // };

  // const formatStok = (stokRaw, satuanRaw) => {
  //   const stok = parseGramInteger(stokRaw);
  //   const satuan = String(satuanRaw ?? "")
  //     .trim()
  //     .toUpperCase();

  //   if (!Number.isFinite(stok)) return "-";

  //   if (satuan === "GRAM" || satuan === "G") {
  //     if (stok >= 1000) {
  //       // KONVERSI TEPAT: hanya sekali /1000
  //       return `${formatKg(stok / 1000)} kg`;
  //     }
  //     return `${stok} gr`;
  //   }

  //   const displaySatuan = satuan ? satuan.toLowerCase() : "pcs";
  //   return `${stok} ${displaySatuan}`;
  // };

  return (
    <div className="rounded-lg shadow">
      <table className="min-w-full">
        <thead className="bg-blue-400">
          <tr>
            {[
              "No",
              "Nama Barang",
              "Stok",
              "Kategori",
              "Harga Jual",
              "Harga Beli",
              "Tindakan",
            ].map((head) => (
              <th
                key={head}
                className="border px-6 py-3 text-xs font-medium uppercase tracking-wider"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {barang.length === 0 ? (
            <tr>
              <td colSpan="8" className="px-6 py-4 text-center">
                <div className="flex flex-col items-center justify-center py-8">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    ></path>
                  </svg>
                  <span className="mt-2 text-lg font-medium">
                    Data Barang Masih Kosong
                  </span>
                </div>
              </td>
            </tr>
          ) : (
            barang.map((item, index) => (
              <tr key={item.id_barang} className="border text-center">
                <td className="px-6 py-4 whitespace-nowrap text-sm border">
                  {pageOffset + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm border font-medium">
                  {item.nama_barang}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm border">
                  {formatQty(item.stok_dasar, item.satuan_dasar)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm border">
                  {item.kategori_barang}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm border">
                  {formatToRupiah(item.harga_jual_per_sd)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm border">
                  {formatToRupiah(item.harga_modal_per_sd)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      onEdit(item);
                      openModal();
                    }}
                    className="bg-blue-500 text-white mr-3 px-2 py-1 rounded hover:bg-blue-700 cursor-pointer"
                  >
                    Edit
                  </button>
                  {/* <button
                    onClick={() => onDelete(item.id_barang)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 cursor-pointer"
                  >
                    Hapus
                  </button> */}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
