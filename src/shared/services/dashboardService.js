import adminClient from "../../lib/http/adminClient.js";
import ownerClient from "../../lib/http/ownerClient.js";

const getCollectionTotal = (responseData) => {
  const totalFromMeta = Number(responseData?.meta?.total_data);
  if (Number.isFinite(totalFromMeta)) return totalFromMeta;

  const rows = responseData?.rows || responseData?.data || [];
  return Array.isArray(rows) ? rows.length : 0;
};

const getTodayRangeParams = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const date = `${year}-${month}-${day}`;

  return {
    from_date: `${date} 00:00:00`,
    to_date: `${date} 23:59:59`,
    page: 1,
    limit: 1,
  };
};

// Get dashboard stats
const getDashboardStatsAdmin = async () => {
  const [barangRes, barangMasukHariIniRes] = await Promise.all([
    adminClient.get("/barang"),
    adminClient.get("/barang-masuk", {
      params: getTodayRangeParams(),
    }),
  ]);

  return {
    totalBarang: getCollectionTotal(barangRes.data),
    totalBarangMasukHariIni: getCollectionTotal(barangMasukHariIniRes.data),
    totalTransaksi: 0,
    totalPelanggan: 0,
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
    totalBarangMasukHariIni: 0,
    totalTransaksi: getCollectionTotal(transaksiRes.data),
    totalPelanggan: getCollectionTotal(pelangganRes.data),
  };
};

const getDateRangeSalesOwner = (startDate, endDate) => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  const query = params.toString();
  return ownerClient.get(`/transaksi/stats/date-range${query ? `?${query}` : ""}`);
};

const getOwnerDashboardTodayStats = async () => {
  const res = await ownerClient.get("/dashboard/stats");
  return (
    res.data?.data || {
      total_transaksi_hari_ini: 0,
      omset_hari_ini: 0,
      total_pembelian_barang_hari_ini: 0,
      jumlah_barang_masuk_hari_ini: 0,
      keuntungan_bersih_hari_ini: 0,
    }
  );
};

export {
  getDashboardStatsAdmin,
  getDashboardStatsOwner,
  getDateRangeSalesOwner,
  getOwnerDashboardTodayStats,
};