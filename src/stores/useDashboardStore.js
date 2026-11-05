import { create } from "zustand";

const emptyTodayStats = {
  total_transaksi_hari_ini: 0,
  omset_hari_ini: 0,
  total_pembelian_barang_hari_ini: 0,
  jumlah_barang_masuk_hari_ini: 0,
  keuntungan_bersih_hari_ini: 0,
  jumlah_barang_terjual_hari_ini: 0,
  untung_rugi_omset: 0,
  status_untung_rugi_omset: "untung",
};

export const useDashboardStore = create((set) => ({
  dashboardStats: {
    totalBarang: 0,
    totalBarangMasukHariIni: 0,
    totalTransaksi: 0,
    totalPelanggan: 0,
  },
  setDashboardStats: (stats) => set({ dashboardStats: stats }),

  todayStats: emptyTodayStats,
  setTodayStats: (stats) => set({ todayStats: stats }),

  dateRangeData: [],
  setDateRangeData: (data) => set({ dateRangeData: data }),

  clearDashboard: () =>
    set({
      dashboardStats: {
        totalBarang: 0,
        totalBarangMasukHariIni: 0,
        totalTransaksi: 0,
        totalPelanggan: 0,
      },
      todayStats: emptyTodayStats,
      dateRangeData: [],
    }),
}));