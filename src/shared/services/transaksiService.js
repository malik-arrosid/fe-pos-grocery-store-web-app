import adminClient from "../../lib/http/adminClient.js";
import kasirClient from "../../lib/http/kasirClient.js";
import ownerClient from "../../lib/http/ownerClient.js";

export const createTransaksi = (data) => kasirClient.post("/transaksi", data);

export const getHistoriTransaksiAdmin = (params) =>
  adminClient.get("/transaksi", { params });

export const getHistoriTransaksiKasir = (params) =>
  kasirClient.get("/transaksi", { params });

export const getHistoriTransaksiOwner = (params) =>
  ownerClient.get("/transaksi", { params });

export const searchTransaksiAdmin = (kodeTransaksi, params = {}) =>
  adminClient.get("/transaksi/search", {
    params: { kode_transaksi: kodeTransaksi, ...params },
  });

export const searchTransaksiKasir = (kodeTransaksi, params = {}) =>
  kasirClient.get("/transaksi/search", {
    params: { kode_transaksi: kodeTransaksi, ...params },
  });

export const searchTransaksiOwner = (kodeTransaksi, params = {}) =>
  ownerClient.get("/transaksi/search", {
    params: { kode_transaksi: kodeTransaksi, ...params },
  });

export const getDetailTransaksiAdmin = (id) =>
  adminClient.get(`/transaksi/${id}`);
export const getDetailTransaksiKasir = (id) =>
  kasirClient.get(`/transaksi/${id}`);
export const getDetailTransaksiOwner = (id) =>
  ownerClient.get(`/transaksi/${id}`);

export const downloadInvoiceAdmin = (idTransaksi) =>
  adminClient.get(`/transaksi/${idTransaksi}/invoice/download`, {
    responseType: "blob",
  });
export const downloadInvoiceKasir = (idTransaksi) =>
  kasirClient.get(`/transaksi/${idTransaksi}/invoice/download`, {
    responseType: "blob",
  });
export const downloadInvoiceOwner = (idTransaksi) =>
  ownerClient.get(`/transaksi/${idTransaksi}/invoice/download`, {
    responseType: "blob",
  });