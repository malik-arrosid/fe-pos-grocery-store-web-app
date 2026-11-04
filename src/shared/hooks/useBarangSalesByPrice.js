import { useState, useCallback } from "react";
import { getBarangSalesByPriceOwner } from "../services/reportService.js";

export function useBarangSalesByPrice() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total_data: 0,
    total_page: 0,
    keyword: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async ({ page = 1, limit = 10, id_barang, keyword } = {}) => {
      setLoading(true);
      setError(null);
      try {
        const params = { page, limit };
        if (id_barang) params.id_barang = id_barang;
        if (keyword && keyword.trim()) params.keyword = keyword.trim();

        const res = await getBarangSalesByPriceOwner(params);
        const rows = res.data?.data || [];
        setData(rows);
        if (res.data?.meta) setMeta(res.data.meta);
        return { data: rows, meta: res.data?.meta };
      } catch (err) {
        const msg =
          err.response?.data?.message || err.message || "Gagal memuat data";
        setError(msg);
        return { data: [], meta: null };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { data, meta, loading, error, fetchData };
}