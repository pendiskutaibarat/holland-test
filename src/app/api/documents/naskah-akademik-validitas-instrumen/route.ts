import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const pdfPath = path.join(
  process.cwd(),
  "Naskah akademik dan validitas Instrumen.pdf",
);

export async function GET() {
  try {
    const pdf = await readFile(pdfPath);

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'inline; filename="Naskah akademik dan validitas Instrumen.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "PDF tidak ditemukan" },
      { status: 404 },
    );
  }
}
