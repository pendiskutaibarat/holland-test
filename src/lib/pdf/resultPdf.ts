import { readFile } from "node:fs/promises";
import path from "node:path";
import { jsPDF } from "jspdf";

let bannerDataUrlPromise: Promise<string | null> | null = null;

async function loadBannerDataUrl() {
  if (!bannerDataUrlPromise) {
    bannerDataUrlPromise = (async () => {
      try {
        const file = await readFile(path.join(process.cwd(), "public", "banner.png"));
        return `data:image/png;base64,${file.toString("base64")}`;
      } catch {
        return null;
      }
    })();
  }

  return bannerDataUrlPromise;
}

function formatDate(value?: string | Date | null) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "siswa";
}

class PdfLayout {
  private readonly doc: jsPDF;
  private readonly banner: string | null;
  private readonly pageWidth = 210;
  private readonly pageHeight = 297;
  private readonly marginX = 14;
  private readonly marginTop = 38;
  private readonly marginBottom = 18;
  private y = this.marginTop;

  constructor(doc: jsPDF, banner: string | null) {
    this.doc = doc;
    this.banner = banner;
    this.drawHeader();
  }

  private drawHeader() {
    this.doc.setFillColor(247, 250, 249);
    this.doc.rect(0, 0, this.pageWidth, 30, "F");
    if (this.banner) {
      this.doc.addImage(this.banner, "PNG", 58, 4, 94, 16);
    } else {
      this.doc.setTextColor(15, 118, 110);
      this.doc.setFont("helvetica", "bold");
      this.doc.setFontSize(16);
      this.doc.text("Holland RIASEC", this.marginX, 17);
    }
    this.doc.setDrawColor(215, 225, 224);
    this.doc.line(this.marginX, 30, this.pageWidth - this.marginX, 30);
    this.y = this.marginTop;
  }

  private newPage() {
    this.doc.addPage();
    this.drawHeader();
  }

  private ensureSpace(height: number) {
    if (this.y + height > this.pageHeight - this.marginBottom) {
      this.newPage();
    }
  }

  private wrapLines(text: string, width: number) {
    return this.doc.splitTextToSize(text, width) as string[];
  }

  addTitle(title: string, subtitle?: string) {
    this.ensureSpace(24);
    this.doc.setTextColor(11, 27, 26);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(18);
    this.doc.text(title, this.marginX, this.y);
    this.y += 7;
    if (subtitle) {
      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(10.5);
      this.doc.setTextColor(77, 99, 97);
      const lines = this.wrapLines(subtitle, this.pageWidth - this.marginX * 2);
      this.doc.text(lines, this.marginX, this.y);
      this.y += lines.length * 4.6;
    }
    this.y += 4;
  }

  addSection(title: string) {
    this.ensureSpace(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(13);
    this.doc.setTextColor(15, 118, 110);
    this.doc.text(title, this.marginX, this.y);
    this.y += 5;
  }

  addKeyValue(label: string, value: string) {
    const line = `${label}: ${value}`;
    const lines = this.wrapLines(line, this.pageWidth - this.marginX * 2);
    this.ensureSpace(lines.length * 5 + 2);
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10.5);
    this.doc.setTextColor(51, 72, 70);
    this.doc.text(lines, this.marginX, this.y);
    this.y += lines.length * 5;
  }

  addParagraph(text: string, size = 10.5) {
    const lines = this.wrapLines(text, this.pageWidth - this.marginX * 2);
    this.ensureSpace(lines.length * (size * 0.42) + 3);
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(size);
    this.doc.setTextColor(77, 99, 97);
    this.doc.text(lines, this.marginX, this.y);
    this.y += lines.length * (size * 0.42) + 2;
  }

  addBullets(items: string[]) {
    items.forEach((item) => {
      const lines = this.wrapLines(item, this.pageWidth - this.marginX * 2 - 6);
      this.ensureSpace(lines.length * 5 + 2);
      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(10.5);
      this.doc.setTextColor(77, 99, 97);
      this.doc.text(`- ${lines[0]}`, this.marginX, this.y);
      for (let i = 1; i < lines.length; i += 1) {
        this.y += 5;
        this.doc.text(lines[i], this.marginX + 4, this.y);
      }
      this.y += 5;
    });
  }

  addScoreRows(rows: Array<{ label: string; value: string }>) {
    const startX = this.marginX;
    const labelWidth = 68;
    const valueWidth = this.pageWidth - this.marginX * 2 - labelWidth - 4;
    rows.forEach((row) => {
      const labelLines = this.wrapLines(row.label, labelWidth);
      const valueLines = this.wrapLines(row.value, valueWidth);
      const rowHeight = Math.max(labelLines.length, valueLines.length) * 5 + 2;
      this.ensureSpace(rowHeight);
      this.doc.setFillColor(247, 250, 249);
      this.doc.roundedRect(startX, this.y - 3.5, this.pageWidth - this.marginX * 2, rowHeight, 2, 2, "F");
      this.doc.setFont("helvetica", "bold");
      this.doc.setFontSize(10);
      this.doc.setTextColor(35, 56, 54);
      this.doc.text(labelLines, startX + 3, this.y + 1);
      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(10);
      this.doc.setTextColor(77, 99, 97);
      this.doc.text(valueLines, startX + labelWidth + 7, this.y + 1);
      this.y += rowHeight + 2;
    });
  }

  addCard(title: string, bodyLines: string[]) {
    const titleLines = this.wrapLines(title, this.pageWidth - this.marginX * 2 - 6);
    const bodyText = bodyLines.join("\n");
    const bodyWrapped = this.wrapLines(bodyText, this.pageWidth - this.marginX * 2 - 6);
    const height = (titleLines.length + bodyWrapped.length) * 4.8 + 8;
    this.ensureSpace(height);
    this.doc.setFillColor(255, 255, 255);
    this.doc.setDrawColor(215, 225, 224);
    this.doc.roundedRect(this.marginX, this.y - 2, this.pageWidth - this.marginX * 2, height, 3, 3, "FD");
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(11);
    this.doc.setTextColor(35, 56, 54);
    this.doc.text(titleLines, this.marginX + 3, this.y + 2);
    this.y += titleLines.length * 4.6 + 2;
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);
    this.doc.setTextColor(77, 99, 97);
    this.doc.text(bodyWrapped, this.marginX + 3, this.y + 1);
    this.y += bodyWrapped.length * 4.6 + 5;
  }

  addBars(rows: Array<{ label: string; score: number; max: number; color?: [number, number, number] }>) {
    rows.forEach((row) => {
      const labelLines = this.wrapLines(row.label, 54);
      const rowHeight = labelLines.length * 4.6 + 10;
      this.ensureSpace(rowHeight);
      const barX = this.marginX + 60;
      const barWidth = this.pageWidth - this.marginX * 2 - 60;
      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(10);
      this.doc.setTextColor(51, 72, 70);
      this.doc.text(labelLines, this.marginX, this.y);
      const topY = this.y + 1.6;
      this.doc.setDrawColor(215, 225, 224);
      this.doc.roundedRect(barX, topY, barWidth, 4, 1, 1, "S");
      const fillWidth = Math.max(0, Math.min(1, row.score / row.max)) * barWidth;
      const [r, g, b] = row.color ?? [15, 118, 110];
      this.doc.setFillColor(r, g, b);
      if (fillWidth > 0) {
        this.doc.roundedRect(barX, topY, fillWidth, 4, 1, 1, "F");
      }
      this.doc.setFont("helvetica", "bold");
      this.doc.setTextColor(r, g, b);
      this.doc.text(String(row.score), barX + barWidth + 2, this.y + 4.2);
      this.y += rowHeight;
    });
  }

  addFooter(pageNumber: number, totalPages: number) {
    const label = `Halaman ${pageNumber} dari ${totalPages}`;
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(9);
    this.doc.setTextColor(103, 120, 118);
    this.doc.text(label, this.pageWidth - this.marginX, this.pageHeight - 8, { align: "right" });
  }
}

export async function renderPeminatanPdf(params: {
  name: string;
  birthDate?: string | null;
  testDate: string;
  percentages: Record<string, number>;
  topPeminatan: string[];
  peminatanInfo: Record<string, { label: string; description: string; subjects: string[] }>;
  topRiasec: Array<{ label: string; score: number; description: string }>;
  scores: Array<{ label: string; score: number }>;
}) {
  const banner = await loadBannerDataUrl();
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
  const layout = new PdfLayout(doc, banner);

  layout.addTitle("Hasil Pemetaan Peminatan SMA/MA", "Laporan hasil asesmen yang bisa dibawa ke guru BK atau wali kelas.");
  layout.addKeyValue("Nama", params.name);
  layout.addKeyValue("Tanggal Lahir", formatDate(params.birthDate));
  layout.addKeyValue("Tanggal Tes", params.testDate);
  layout.addSection("Kecenderungan Peminatan");
  layout.addBars(
    params.topPeminatan.map((key) => ({
      label: params.peminatanInfo[key].label,
      score: params.percentages[key],
      max: Math.max(...params.topPeminatan.map((candidate) => params.percentages[candidate])),
      color:
        key === "ipa"
          ? [29, 78, 216]
          : key === "ips"
            ? [5, 150, 105]
            : [180, 83, 9],
    })),
  );

  params.topPeminatan.forEach((key) => {
    layout.addCard(params.peminatanInfo[key].label, [
      params.peminatanInfo[key].description,
      `Mata pelajaran relevan: ${params.peminatanInfo[key].subjects.join(", ")}`,
      `Porsi hasil: ${params.percentages[key]}%`,
    ]);
  });

  layout.addSection("Kepribadian RIASEC Dominan");
  params.topRiasec.forEach((row, index) => {
    layout.addCard(`${index + 1}. ${row.label}`, [`Skor: ${row.score}`, row.description]);
  });

  layout.addSection("Detail Semua Hasil RIASEC");
  layout.addScoreRows(params.scores.map((row) => ({ label: row.label, value: `${row.score} poin` })));

  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    layout.addFooter(page, totalPages);
  }

  return Buffer.from(doc.output("arraybuffer"));
}

export async function renderKarirPdf(params: {
  name: string;
  birthDate?: string | null;
  testDate: string;
  hollandCode: string;
  badgeName?: string | null;
  badgeDescription?: string | null;
  barRows: Array<{ label: string; score: number; max: number }>;
  dominant: Array<{
    label: string;
    score: number;
    summary: string;
    traits: string;
    preferences: string;
    avoidances: string;
    careers: Array<{ name: string; desc: string; majorRecommendation: string }>;
  }>;
  scores: Array<{ label: string; score: number }>;
}) {
  const banner = await loadBannerDataUrl();
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
  const layout = new PdfLayout(doc, banner);

  layout.addTitle("Hasil Tes Holland RIASEC", "Laporan hasil asesmen yang bisa langsung dicetak sebagai ringkasan profil.");
  layout.addKeyValue("Nama", params.name);
  layout.addKeyValue("Tanggal Lahir", formatDate(params.birthDate));
  layout.addKeyValue("Tanggal Tes", params.testDate);
  layout.addKeyValue("Kode Holland", params.hollandCode);
  if (params.badgeName) {
    layout.addParagraph(`Lencana profil: ${params.badgeName}`);
  }
  if (params.badgeDescription) {
    layout.addParagraph(params.badgeDescription);
  }

  layout.addSection("Profil RIASEC");
  layout.addBars(params.barRows.map((row) => ({ ...row, color: [29, 78, 216] })));

  layout.addSection("Kepribadian Dominan");
  params.dominant.forEach((row, index) => {
    layout.addCard(`${index + 1}. ${row.label}`, [
      `Skor: ${row.score}`,
      row.summary,
      `Sifat utama: ${row.traits}`,
      `Preferensi: ${row.preferences}`,
      `Hal yang dihindari: ${row.avoidances}`,
      `Profesi yang cocok: ${row.careers.slice(0, 3).map((career) => career.name).join(", ")}`,
    ]);
  });

  layout.addSection("Detail Semua Hasil");
  layout.addScoreRows(params.scores.map((row) => ({ label: row.label, value: `${row.score} poin` })));

  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    layout.addFooter(page, totalPages);
  }

  return Buffer.from(doc.output("arraybuffer"));
}

export async function renderMinatHobiPdf(params: {
  studentName: string;
  birthDate?: string | null;
  testDate: string;
  topCategories: Array<{ code: string; name: string; score: number; rank: number }>;
  categoryDetails: Record<string, { description: string; activities: string[] }>;
  rankedRows: Array<{ rank: number; name: string; score: number }>;
}) {
  const banner = await loadBannerDataUrl();
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
  const layout = new PdfLayout(doc, banner);

  layout.addTitle("Hasil Asesmen Minat Hobi (RMIB)", "Laporan hasil asesmen untuk diskusi lanjutan dengan guru BK.");
  layout.addKeyValue("Nama", params.studentName);
  layout.addKeyValue("Tanggal Lahir", formatDate(params.birthDate));
  layout.addKeyValue("Tanggal Tes", params.testDate);

  layout.addSection("Tiga Minat Teratas");
  params.topCategories.forEach((category) => {
    const detail = params.categoryDetails[category.code];
    layout.addCard(`${category.rank}. ${category.name}`, [
      `Skor: ${category.score}/6`,
      detail.description,
    ]);
  });

  layout.addSection("Rekomendasi Aktivitas");
  params.topCategories.forEach((category) => {
    const detail = params.categoryDetails[category.code];
    layout.addCard(category.name, detail.activities.slice(0, 5).map((activity) => `- ${activity}`));
  });

  layout.addSection("Semua Kategori");
  layout.addScoreRows(params.rankedRows.map((row) => ({ label: `${row.rank}. ${row.name}`, value: `${row.score}/6` })));

  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    layout.addFooter(page, totalPages);
  }

  return Buffer.from(doc.output("arraybuffer"));
}

export { formatDate, toSlug };
