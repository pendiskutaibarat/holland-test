import type {
  PersonalityType,
  PeminatanCompatibility,
  PeminatanInfo,
  PeminatanType,
  PeminatanWeights,
} from "./types";

export const PEMINATAN_WEIGHTS: Record<PersonalityType, PeminatanWeights> = {
  realistic: { ipa: 0.80, ips: 0.15, bahasa: 0.05 },
  investigative: { ipa: 0.70, ips: 0.20, bahasa: 0.10 },
  artistic: { ipa: 0.15, ips: 0.20, bahasa: 0.65 },
  social: { ipa: 0.10, ips: 0.70, bahasa: 0.20 },
  enterprising: { ipa: 0.10, ips: 0.65, bahasa: 0.25 },
  conventional: { ipa: 0.15, ips: 0.70, bahasa: 0.15 },
};

export const PEMINATAN_INFO: Record<string, PeminatanInfo> = {
  ipa: {
    type: "ipa",
    label: "Ilmu Pengetahuan Alam (IPA)",
    description:
      "Kamu menunjukkan kecenderungan kuat pada pemikiran analitis, observasi sistematis, dan minat pada fenomena alam. Peminatan IPA akan mengasah kemampuanmu dalam memahami prinsip-prinsip sains, matematika, dan teknis.",
    subjects: ["Fisika", "Kimia", "Biologi", "Matematika (Peminatan)", "Informatika"],
  },
  ips: {
    type: "ips",
    label: "Ilmu Pengetahuan Sosial (IPS)",
    description:
      "Kamu menunjukkan kecenderungan kuat pada interaksi sosial, analisis manusia, serta manajerial dan administratif. Peminatan IPS akan mengasah kemampuanmu dalam memahami dinamika masyarakat, ekonomi, sejarah, dan geografi.",
    subjects: ["Ekonomi", "Sosiologi", "Sejarah", "Geografi", "Antropologi"],
  },
  bahasa: {
    type: "bahasa",
    label: "Bahasa dan Budaya",
    description:
      "Kamu menunjukkan kecenderungan kuat pada ekspresi kreatif, komunikasi verbal, dan apresiasi budaya. Peminatan Bahasa akan mengasah kemampuanmu dalam bahasa, sastra, komunikasi, dan pemahaman lintas budaya.",
    subjects: ["Bahasa Indonesia", "Bahasa Inggris", "Bahasa Asing Lain", "Sastra", "Sejarah Kebudayaan"],
  },
};

export const PEMINATAN_AFFINITY: Record<
  PersonalityType,
  Record<PeminatanType, number>
> = {
  realistic: { ipa: 2, ips: 0, bahasa: 0 },
  investigative: { ipa: 3, ips: 1, bahasa: 1 },
  artistic: { ipa: 0, ips: 1, bahasa: 3 },
  social: { ipa: 0, ips: 3, bahasa: 2 },
  enterprising: { ipa: 0, ips: 3, bahasa: 1 },
  conventional: { ipa: 1, ips: 2, bahasa: 0 },
};

export const PEMINATAN_COMPATIBILITY: Record<
  PeminatanCompatibility,
  { label: string; priority: string; description: string }
> = {
  sangat_cocok: {
    label: "Sangat Cocok",
    priority: "Prioritas Utama",
    description:
      "Kamu memiliki modal kepribadian dan gaya belajar yang sangat selaras dengan tuntutan akademik peminatan ini.",
  },
  cukup_cocok: {
    label: "Cukup Cocok",
    priority: "Alternatif Kuat",
    description:
      "Kamu dapat mengikuti ritme pembelajaran peminatan ini, meskipun mungkin perlu beradaptasi lebih pada beberapa mata pelajaran.",
  },
  kurang_cocok: {
    label: "Kurang Cocok",
    priority: "Tidak Disarankan",
    description:
      "Kecenderungan alamiah kamu kurang selaras dengan inti keilmuan peminatan ini.",
  },
};
