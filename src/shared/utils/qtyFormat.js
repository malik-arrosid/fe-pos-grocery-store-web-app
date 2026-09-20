export const parseGramInteger = (v) => {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number" && Number.isFinite(v)) return Math.trunc(v);
  const s = String(v).trim();
  if (s === "") return 0;
  const cleaned = s.replace(/[^\d-]/g, "");
  if (cleaned === "" || cleaned === "-") return 0;
  const n = parseInt(cleaned, 10);
  return Number.isFinite(n) ? n : 0;
};

// export const formatKg = (kg) => {
//   const num = Number(kg);
//   if (!isFinite(num)) return "-";
//   const rounded = Math.round((num + Number.EPSILON) * 1000) / 1000;
//   return String(rounded).replace(/\.?0+$/, "");
// };

export const formatQty = (value, unit) => {
  const qty = parseGramInteger(value);
  const satuan = String(unit ?? "")
    .trim()
    .toUpperCase();
  if (!Number.isFinite(qty)) return "-";
  if (satuan === "GRAM" || satuan === "G") {
    if (qty >= 1000) {
      return `${(qty / 1000)} kg`;
    }
    return `${qty} gr`;
  }
  const displaySatuan = satuan ? satuan.toLowerCase() : "pcs";
  return `${qty} ${displaySatuan}`;
};
