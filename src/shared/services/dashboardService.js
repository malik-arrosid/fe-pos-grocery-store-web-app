import adminClient from "../../lib/http/adminClient.js";
import ownerClient from "../../lib/http/ownerClient.js";

const getCollectionTotal = (responseData) => {
  const totalFromMeta = Number(responseData?.meta?.total_data);
  if (Number.isFinite(totalFromMeta)) return totalFromMeta;

  const rows = responseData?.rows || responseData?.data || [];
  return Array.isArray(rows) ? rows.length : 0;
};

// Get dashboard stats
const getDashboardStatsAdmin = async () => {
  const [barangRes, transaksiRes, pelangganRes] = await Promise.all([
    adminClient.get("/barang"),
    adminClient.get("/transaksi"),
    adminClient.get("/pelanggan"),
  ]);

  return {
    totalBarang: getCollectionTotal(barangRes.data),
    totalTransaksi: getCollectionTotal(transaksiRes.data),
    totalPelanggan: getCollectionTotal(pelangganRes.data),
  };
};

const getDashboardStatsOwner = async () => {
  const [barangRes, transaksiRes, pelangganRes] = await Promise.all([
    ownerClient.get("/barang"),
    ownerClient.get("/transaksi"),
    ownerClient.get("/pelanggan"),
  ]);

  return {
    totalBarang: getCollectionTotal(barangRes.data),
    totalTransaksi: getCollectionTotal(transaksiRes.data),
    totalPelanggan: getCollectionTotal(pelangganRes.data),
  };
};

// Get weekly sales data
const getDateRangeSalesAdmin = (startDate, endDate) => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  const query = params.toString();
  return adminClient.get(`/transaksi/stats/date-range${query ? `?${query}` : ""}`);
};

const getDateRangeSalesOwner = (startDate, endDate) => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  const query = params.toString();
  return ownerClient.get(`/transaksi/stats/date-range${query ? `?${query}` : ""}`);
};

export {
  getDashboardStatsAdmin,
  getDashboardStatsOwner,
  getDateRangeSalesAdmin,
  getDateRangeSalesOwner,
};