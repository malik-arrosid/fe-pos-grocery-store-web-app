import ownerClient from "../../lib/http/ownerClient.js";

export const getBarangSalesByPriceOwner = (params) =>
  ownerClient.get("/reports/barang-sales-by-price", { params });