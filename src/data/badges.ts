import { Badge } from "./types";

export const badges: Badge[] = [
  {
    code: "SIA",
    name: "Inovator Analitis",
    description:
      "Kamu adalah pribadi yang suka menggali ide-ide baru sambil tetap memperhatikan dampaknya bagi orang lain. Kombinasi Investigatif dan Artistik membuatmu kreatif dalam memecahkan masalah, sementara Sosial membuatmu peduli pada kesejahteraan komunitas.",
  },
  {
    code: "SAI",
    name: "Kreator Peduli",
    description:
      "Kamu menggabungkan empati tinggi dengan imajinasi yang kuat. Kamu suka membantu orang lain melalui pendekatan kreatif dan tidak konvensional, seperti seni terapi, desain sosial, atau komunikasi humanis.",
  },
  {
    code: "ISE",
    name: "Peneliti Wirausaha",
    description:
      "Kamu suka menganalisis data dan menemukan fakta, namun juga punya semangat untuk membuat ide-ide itu berdampak nyata melalui bisnis atau inisiatif sosial.",
  },
  {
    code: "IRA",
    name: "Teknisi Kreatif",
    description:
      "Kamu nyaman dengan alat dan teknologi, tapi tidak hanya teknis — kamu juga ingin menciptakan solusi yang estetis dan inovatif, seperti arsitektur, desain produk teknis, atau game development.",
  },
  {
    code: "ESC",
    name: "Pemimpin Organisasi",
    description:
      "Kamu memiliki semangat kepemimpinan yang kuat, pandai bernegosiasi, dan teratur dalam bekerja. Kamu cocok memimpin tim, mengelola proyek, atau mengembangkan karir di dunia korporasi dan politik.",
  },
  {
    code: "ECS",
    name: "Administrator Strategis",
    description:
      "Kamu teliti, terstruktur, namun juga punya visi bisnis. Kombinasi ini sangat cocok untuk peran manajemen operasional, keuangan, atau administrasi tingkat tinggi.",
  },
  {
    code: "AIS",
    name: "Humanis Visioner",
    description:
      "Kamu memadukan seni, intelektualitas, dan kepedulian sosial. Kamu tertarik pada bidang seperti desain komunikasi visual, psikologi seni, pendidikan kreatif, atau advokasi sosial berbasis budaya.",
  },
  {
    code: "RIE",
    name: "Pengusaha Teknis",
    description:
      "Kamu praktis, analitis, dan berani mengambil risiko. Kamu suka membangun solusi berbasis teknologi atau rekayasa yang memiliki potensi komersial.",
  },
  {
    code: "SCE",
    name: "Koordinator Pelayanan",
    description:
      "Kamu ramah, teliti, dan punya kemampuan mengorganisasi. Kamu cocok di bidang pelayanan publik, administrasi sosial, atau manajemen acara komunitas.",
  },
  {
    code: "CEI",
    name: "Analis Sistem",
    description:
      "Kamu sangat teliti, suka data, dan suka memahami cara kerja sistem. Kombinasi ini sangat cocok untuk data analyst, auditor sistem, quality assurance, atau riset operasional.",
  },
];

export function getBadgeByCode(code: string): Badge | undefined {
  return badges.find((b) => b.code === code.toUpperCase());
}

export function getTop3Code(results: { type: string; score: number }[]): string {
  const sorted = [...results].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    // tie-breaker: alphabetical by type
    return a.type.localeCompare(b.type);
  });
  const top3 = sorted.slice(0, 3);
  const typeToLetter: Record<string, string> = {
    realistic: "R",
    investigative: "I",
    artistic: "A",
    social: "S",
    enterprising: "E",
    conventional: "C",
  };
  return top3.map((r) => typeToLetter[r.type]).join("");
}
