import { PersonalityInfo, PersonalityType } from "./types";

export const personalities: Record<PersonalityType, PersonalityInfo> = {
  realistic: {
    type: "realistic",
    label: "Realistic (Realistis)",
    description:
      "Individu dengan tipe ini bertindak berdasarkan fakta dan hasil yang nyata. Mereka memiliki kecerdasan kinestetik atau mekanik yang baik.",
    summary:
      "Individu dengan tipe ini bertindak berdasarkan fakta dan hasil yang nyata. Mereka memiliki kecerdasan kinestetik atau mekanik yang baik.",
    traits:
      "Praktis, tangkas, logis, tidak banyak bicara, dan mengutamakan tindakan fisik.",
    preferences:
      "Bekerja di luar ruangan (lapangan), menggunakan perkakas, mengoperasikan mesin atau alat berat, dan berinteraksi dengan flora/fauna.",
    avoidances:
      "Teori yang terlalu abstrak, diskusi yang bertele-tele, dan pekerjaan yang menuntut interaksi sosial intens atau negosiasi.",
  },
  investigative: {
    type: "investigative",
    label: "Investigative (Investigatif)",
    description:
      "Individu ini sangat digerakkan oleh rasa ingin tahu dan pencarian kebenaran melalui metode ilmiah atau logika.",
    summary:
      "Individu ini sangat digerakkan oleh rasa ingin tahu dan pencarian kebenaran melalui metode ilmiah atau logika.",
    traits:
      "Analitis, rasional, intelektual, kritis, dan berorientasi pada pemecahan masalah (problem-solving).",
    preferences:
      "Mengumpulkan data, meneliti fenomena, observasi mendalam, matematika/sains, dan bekerja secara mandiri.",
    avoidances:
      "Kegiatan repetitif (rutinitas berulang yang membosankan), memimpin banyak orang, atau tugas memengaruhi/membujuk orang lain.",
  },
  artistic: {
    type: "artistic",
    label: "Artistic (Artistik)",
    description:
      "Tipe yang melihat dunia sebagai kanvas. Mereka tidak menyukai batasan dan lebih memilih mengekspresikan diri melalui karya.",
    summary:
      "Tipe yang melihat dunia sebagai kanvas. Mereka tidak menyukai batasan dan lebih memilih mengekspresikan diri melalui karya.",
    traits:
      "Imajinatif, orisinal, ekspresif, intuitif, idealis, dan cenderung tidak kaku (fleksibel).",
    preferences:
      "Kebebasan berekspresi, seni visual, desain, musik, menulis, aktivitas konseptual, dan menciptakan ide/karya baru yang tidak biasa.",
    avoidances:
      "Aturan atau SOP yang terlalu ketat, jam kerja terstruktur secara kaku, dan tugas administratif atau klerikal.",
  },
  social: {
    type: "social",
    label: "Social (Sosial)",
    description:
      "Tipe yang menjadikan manusia sebagai fokus utama mereka. Mereka mendapatkan kepuasan dari melihat orang lain berkembang atau pulih.",
    summary:
      "Tipe yang menjadikan manusia sebagai fokus utama mereka. Mereka mendapatkan kepuasan dari melihat orang lain berkembang atau pulih.",
    traits:
      "Empatik, hangat, komunikatif, sabar, suportif, dan sangat menghargai kerja sama tim.",
    preferences:
      "Mengajar, menyembuhkan, melatih, memfasilitasi, mendengarkan, dan kegiatan sosial yang berdampak langsung pada masyarakat.",
    avoidances:
      "Bekerja sendirian terisolasi dari manusia (seperti berhadapan dengan mesin atau data angka terus-menerus), dan lingkungan kerja yang terlalu kompetitif/kejam.",
  },
  enterprising: {
    type: "enterprising",
    label: "Enterprising (Wirausaha)",
    description:
      "Individu dengan tipe ini adalah 'motor' dalam sebuah kelompok. Mereka pandai melihat peluang, mengambil risiko, dan mengarahkan orang lain.",
    summary:
      "Individu dengan tipe ini adalah 'motor' dalam sebuah kelompok. Mereka pandai melihat peluang, mengambil risiko, dan mengarahkan orang lain.",
    traits:
      "Ambisius, percaya diri, persuasif, ekstrover, kompetitif, dan berjiwa kepemimpinan.",
    preferences:
      "Bernegosiasi, memimpin proyek, mengejar target (keuntungan finansial atau status), berbicara di depan umum, dan memengaruhi keputusan.",
    avoidances:
      "Observasi atau riset sains yang terlalu detail dan sunyi, pekerjaan teknis yang kaku, atau posisi pasif yang tidak memberikan ruang untuk berkembang/promosi.",
  },
  conventional: {
    type: "conventional",
    label: "Conventional (Konvensional)",
    description:
      "Tipe yang menjadi tulang punggung operasional di banyak instansi karena kemampuannya menjaga keteraturan dan presisi.",
    summary:
      "Tipe yang menjadi tulang punggung operasional di banyak instansi karena kemampuannya menjaga keteraturan dan presisi.",
    traits:
      "Terstruktur, teliti, rapi, sangat berorientasi pada detail (detail-oriented), dan taat pada aturan.",
    preferences:
      "Mengolah data angka atau teks, pengarsipan, mengoperasikan perangkat lunak basis data, serta lingkungan kerja dengan SOP (Standar Operasional Prosedur) dan hierarki yang jelas.",
    avoidances:
      "Situasi kerja yang ambigu/tidak jelas arahnya, tugas yang tiba-tiba menuntut kreativitas bebas, atau posisi kepemimpinan yang minim panduan teknis.",
  },
};
