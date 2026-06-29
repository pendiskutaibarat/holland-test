export interface MinatHobiCategory {
  code: string;
  name: string;
  description: string;
  activities: string[];
}

export interface MinatHobiQuestion {
  number: number;
  statement: string;
  categoryCode: string;
}

export const minatHobiScale = [
  { code: "SETUJU", label: "Setuju", score: 1 },
  { code: "TIDAK_SETUJU", label: "Tidak Setuju", score: 0 },
] as const;

export const minatHobiCategories: MinatHobiCategory[] = [
  {
    code: "outdoor",
    name: "Outdoor (Luar Ruangan)",
    description:
      "Kategori ini menunjukkan ketertarikan pada aktivitas fisik yang dilakukan di alam terbuka, berinteraksi dengan flora dan fauna, serta tidak betah terus-menerus berada di balik meja.",
    activities: [
      "Berkebun atau bercocok tanam",
      "Pecinta alam atau hiking",
      "Pramuka",
      "Memancing",
      "Olahraga alam terbuka",
    ],
  },
  {
    code: "mechanical_practical",
    name: "Mechanical & Practical (Mekanik & Praktis)",
    description:
      "Kategori ini berfokus pada ketertarikan merakit, memperbaiki, memahami cara kerja mesin, dan menciptakan barang fungsional dengan tangan.",
    activities: [
      "Robotika atau elektronika dasar",
      "Pertukangan kayu",
      "Otak-atik otomotif",
      "Membuat diorama atau miniatur",
      "Kriya atau crafting",
    ],
  },
  {
    code: "computational_clerical",
    name: "Computational & Clerical (Angka & Keteraturan)",
    description:
      "Kategori ini mencerminkan minat pada hal-hal yang terstruktur, pendataan, kalkulasi matematis, keteraturan, dan administrasi yang rapi.",
    activities: [
      "Bullet journaling",
      "Board games strategi atau catur",
      "Pemrograman dasar",
      "Koleksi dan klasifikasi",
      "Mengelola keuangan kepanitiaan",
    ],
  },
  {
    code: "scientific",
    name: "Scientific (Sains & Ilmiah)",
    description:
      "Kategori ini didorong oleh rasa ingin tahu terhadap fenomena alam, eksperimen, observasi biologis, dan pencarian fakta melalui bacaan atau dokumenter ilmiah.",
    activities: [
      "Eksperimen sains mandiri",
      "Astronomi amatir",
      "Aquascape atau terrarium",
      "Koleksi spesimen alam",
      "Membaca ensiklopedia dan jurnal sains",
    ],
  },
  {
    code: "persuasive",
    name: "Persuasive (Komunikasi & Kepemimpinan)",
    description:
      "Kategori ini berpusat pada minat memengaruhi orang lain, tampil di depan publik, berdebat, bernegosiasi, dan memimpin sebuah tim.",
    activities: [
      "Debat atau public speaking",
      "Berwirausaha",
      "Membuat konten opini",
      "Event organizing",
      "Diplomasi siswa melalui organisasi",
    ],
  },
  {
    code: "aesthetic",
    name: "Aesthetic (Seni Rupa & Visual)",
    description:
      "Kategori ini mewakili ketertarikan tinggi pada estetika, komposisi warna, penciptaan karya visual, dan apresiasi terhadap keindahan.",
    activities: [
      "Menggambar dan melukis",
      "Fotografi atau videografi",
      "Desain grafis",
      "Fashion dan make-up styling",
      "Dekorasi dan tata ruang",
    ],
  },
  {
    code: "literary",
    name: "Literary (Sastra & Literasi)",
    description:
      "Kategori ini menunjukkan minat yang mendalam pada dunia teks, penceritaan, perbendaharaan kata, bahasa, dan sastra.",
    activities: [
      "Menulis cerita fiksi",
      "Membaca buku dan membuat ulasan",
      "Menulis puisi atau jurnal reflektif",
      "Jurnalistik sekolah",
      "Mempelajari bahasa asing",
    ],
  },
  {
    code: "musical",
    name: "Musical (Musik & Nada)",
    description:
      "Kategori ini digerakkan oleh kepekaan terhadap nada, ritme, harmoni, serta penciptaan atau penikmatan karya seni audio.",
    activities: [
      "Memainkan alat musik",
      "Bernyanyi atau paduan suara",
      "Mengaransemen musik digital",
      "Apresiasi dan koleksi musik",
      "Menciptakan lagu",
    ],
  },
  {
    code: "social_service",
    name: "Social Service (Pelayanan Sosial)",
    description:
      "Kategori ini sangat berorientasi pada manusia. Peserta didik dengan minat ini biasanya bahagia saat membantu, mengedukasi, atau meringankan beban orang lain.",
    activities: [
      "Relawan kemanusiaan",
      "Konselor teman sebaya",
      "Mengajar atau mentoring",
      "Kunjungan panti asuhan atau jompo",
      "Aktivis lingkungan atau sosial",
    ],
  },
  {
    code: "medical",
    name: "Medical (Medis & Kesehatan)",
    description:
      "Kategori ini difokuskan pada anatomi tubuh manusia, perawatan medis dasar, gaya hidup sehat, dan penanganan cedera.",
    activities: [
      "Palang Merah Remaja",
      "Mempelajari anatomi dan kesehatan dasar",
      "Meracik apotek hidup atau herbal",
      "Kebugaran dan olahraga fisik",
      "Manajemen gizi",
    ],
  },
];

export const minatHobiQuestions: MinatHobiQuestion[] = [
  { number: 1, statement: "Menanam dan merawat tanaman di kebun atau halaman sekolah.", categoryCode: "outdoor" },
  { number: 2, statement: "Membongkar dan merakit kembali mainan atau alat elektronik.", categoryCode: "mechanical_practical" },
  { number: 3, statement: "Menghitung pemasukan dan pengeluaran uang kas kelas/pribadi.", categoryCode: "computational_clerical" },
  { number: 4, statement: "Melakukan percobaan ilmu pengetahuan (sains) di laboratorium/kelas.", categoryCode: "scientific" },
  { number: 5, statement: "Menjadi ketua kelas, ketua kelompok, atau pemimpin diskusi.", categoryCode: "persuasive" },
  { number: 6, statement: "Menggambar, melukis, atau membuat sketsa pemandangan/tokoh.", categoryCode: "aesthetic" },
  { number: 7, statement: "Membaca novel, cerpen, atau buku cerita fiksi sejarah.", categoryCode: "literary" },
  { number: 8, statement: "Memainkan alat musik (gitar, piano, pianika, drum, dll).", categoryCode: "musical" },
  { number: 9, statement: "Mengajari teman yang kesulitan memahami pelajaran di kelas.", categoryCode: "social_service" },
  { number: 10, statement: "Merawat teman atau anggota keluarga yang sedang sakit.", categoryCode: "medical" },
  { number: 11, statement: "Mengikuti kegiatan berkemah (pramuka) dan menjelajah alam.", categoryCode: "outdoor" },
  { number: 12, statement: "Menggunakan palu, obeng, atau alat pertukangan lainnya.", categoryCode: "mechanical_practical" },
  { number: 13, statement: "Mengerjakan soal matematika atau teka-teki logika angka.", categoryCode: "computational_clerical" },
  { number: 14, statement: "Membaca buku atau menonton video tentang luar angkasa dan planet.", categoryCode: "scientific" },
  { number: 15, statement: "Berbicara di depan umum atau melakukan presentasi kelas.", categoryCode: "persuasive" },
  { number: 16, statement: "Mendesain poster, presentasi, atau tampilan majalah dinding.", categoryCode: "aesthetic" },
  { number: 17, statement: "Menulis puisi, cerita pendek, atau catatan harian (blog).", categoryCode: "literary" },
  { number: 18, statement: "Bernyanyi di dalam paduan suara atau tampil solo di panggung.", categoryCode: "musical" },
  { number: 19, statement: "Membantu orang tua, guru, atau tetangga yang sedang kerepotan.", categoryCode: "social_service" },
  { number: 20, statement: "Menyiapkan kotak P3K dan mempelajari cara pertolongan pertama.", categoryCode: "medical" },
  { number: 21, statement: "Memelihara hewan ternak atau hewan peliharaan di rumah.", categoryCode: "outdoor" },
  { number: 22, statement: "Mencari tahu bagaimana cara kerja mesin kendaraan bermotor.", categoryCode: "mechanical_practical" },
  { number: 23, statement: "Menyusun dan merapikan buku-buku atau dokumen ke dalam rak/folder.", categoryCode: "computational_clerical" },
  { number: 24, statement: "Mengamati benda-benda kecil menggunakan mikroskop atau kaca pembesar.", categoryCode: "scientific" },
  { number: 25, statement: "Meyakinkan teman-teman untuk ikut dalam suatu kegiatan atau ide.", categoryCode: "persuasive" },
  { number: 26, statement: "Memilih warna dan dekorasi untuk menata ruang kelas atau kamar tidur.", categoryCode: "aesthetic" },
  { number: 27, statement: "Mempelajari kosa kata bahasa asing dan cara pengucapannya.", categoryCode: "literary" },
  { number: 28, statement: "Mendengarkan berbagai jenis genre musik di waktu luang.", categoryCode: "musical" },
  { number: 29, statement: "Bergabung dalam kegiatan bakti sosial atau relawan bencana.", categoryCode: "social_service" },
  { number: 30, statement: "Mencari tahu fungsi organ tubuh manusia dan cara kerjanya.", categoryCode: "medical" },
  { number: 31, statement: "Melakukan aktivitas fisik atau olahraga di lapangan terbuka.", categoryCode: "outdoor" },
  { number: 32, statement: "Membuat barang kerajinan fungsi pakai dari kayu atau plastik bekas.", categoryCode: "mechanical_practical" },
  { number: 33, statement: "Mencatat jadwal kegiatan atau membuat daftar tugas harian.", categoryCode: "computational_clerical" },
  { number: 34, statement: "Mencari tahu proses terjadinya fenomena alam (hujan, gunung meletus).", categoryCode: "scientific" },
  { number: 35, statement: "Berjualan atau menawarkan barang/jasa makanan kepada orang lain.", categoryCode: "persuasive" },
  { number: 36, statement: "Mengambil foto atau merekam video dengan sudut pandang yang indah.", categoryCode: "aesthetic" },
  { number: 37, statement: "Mengikuti perlombaan pidato, membaca puisi, atau mendongeng.", categoryCode: "literary" },
  { number: 38, statement: "Menciptakan lirik lagu atau mengaransemen nada musik sederhana.", categoryCode: "musical" },
  { number: 39, statement: "Menjadi pendengar yang baik saat teman sedang bercerita/curhat.", categoryCode: "social_service" },
  { number: 40, statement: "Membaca artikel atau menonton video tentang cara menjaga kesehatan.", categoryCode: "medical" },
  { number: 41, statement: "Mengamati jenis-jenis pepohonan dan serangga di hutan/taman.", categoryCode: "outdoor" },
  { number: 42, statement: "Memperbaiki barang-barang rumah tangga yang rusak atau macet.", categoryCode: "mechanical_practical" },
  { number: 43, statement: "Mengumpulkan, menyortir, dan menganalisis data angka dari sebuah survei.", categoryCode: "computational_clerical" },
  { number: 44, statement: "Menciptakan teknologi atau merakit alat baru untuk memecahkan masalah.", categoryCode: "scientific" },
  { number: 45, statement: "Menjadi perwakilan kelompok untuk berdebat atau bernegosiasi.", categoryCode: "persuasive" },
  { number: 46, statement: "Membuat karya seni bentuk 3 dimensi dari tanah liat, kertas, atau bahan lain.", categoryCode: "aesthetic" },
  { number: 47, statement: "Mencari tahu arti kata-kata baru atau istilah sulit di dalam kamus.", categoryCode: "literary" },
  { number: 48, statement: "Mengikuti ritme musik dengan gerakan tari atau ketukan jari.", categoryCode: "musical" },
  { number: 49, statement: "Mengumpulkan dana atau pakaian untuk disumbangkan kepada panti asuhan.", categoryCode: "social_service" },
  { number: 50, statement: "Memeriksa suhu tubuh atau memantau kondisi fisik tubuh secara rutin.", categoryCode: "medical" },
  { number: 51, statement: "Memancing ikan di danau, sungai, atau ikut kegiatan menjaring ikan.", categoryCode: "outdoor" },
  { number: 52, statement: "Mengganti ban sepeda yang bocor atau memperbaiki rantai sepeda yang lepas.", categoryCode: "mechanical_practical" },
  { number: 53, statement: "Menyusun jadwal pelajaran, kalender kegiatan, atau timeline tugas di buku catatan.", categoryCode: "computational_clerical" },
  { number: 54, statement: "Membaca ensiklopedia atau menonton dokumenter tentang kehidupan dinosaurus dan prasejarah.", categoryCode: "scientific" },
  { number: 55, statement: "Menjadi pembawa acara (MC) di acara perpisahan kelas atau pentas seni sekolah.", categoryCode: "persuasive" },
  { number: 56, statement: "Memilih pakaian dengan kombinasi warna dan gaya yang serasi (mix and match).", categoryCode: "aesthetic" },
  { number: 57, statement: "Menulis artikel, laporan liputan, atau opini untuk majalah dinding/buletin sekolah.", categoryCode: "literary" },
  { number: 58, statement: "Mengulik dan menebak chord (kunci nada) sebuah lagu yang baru pertama kali didengar.", categoryCode: "musical" },
  { number: 59, statement: "Membantu membawakan tas atau barang bawaan guru/orang yang lebih tua secara sukarela.", categoryCode: "social_service" },
  { number: 60, statement: "Menonton film dokumenter atau acara TV tentang cara kerja dokter bedah di ruang operasi.", categoryCode: "medical" },
];

export const MINAT_HOBI_QUESTIONS_PER_PAGE = 12;
export const MINAT_HOBI_ASSESSMENT_NAME = "Asesmen Minat Hobi (RMIB)";
export const MINAT_HOBI_SUMMARY_TEXT =
  "Asesmen ini memetakan 10 area minat dan hobi dari 60 aktivitas sehari-hari berbasis adaptasi RMIB.";
export const MINAT_HOBI_ANSWER_INSTRUCTION =
  "Setiap pernyataan memiliki dua pilihan jawaban: Setuju atau Tidak Setuju.";
export const MINAT_HOBI_ESTIMATED_DURATION = "8-12 menit";

export function getMinatHobiCategory(code: string) {
  return minatHobiCategories.find((category) => category.code === code);
}
