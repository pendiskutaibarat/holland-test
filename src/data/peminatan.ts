import { PersonalityType, PeminatanWeights, PeminatanInfo } from "./types";

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