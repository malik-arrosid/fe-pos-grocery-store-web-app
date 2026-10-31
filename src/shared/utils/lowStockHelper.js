const LOW_STOCK_GRAM_NAMED = { Beras: 1000, Dedak: 1000, Gula: 250 };

export const getLowStockThreshold = (nama_barang, satuan_dasar) => {
  const satuan = String(satuan_dasar || "").toUpperCase();
  if (satuan === "PCS") return 2;
  if (satuan === "GRAM") {
    return LOW_STOCK_GRAM_NAMED[String(nama_barang || "").trim()] ?? 0;
  }
  return 0;
};

export const isLowStock = (item) => {
  if (!item) return false;
  const threshold = getLowStockThreshold(item.nama_barang, item.satuan_dasar);
  return Number(item.stok_dasar) <= threshold;
};