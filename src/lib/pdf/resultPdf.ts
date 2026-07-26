import { readFile } from "node:fs/promises";
import path from "node:path";
import { jsPDF } from "jspdf";
import sharp from "sharp";
import type { PersonalityType } from "@/data/types";

const bannerDataUrlPromises = new Map<string, Promise<string | null>>();
let personalityIconsPromise: Promise<Record<PersonalityType, string | null>> | null = null;
let minatHobiIconsPromise: Promise<Record<string, string | null>> | null = null;

const personalityIconPaths: Record<PersonalityType, string> = {
  realistic: "1 - Realistic (Tipe Praktis dan Fisik  The Doers).png",
  investigative: "2 - Investigative (Tipe Analitis dan Sains, The Thinkers).png",
  artistic: "3 - Artistic (Tipe Kreatif dan Ekspresif  The Creators).png",
  social: "4 - Social (Tipe Suportif dan Humanis, The Helpers).png",
  enterprising: "5 - Enterprising (Tipe Pemimpin dan Bisnis, The Persuaders).png",
  conventional: "6 - Conventional (Tipe Terstruktur dan Presisi, The Organizers).png",
};

const minatHobiIconPaths: Record<string, string> = {
  outdoor: "1 - Outdoor.png",
  mechanical_practical: "2 - Mechanical & Practical.png",
  computational_clerical: "3 - Computational & Clerical.png",
  scientific: "4 - Scientific.png",
  persuasive: "5 - Persuasive.png",
  aesthetic: "6 - Aesthetic.png",
  literary: "7 - Literary.png",
  musical: "8 - Musical.png",
  social_service: "9 - Social Service.png",
  medical: "10 - Medical.png",
};

async function loadImageDataUrl(
  filePath: string,
  options?: {
    width?: number;
    format?: "png" | "jpeg";
    quality?: number;
  },
) {
  try {
    const image = sharp(filePath, { limitInputPixels: false }).rotate();
    if (options?.width) {
      image.resize({ width: options.width, withoutEnlargement: true });
    }

    if (options?.format === "jpeg") {
      const buffer = await image
        .jpeg({
          quality: options.quality ?? 72,
          mozjpeg: true,
        })
        .toBuffer();
      return `data:image/jpeg;base64,${buffer.toString("base64")}`;
    }

    const buffer = await image
      .png({
        compressionLevel: 9,
        palette: true,
        quality: options?.quality ?? 80,
      })
      .toBuffer();
    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch {
    try {
      const file = await readFile(filePath);
      return `data:image/png;base64,${file.toString("base64")}`;
    } catch {
      return null;
    }
  }
}

async function loadBannerDataUrl(filename: string) {
  const cached = bannerDataUrlPromises.get(filename);
  if (cached) return cached;

  const promise = loadImageDataUrl(path.join(process.cwd(), "public", filename), {
    width: 1200,
    format: "jpeg",
    quality: 72,
  });
  bannerDataUrlPromises.set(filename, promise);
  return promise;
}

async function loadPersonalityIcons() {
  if (!personalityIconsPromise) {
    personalityIconsPromise = (async () => {
      const basePath = path.join(
        process.cwd(),
        "Icon Minat dan Karier - RIASEC",
        "Icon Minat dan Karier - RIASEC",
      );

      const entries = await Promise.all(
        (Object.entries(personalityIconPaths) as Array<[PersonalityType, string]>).map(
          async ([type, filename]) => [
            type,
            await loadImageDataUrl(path.join(basePath, filename), {
              width: 220,
              format: "png",
              quality: 78,
            }),
          ] as const,
        ),
      );

      return Object.fromEntries(entries) as Record<PersonalityType, string | null>;
    })();
  }

  return personalityIconsPromise;
}

async function loadMinatHobiIcons() {
  if (!minatHobiIconsPromise) {
    minatHobiIconsPromise = (async () => {
      const basePath = path.join(
        process.cwd(),
        "Icon Minat dan Hobi - RMIB",
        "Icon Minat dan Hobi - RMIB",
      );

      const entries = await Promise.all(
        Object.entries(minatHobiIconPaths).map(async ([code, filename]) => [
          code,
          await loadImageDataUrl(path.join(basePath, filename), {
            width: 220,
            format: "png",
            quality: 75,
          }),
        ] as const),
      );

      return Object.fromEntries(entries) as Record<string, string | null>;
    })();
  }

  return minatHobiIconsPromise;
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
  private readonly marginBottom = 18;
  private y = 0;

  constructor(doc: jsPDF, banner: string | null) {
    this.doc = doc;
    this.banner = banner;
    this.drawHeader();
  }

  private drawHeader() {
    const bannerHeight = this.banner ? (this.pageWidth * 1500) / 6600 : 30;
    this.doc.setFillColor(247, 250, 249);
    this.doc.rect(0, 0, this.pageWidth, bannerHeight, "F");
    if (this.banner) {
      this.doc.addImage(
        this.banner,
        "JPEG",
        0,
        0,
        this.pageWidth,
        bannerHeight,
      );
    } else {
      this.doc.setTextColor(15, 118, 110);
      this.doc.setFont("helvetica", "bold");
      this.doc.setFontSize(16);
      this.doc.text("Holland RIASEC", this.marginX, bannerHeight / 2 + 2);
    }
    this.doc.setDrawColor(215, 225, 224);
    this.doc.line(this.marginX, bannerHeight, this.pageWidth - this.marginX, bannerHeight);
    this.y = bannerHeight + 8;
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

  addSpacer(height = 4) {
    this.ensureSpace(height);
    this.y += height;
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
      this.y += lines.length * 4.8;
    }
    this.y += 6;
  }

  addSection(title: string) {
    this.ensureSpace(16);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(13);
    this.doc.setTextColor(15, 118, 110);
    this.doc.text(title, this.marginX, this.y);
    this.y += 8;
  }

  addKeyValue(label: string, value: string) {
    const line = `${label}: ${value}`;
    const lines = this.wrapLines(line, this.pageWidth - this.marginX * 2);
    this.ensureSpace(lines.length * 5 + 4);
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10.5);
    this.doc.setTextColor(51, 72, 70);
    this.doc.text(lines, this.marginX, this.y);
    this.y += lines.length * 5 + 2;
  }

  addParagraph(text: string, size = 10.5) {
    const lines = this.wrapLines(text, this.pageWidth - this.marginX * 2);
    this.ensureSpace(lines.length * (size * 0.42) + 5);
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(size);
    this.doc.setTextColor(77, 99, 97);
    this.doc.text(lines, this.marginX, this.y);
    this.y += lines.length * (size * 0.42) + 4;
  }

  addResultIntroCard(params: {
    eyebrow: string;
    title: string;
    meta?: string | null;
    description: string;
  }) {
    const titleLines = this.wrapLines(params.title, this.pageWidth - this.marginX * 2 - 8);
    const metaLines = params.meta ? this.wrapLines(params.meta, this.pageWidth - this.marginX * 2 - 8) : [];
    const descriptionLines = this.wrapLines(
      params.description,
      this.pageWidth - this.marginX * 2 - 8,
    );
    const height =
      12 +
      titleLines.length * 6 +
      metaLines.length * 4.8 +
      descriptionLines.length * 4.8;

    this.ensureSpace(height + 4);
    this.doc.setDrawColor(241, 245, 249);
    this.doc.line(this.marginX, this.y - 2, this.pageWidth - this.marginX, this.y - 2);
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(100, 116, 139);
    this.doc.text(params.eyebrow, this.marginX, this.y + 2);

    let cursorY = this.y + 8;
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(19);
    this.doc.setTextColor(15, 23, 42);
    this.doc.text(titleLines, this.marginX, cursorY);
    cursorY += titleLines.length * 6;

    if (metaLines.length > 0) {
      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(9.5);
      this.doc.setTextColor(100, 116, 139);
      this.doc.text(metaLines, this.marginX, cursorY);
      cursorY += metaLines.length * 4.8 + 2;
    }

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);
    this.doc.setTextColor(71, 85, 105);
    this.doc.text(descriptionLines, this.marginX, cursorY);
    this.y = cursorY + descriptionLines.length * 4.8 + 4;
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
      const rowHeight = Math.max(labelLines.length, valueLines.length) * 5 + 5;
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
      this.y += rowHeight + 3;
    });
  }

  addCard(title: string, bodyLines: string[]) {
    const titleLines = this.wrapLines(title, this.pageWidth - this.marginX * 2 - 6);
    const bodyText = bodyLines.join("\n");
    const bodyWrapped = this.wrapLines(bodyText, this.pageWidth - this.marginX * 2 - 6);
    const height = (titleLines.length + bodyWrapped.length) * 5 + 12;
    this.ensureSpace(height);
    this.doc.setFillColor(255, 255, 255);
    this.doc.setDrawColor(215, 225, 224);
    this.doc.roundedRect(this.marginX, this.y - 2, this.pageWidth - this.marginX * 2, height, 3, 3, "FD");
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(11);
    this.doc.setTextColor(35, 56, 54);
    this.doc.text(titleLines, this.marginX + 4, this.y + 3);
    this.y += titleLines.length * 4.8 + 4;
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);
    this.doc.setTextColor(77, 99, 97);
    this.doc.text(bodyWrapped, this.marginX + 4, this.y + 1);
    this.y += bodyWrapped.length * 4.8 + 7;
  }

  addCenteredCodeCard(code: string, badgeName?: string | null, badgeDescription?: string | null) {
    const width = 92;
    const startX = (this.pageWidth - width) / 2;
    const descriptionLines = badgeDescription
      ? this.wrapLines(badgeDescription, width - 10)
      : [];
    const height = 30 + descriptionLines.length * 4.8 + (badgeName ? 8 : 0);
    this.ensureSpace(height + 4);
    this.doc.setFillColor(239, 246, 255);
    this.doc.setDrawColor(191, 219, 254);
    this.doc.roundedRect(startX, this.y - 2, width, height, 4, 4, "FD");
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);
    this.doc.setTextColor(77, 99, 97);
    this.doc.text("Kode Holland-mu", this.pageWidth / 2, this.y + 4, { align: "center" });
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(24);
    this.doc.setTextColor(29, 78, 216);
    this.doc.text(code, this.pageWidth / 2, this.y + 15, { align: "center" });
    let innerY = this.y + 22;
    if (badgeName) {
      this.doc.setFillColor(29, 78, 216);
      this.doc.roundedRect(this.pageWidth / 2 - 24, innerY - 4, 48, 8, 4, 4, "F");
      this.doc.setFont("helvetica", "bold");
      this.doc.setFontSize(9);
      this.doc.setTextColor(255, 255, 255);
      this.doc.text(badgeName, this.pageWidth / 2, innerY + 1.5, { align: "center" });
      innerY += 8;
    }
    if (descriptionLines.length > 0) {
      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(9.5);
      this.doc.setTextColor(77, 99, 97);
      this.doc.text(descriptionLines, this.pageWidth / 2, innerY + 3, { align: "center" });
    }
    this.y += height + 4;
  }

  addIconCard(params: {
    title: string;
    score: number;
    summary: string;
    bullets: string[];
    imageDataUrl?: string | null;
  }) {
    const textWidth = 118;
    const titleLines = this.wrapLines(params.title, textWidth);
    const summaryLines = this.wrapLines(params.summary, textWidth);
    const bulletLines = params.bullets.flatMap((bullet) =>
      this.wrapLines(bullet, textWidth - 4).map((line, index) =>
        index === 0 ? `- ${line}` : `  ${line}`,
      ),
    );
    const textBlockHeight =
      titleLines.length * 4.8 +
      7 +
      summaryLines.length * 4.8 +
      4 +
      bulletLines.length * 4.8 +
      12;
    const height = Math.max(54, textBlockHeight);
    this.ensureSpace(height + 4);
    this.doc.setFillColor(255, 255, 255);
    this.doc.setDrawColor(215, 225, 224);
    this.doc.roundedRect(this.marginX, this.y - 2, this.pageWidth - this.marginX * 2, height, 3, 3, "FD");

    let cursorY = this.y + 3;
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(11);
    this.doc.setTextColor(29, 78, 216);
    this.doc.text(titleLines, this.marginX + 4, cursorY);
    cursorY += titleLines.length * 4.8 + 1;

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);
    this.doc.setTextColor(77, 99, 97);
    this.doc.text(`Skor: ${params.score}`, this.marginX + 4, cursorY);
    cursorY += 5;

    this.doc.setFont("helvetica", "italic");
    this.doc.text(summaryLines, this.marginX + 4, cursorY);
    cursorY += summaryLines.length * 4.8 + 2;

    this.doc.setFont("helvetica", "normal");
    this.doc.text(bulletLines, this.marginX + 4, cursorY);

    if (params.imageDataUrl) {
      this.doc.addImage(params.imageDataUrl, "PNG", this.pageWidth - this.marginX - 34, this.y + 4, 24, 24);
    }

    this.y += height + 5;
  }

  addFeaturedMinatCard(params: {
    rank: number;
    name: string;
    score: number;
    description: string;
    imageDataUrl?: string | null;
  }) {
    const cardWidth = this.pageWidth - this.marginX * 2;
    const textWidth = params.imageDataUrl ? cardWidth - 48 : cardWidth - 10;
    const titleLines = this.wrapLines(params.name, textWidth);
    const descriptionLines = this.wrapLines(params.description, textWidth);
    const height = Math.max(52, 23 + titleLines.length * 6 + descriptionLines.length * 4.8);

    this.ensureSpace(height + 4);
    this.doc.setFillColor(248, 250, 252);
    this.doc.setDrawColor(226, 232, 240);
    this.doc.roundedRect(this.marginX, this.y - 2, cardWidth, height, 3, 3, "FD");

    let cursorY = this.y + 5;
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(29, 78, 216);
    this.doc.text(`PERINGKAT ${params.rank}`, this.marginX + 5, cursorY);
    cursorY += 7;

    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(17);
    this.doc.setTextColor(15, 23, 42);
    this.doc.text(titleLines, this.marginX + 5, cursorY);
    cursorY += titleLines.length * 6;

    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(10.5);
    this.doc.setTextColor(51, 65, 85);
    this.doc.text(`Skor ${params.score}/6`, this.marginX + 5, cursorY + 1);
    cursorY += 7;

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);
    this.doc.setTextColor(71, 85, 105);
    this.doc.text(descriptionLines, this.marginX + 5, cursorY);

    if (params.imageDataUrl) {
      this.doc.addImage(
        params.imageDataUrl,
        "PNG",
        this.pageWidth - this.marginX - 34,
        this.y + 6,
        26,
        26,
      );
    }

    this.y += height + 4;
  }

  addCompactMinatCard(params: {
    rank: number;
    name: string;
    score: number;
    description: string;
    imageDataUrl?: string | null;
  }) {
    this.addIconCard({
      title: `Peringkat ${params.rank} - ${params.name}`,
      score: params.score,
      summary: params.description,
      bullets: [],
      imageDataUrl: params.imageDataUrl,
    });
  }

  addMinatSecondaryGrid(cards: Array<{
    rank: number;
    name: string;
    score: number;
    description: string;
    imageDataUrl?: string | null;
  }>) {
    const gap = 4;
    const cardWidth = (this.pageWidth - this.marginX * 2 - gap) / 2;

    for (let index = 0; index < cards.length; index += 2) {
      const pair = cards.slice(index, index + 2).map((card) => {
        const textWidth = card.imageDataUrl ? cardWidth - 34 : cardWidth - 8;
        const titleLines = this.wrapLines(card.name, textWidth);
        const descriptionLines = this.wrapLines(card.description, textWidth);
        const height = Math.max(42, 18 + titleLines.length * 5.5 + descriptionLines.length * 4.2);
        return { ...card, titleLines, descriptionLines, height };
      });

      const rowHeight = Math.max(...pair.map((card) => card.height));
      this.ensureSpace(rowHeight + 4);

      pair.forEach((card, pairIndex) => {
        const startX = this.marginX + pairIndex * (cardWidth + gap);
        let cursorY = this.y + 4;

        this.doc.setFillColor(248, 250, 252);
        this.doc.setDrawColor(226, 232, 240);
        this.doc.roundedRect(startX, this.y - 2, cardWidth, rowHeight, 3, 3, "FD");

        this.doc.setFont("helvetica", "bold");
        this.doc.setFontSize(9.5);
        this.doc.setTextColor(29, 78, 216);
        this.doc.text(`Peringkat ${card.rank}`, startX + 4, cursorY);
        cursorY += 6;

        this.doc.setFont("helvetica", "bold");
        this.doc.setFontSize(12.5);
        this.doc.setTextColor(15, 23, 42);
        this.doc.text(card.titleLines, startX + 4, cursorY);
        cursorY += card.titleLines.length * 5.5;

        this.doc.setFont("helvetica", "normal");
        this.doc.setFontSize(9.5);
        this.doc.setTextColor(71, 85, 105);
        this.doc.text(`Skor ${card.score}/6`, startX + 4, cursorY + 1);
        cursorY += 5.5;

        this.doc.text(card.descriptionLines, startX + 4, cursorY + 2);

        if (card.imageDataUrl) {
          this.doc.addImage(card.imageDataUrl, "PNG", startX + cardWidth - 24, this.y + 8, 16, 16);
        }
      });

      this.y += rowHeight + 5;
    }
  }

  addActivityCards(rows: Array<{ title: string; items: string[] }>) {
    const gap = 4;
    const cardWidth = (this.pageWidth - this.marginX * 2 - gap * 2) / 3;

    for (let index = 0; index < rows.length; index += 3) {
      const trio = rows.slice(index, index + 3).map((row) => {
        const titleLines = this.wrapLines(row.title, cardWidth - 8);
        const bulletLines = row.items.flatMap((item) =>
          this.wrapLines(`- ${item}`, cardWidth - 8),
        );
        const height = Math.max(36, 10 + titleLines.length * 4.8 + bulletLines.length * 4.3);
        return { ...row, titleLines, bulletLines, height };
      });

      const rowHeight = Math.max(...trio.map((card) => card.height));
      this.ensureSpace(rowHeight + 4);

      trio.forEach((card, cardIndex) => {
        const startX = this.marginX + cardIndex * (cardWidth + gap);
        let cursorY = this.y + 4;

        this.doc.setFillColor(248, 250, 252);
        this.doc.setDrawColor(226, 232, 240);
        this.doc.roundedRect(startX, this.y - 2, cardWidth, rowHeight, 3, 3, "FD");

        this.doc.setFont("helvetica", "bold");
        this.doc.setFontSize(10);
        this.doc.setTextColor(15, 23, 42);
        this.doc.text(card.titleLines, startX + 4, cursorY);
        cursorY += card.titleLines.length * 4.8 + 2;

        this.doc.setFont("helvetica", "normal");
        this.doc.setFontSize(9);
        this.doc.setTextColor(71, 85, 105);
        this.doc.text(card.bulletLines, startX + 4, cursorY);
      });

      this.y += rowHeight + 5;
    }
  }

  addTable(headers: [string, string, string], rows: Array<[string, string, string]>) {
    const startX = this.marginX;
    const tableWidth = this.pageWidth - this.marginX * 2;
    const columns = [24, 112, tableWidth - 136];

    this.ensureSpace(14);
    this.doc.setFillColor(248, 250, 252);
    this.doc.setDrawColor(226, 232, 240);
    this.doc.roundedRect(startX, this.y - 2, tableWidth, 10, 2, 2, "FD");

    let cursorX = startX + 3;
    headers.forEach((header, index) => {
      this.doc.setFont("helvetica", "bold");
      this.doc.setFontSize(10);
      this.doc.setTextColor(30, 41, 59);
      this.doc.text(header, cursorX, this.y + 4);
      cursorX += columns[index];
    });
    this.y += 11;

    rows.forEach((row, rowIndex) => {
      const rankLines = this.wrapLines(row[0], columns[0] - 3);
      const nameLines = this.wrapLines(row[1], columns[1] - 3);
      const scoreLines = this.wrapLines(row[2], columns[2] - 3);
      const rowHeight = Math.max(rankLines.length, nameLines.length, scoreLines.length) * 4.8 + 5;

      this.ensureSpace(rowHeight + 1);
      this.doc.setDrawColor(226, 232, 240);
      if (rowIndex < rows.length - 1) {
        this.doc.line(startX, this.y + rowHeight - 1.5, startX + tableWidth, this.y + rowHeight - 1.5);
      }

      cursorX = startX + 3;
      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(10);
      this.doc.setTextColor(71, 85, 105);
      this.doc.text(rankLines, cursorX, this.y + 3);

      cursorX += columns[0];
      this.doc.setFont("helvetica", "bold");
      this.doc.setTextColor(15, 23, 42);
      this.doc.text(nameLines, cursorX, this.y + 3);

      cursorX += columns[1];
      this.doc.setFont("helvetica", "normal");
      this.doc.setTextColor(71, 85, 105);
      this.doc.text(scoreLines, cursorX, this.y + 3);

      this.y += rowHeight;
    });
    this.y += 2;
  }

  addBars(rows: Array<{ label: string; score: number; max: number; color?: [number, number, number] }>) {
    rows.forEach((row) => {
      const labelLines = this.wrapLines(row.label, 54);
      const rowHeight = labelLines.length * 4.8 + 12;
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
      this.y += rowHeight + 1;
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
  version: "v1" | "v2";
  peminatanRows: Array<{
    key: string;
    label: string;
    score: number;
    max: number;
    valueLabel: string;
    description: string;
    subjects: string[];
  }>;
  topRiasec: Array<{ type: PersonalityType; label: string; score: number; description: string }>;
  scores: Array<{ label: string; score: number }>;
}) {
  const banner = await loadBannerDataUrl("test-banners/riasec-banner.png");
  const personalityIcons = await loadPersonalityIcons();
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
  const layout = new PdfLayout(doc, banner);

  layout.addTitle("Hasil Pemetaan Peminatan SMA/MA", "Laporan hasil asesmen yang bisa dibawa ke guru BK atau wali kelas.");
  layout.addKeyValue("Nama", params.name);
  layout.addKeyValue("Tanggal Lahir", formatDate(params.birthDate));
  layout.addKeyValue("Tanggal Tes", params.testDate);
  layout.addSpacer(3);
  layout.addSection(
    params.version === "v2"
      ? "Skor Kecocokan Peminatan"
      : "Kecenderungan Peminatan (RIASEC v1)",
  );
  layout.addBars(
    params.peminatanRows.map((row) => ({
      label: row.label,
      score: row.score,
      max: row.max,
      color:
        row.key === "ipa"
          ? [29, 78, 216]
          : row.key === "ips"
            ? [5, 150, 105]
            : [180, 83, 9],
    })),
  );

  params.peminatanRows.forEach((row) => {
    layout.addCard(`${row.label} - ${row.valueLabel}`, [
      row.description,
      `Mata pelajaran relevan: ${row.subjects.join(", ")}`,
    ]);
  });

  layout.addSpacer(2);
  layout.addSection("Kepribadian RIASEC Dominan");
  params.topRiasec.forEach((row, index) => {
    layout.addIconCard({
      title: `${index + 1}. ${row.label}`,
      score: row.score,
      summary: row.description,
      bullets: [],
      imageDataUrl: personalityIcons[row.type],
    });
  });

  layout.addSpacer(2);
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
    type: PersonalityType;
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
  const banner = await loadBannerDataUrl("test-banners/riasec-banner.png");
  const personalityIcons = await loadPersonalityIcons();
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
  const layout = new PdfLayout(doc, banner);

  layout.addTitle("Hasil Tes Holland RIASEC", "Laporan hasil asesmen yang bisa langsung dicetak sebagai ringkasan profil.");
  layout.addKeyValue("Nama", params.name);
  layout.addKeyValue("Tanggal Lahir", formatDate(params.birthDate));
  layout.addKeyValue("Tanggal Tes", params.testDate);
  layout.addSpacer(4);
  layout.addCenteredCodeCard(params.hollandCode, params.badgeName, params.badgeDescription);

  layout.addSpacer(3);
  layout.addSection("Profil RIASEC");
  layout.addBars(params.barRows.map((row) => ({ ...row, color: [29, 78, 216] })));

  layout.addSpacer(2);
  layout.addSection("Kepribadian Dominan");
  if (params.dominant.length === 0) {
    layout.addParagraph("Belum ada skor dominan yang bisa ditampilkan untuk hasil ini.");
  } else {
    params.dominant.forEach((row, index) => {
      layout.addIconCard({
        title: `${index + 1}. ${row.label}`,
        score: row.score,
        summary: row.summary,
        bullets: [
          `Sifat Utama: ${row.traits}`,
          `Preferensi (Suka): ${row.preferences}`,
          `Hal yang Dihindari: ${row.avoidances}`,
          `Profesi yang Cocok: ${row.careers.slice(0, 3).map((career) => career.name).join(", ")}`,
        ],
        imageDataUrl: personalityIcons[row.type],
      });
    });
  }

  layout.addSpacer(2);
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
  const banner = await loadBannerDataUrl("test-banners/minat-hobi-banner.png");
  const categoryIcons = await loadMinatHobiIcons();
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
  const layout = new PdfLayout(doc, banner);
  const [topCategory, ...secondaryCategories] = params.topCategories;

  layout.addResultIntroCard({
    eyebrow: "Hasil Asesmen Minat Hobi (RMIB)",
    title: params.studentName,
    meta: params.birthDate ? formatDate(params.birthDate) : null,
    description:
      "Skor tiap kategori berada pada rentang 0 sampai 6. Jika ada skor teratas yang seri, hasil ini sebaiknya dikonfirmasi lagi melalui obrolan singkat dengan guru BK.",
  });

  layout.addSpacer(3);
  layout.addSection("Tiga Minat Teratas");
  if (topCategory) {
    const detail = params.categoryDetails[topCategory.code];
    layout.addFeaturedMinatCard({
      rank: topCategory.rank,
      name: topCategory.name,
      score: topCategory.score,
      description: detail.description,
      imageDataUrl: categoryIcons[topCategory.code],
    });
  }
  layout.addMinatSecondaryGrid(
    secondaryCategories.map((category) => ({
      rank: category.rank,
      name: category.name,
      score: category.score,
      description: params.categoryDetails[category.code].description,
      imageDataUrl: categoryIcons[category.code],
    })),
  );

  layout.addSpacer(2);
  layout.addSection("Rekomendasi Aktivitas");
  layout.addActivityCards(
    params.topCategories.map((category) => ({
      title: category.name,
      items: params.categoryDetails[category.code].activities.slice(0, 5),
    })),
  );

  layout.addSpacer(2);
  layout.addSection("Semua Kategori");
  layout.addTable(
    ["Peringkat", "Kategori", "Skor"],
    params.rankedRows.map((row) => [String(row.rank), row.name, `${row.score}/6`]),
  );

  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    layout.addFooter(page, totalPages);
  }

  return Buffer.from(doc.output("arraybuffer"));
}

export { formatDate, toSlug };
