const toSingleValue = (value) => (Array.isArray(value) ? value[0] : value);

const formatExposureTime = (value) => {
  const v = toSingleValue(value);
  if (typeof v === "number" && Number.isFinite(v) && v > 0) {
    if (v >= 1) {
      const fixed = Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1);
      return `${fixed}s`;
    }
    const denominator = Math.round(1 / v);
    return `1/${denominator}s`;
  }
  if (typeof v === "string" && v.trim()) return v.trim();
  return null;
};

const formatAperture = (value) => {
  const v = toSingleValue(value);
  if (typeof v === "number" && Number.isFinite(v)) {
    return Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1);
  }
  if (typeof v === "string" && v.trim()) return v.trim();
  return null;
};

const formatISO = (value) => {
  const v = toSingleValue(value);
  if (typeof v === "number" && Number.isFinite(v)) return Math.round(v).toString();
  if (typeof v === "string" && v.trim()) return v.trim();
  return null;
};

const formatCamera = (make, model) => {
  const cleanMake = typeof make === "string" ? make.trim() : "";
  const cleanModel = typeof model === "string" ? model.trim() : "";
  if (!cleanMake && !cleanModel) return null;
  if (!cleanMake) return cleanModel;
  if (!cleanModel) return cleanMake;
  if (cleanModel.toLowerCase().includes(cleanMake.toLowerCase())) return cleanModel;
  return `${cleanMake} ${cleanModel}`;
};

const parseExifDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "number" && Number.isFinite(value)) return new Date(value);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/^(\d{4})[/:\\-](\d{2})[/:\\-](\d{2})(?:[ T](\d{2}):(\d{2}):(\d{2}))?/);
  if (match) {
    const [, y, m, d, hh = "00", mm = "00", ss = "00"] = match;
    const parsed = new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), Number(ss));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDate = (value) => {
  const date = parseExifDate(value);
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

const getShotTimestamp = (exif) => {
  const shotDate = exif?.DateTimeOriginal || exif?.CreateDate;
  const date = parseExifDate(shotDate);
  return date ? date.getTime() : 0;
};

const buildExifInfo = (exif) => {
  if (!exif) return null;
  const shotDate = formatDate(exif.DateTimeOriginal || exif.CreateDate);
  const camera = formatCamera(exif.Make, exif.Model);
  const lens = typeof exif.LensModel === "string" ? exif.LensModel.trim() : null;
  const shutterSpeed = formatExposureTime(exif.ExposureTime);
  const aperture = formatAperture(exif.FNumber);
  const iso = formatISO(exif.ISO ?? exif.ISOSpeed);

  if (!shotDate && !camera && !lens && !shutterSpeed && !aperture && !iso) return null;
  return {
    shotDate,
    camera,
    lens,
    shutterSpeed,
    aperture,
    iso,
  };
};

const EXIF_PICK_FIELDS = [
  "DateTimeOriginal",
  "CreateDate",
  "Make",
  "Model",
  "LensModel",
  "ExposureTime",
  "FNumber",
  "ISO",
  "ISOSpeed",
];

export { EXIF_PICK_FIELDS, buildExifInfo, formatDate, getShotTimestamp };
