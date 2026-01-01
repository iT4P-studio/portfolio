const fs = require("fs");
const path = require("path");

const baseUrl = "https://it4pstudio.com";
const routes = ["/", "/photo", "/movie", "/price", "/about", "/contact"];

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isValidDateString = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);

const resolveLastmod = () => {
  const envDate = process.env.SITEMAP_LASTMOD || process.env.BUILD_DATE;
  if (envDate && isValidDateString(envDate)) {
    return envDate;
  }
  if (process.env.SOURCE_DATE_EPOCH && /^\d+$/.test(process.env.SOURCE_DATE_EPOCH)) {
    return formatDate(new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000));
  }
  return formatDate(new Date());
};

const lastmod = resolveLastmod();
const urlEntries = routes
  .map((route) => {
    const loc = route === "/" ? baseUrl : `${baseUrl}${route}`;
    return [
      "  <url>",
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      "  </url>",
    ].join("\n");
  })
  .join("\n");

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  urlEntries,
  "</urlset>",
  "",
].join("\n");

const targetPath = path.join(__dirname, "..", "public", "sitemap.xml");
fs.writeFileSync(targetPath, xml, "utf8");
