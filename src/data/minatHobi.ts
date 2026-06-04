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
  { code: "SS", label: "Sangat Suka", score: 4 },
  { code: "S", label: "Suka", score: 3 },
  { code: "KS", label: "Kurang Suka", score: 2 },
  { code: "TS", label: "Tidak Suka", score: 1 },
] as const;

export const minatHobiCategories: MinatHobiCategory[] = [
  {
    code: "outdoor",
    name: "Outdoor",
    description:
      "Minat pada aktivitas fisik di ruang terbuka, alam, tanaman, hewan, dan eksplorasi luar ruangan.",
    activities: ["Berkebun", "Pramuka", "Hiking", "Memancing", "Olahraga luar ruangan"],
  },
  {
    code: "mechanical_practical",
    name: "Mekanik & Praktis",
    description:
      "Minat pada merakit, memperbaiki, memahami mesin, dan membuat benda fungsional dengan tangan.",
    activities: ["Robotik", "Elektronika dasar", "Kerajinan kayu", "Otomotif", "Miniatur"],
  },
  {
    code: "computational_clerical",
    name: "Komputasi & Administrasi",
    description:
      "Minat pada struktur, angka, data, perhitungan, klasifikasi, administrasi, dan catatan rapi.",
    activities: ["Spreadsheet", "Catur", "Coding dasar", "Jurnal agenda", "Bendahara kelas"],
  },
  {
    code: "scientific",
    name: "Ilmiah",
    description:
      "Minat pada fenomena alam, eksperimen, observasi, biologi, astronomi, dan penyelidikan berbasis bukti.",
    activities: ["Eksperimen sains", "Astronomi", "Terrarium", "Dokumenter sains", "Koleksi spesimen"],
  },
  {
    code: "persuasive",
    name: "Persuasif",
    description:
      "Minat pada mempengaruhi orang lain, berbicara di depan umum, negosiasi, debat, dan kepemimpinan.",
    activities: ["Debat", "Public speaking", "Wirausaha", "Organisasi acara", "OSIS"],
  },
  {
    code: "aesthetic",
    name: "Estetika",
    description:
      "Minat pada keindahan visual, warna, komposisi, desain, fotografi, dekorasi, dan seni rupa.",
    activities: ["Menggambar", "Fotografi", "Desain grafis", "Fashion", "Dekorasi"],
  },
  {
    code: "literary",
    name: "Literer",
    description:
      "Minat pada teks, cerita, kosakata, bahasa, menulis, membaca, dan sastra.",
    activities: ["Menulis fiksi", "Resensi buku", "Puisi", "Jurnalistik", "Bahasa asing"],
  },
  {
    code: "musical",
    name: "Musikal",
    description:
      "Minat pada melodi, ritme, harmoni, pertunjukan musik, apresiasi musik, dan kreativitas audio.",
    activities: ["Alat musik", "Paduan suara", "Aransemen digital", "Playlist tematik", "Menulis lagu"],
  },
  {
    code: "social_service",
    name: "Pelayanan Sosial",
    description:
      "Minat pada membantu orang lain, mentoring, relawan, mendengarkan, mengajar, dan meringankan beban orang lain.",
    activities: ["Relawan", "Konseling sebaya", "Tutor", "Bakti sosial", "Kampanye sosial"],
  },
  {
    code: "medical",
    name: "Medis",
    description:
      "Minat pada anatomi manusia, perawatan kesehatan dasar, P3K, nutrisi, kebugaran, dan pencegahan penyakit.",
    activities: ["PMR", "P3K", "Tanaman obat", "Kebugaran", "Perencanaan nutrisi"],
  },
];

const categoryByName: Record<string, string> = {
  Outdoor: "outdoor",
  "Mechanical & Practical": "mechanical_practical",
  "Computational & Clerical": "computational_clerical",
  Scientific: "scientific",
  Persuasive: "persuasive",
  Aesthetic: "aesthetic",
  Literary: "literary",
  Musical: "musical",
  "Social Service": "social_service",
  Medical: "medical",
};

const rawQuestions: Array<[number, string, keyof typeof categoryByName]> = [
  [1, "Menanam dan merawat tanaman di kebun atau halaman sekolah.", "Outdoor"],
  [2, "Membongkar dan merakit kembali mainan atau alat elektronik.", "Mechanical & Practical"],
  [3, "Menghitung pemasukan dan pengeluaran uang kas kelas/pribadi.", "Computational & Clerical"],
  [4, "Melakukan percobaan ilmu pengetahuan di laboratorium atau kelas.", "Scientific"],
  [5, "Menjadi ketua kelas, ketua kelompok, atau pemimpin diskusi.", "Persuasive"],
  [6, "Menggambar, melukis, atau membuat sketsa pemandangan atau tokoh.", "Aesthetic"],
  [7, "Membaca novel, cerpen, atau buku cerita fiksi sejarah.", "Literary"],
  [8, "Memainkan alat musik seperti gitar, piano, pianika, drum, dan lainnya.", "Musical"],
  [9, "Mengajari teman yang kesulitan memahami pelajaran di kelas.", "Social Service"],
  [10, "Merawat teman atau anggota keluarga yang sedang sakit.", "Medical"],
  [11, "Mengikuti kegiatan berkemah atau pramuka dan menjelajah alam.", "Outdoor"],
  [12, "Menggunakan palu, obeng, atau alat pertukangan lainnya.", "Mechanical & Practical"],
  [13, "Mengerjakan soal matematika atau teka-teki logika angka.", "Computational & Clerical"],
  [14, "Membaca buku atau menonton video tentang luar angkasa dan planet.", "Scientific"],
  [15, "Berbicara di depan umum atau melakukan presentasi kelas.", "Persuasive"],
  [16, "Mendesain poster, presentasi, atau tampilan majalah dinding.", "Aesthetic"],
  [17, "Menulis puisi, cerita pendek, atau catatan harian/blog.", "Literary"],
  [18, "Bernyanyi dalam paduan suara atau tampil solo di panggung.", "Musical"],
  [19, "Membantu orang tua, guru, atau tetangga yang sedang kerepotan.", "Social Service"],
  [20, "Menyiapkan kotak P3K dan mempelajari cara pertolongan pertama.", "Medical"],
  [21, "Memelihara hewan ternak atau hewan peliharaan di rumah.", "Outdoor"],
  [22, "Mencari tahu bagaimana cara kerja mesin kendaraan bermotor.", "Mechanical & Practical"],
  [23, "Menyusun dan merapikan buku atau dokumen ke dalam rak/folder.", "Computational & Clerical"],
  [24, "Mengamati benda kecil menggunakan mikroskop atau kaca pembesar.", "Scientific"],
  [25, "Meyakinkan teman-teman untuk ikut dalam suatu kegiatan atau ide.", "Persuasive"],
  [26, "Memilih warna dan dekorasi untuk menata ruang kelas atau kamar tidur.", "Aesthetic"],
  [27, "Mempelajari kosakata bahasa asing dan cara pengucapannya.", "Literary"],
  [28, "Mendengarkan berbagai jenis genre musik di waktu luang.", "Musical"],
  [29, "Bergabung dalam kegiatan bakti sosial atau relawan bencana.", "Social Service"],
  [30, "Mencari tahu fungsi organ tubuh manusia dan cara kerjanya.", "Medical"],
  [31, "Melakukan aktivitas fisik atau olahraga di lapangan terbuka.", "Outdoor"],
  [32, "Membuat barang kerajinan fungsi pakai dari kayu atau plastik bekas.", "Mechanical & Practical"],
  [33, "Mencatat jadwal kegiatan atau membuat daftar tugas harian.", "Computational & Clerical"],
  [34, "Mencari tahu proses terjadinya fenomena alam seperti hujan atau gunung meletus.", "Scientific"],
  [35, "Berjualan atau menawarkan barang, jasa, atau makanan kepada orang lain.", "Persuasive"],
  [36, "Mengambil foto atau merekam video dengan sudut pandang yang indah.", "Aesthetic"],
  [37, "Mengikuti perlombaan pidato, membaca puisi, atau mendongeng.", "Literary"],
  [38, "Menciptakan lirik lagu atau mengaransemen nada musik sederhana.", "Musical"],
  [39, "Menjadi pendengar yang baik saat teman sedang bercerita atau curhat.", "Social Service"],
  [40, "Membaca artikel atau menonton video tentang cara menjaga kesehatan.", "Medical"],
  [41, "Mengamati jenis-jenis pepohonan dan serangga di hutan atau taman.", "Outdoor"],
  [42, "Memperbaiki barang-barang rumah tangga yang rusak atau macet.", "Mechanical & Practical"],
  [43, "Mengumpulkan, menyortir, dan menganalisis data angka dari sebuah survei.", "Computational & Clerical"],
  [44, "Menciptakan teknologi atau merakit alat baru untuk memecahkan masalah.", "Scientific"],
  [45, "Menjadi perwakilan kelompok untuk berdebat atau bernegosiasi.", "Persuasive"],
  [46, "Membuat karya seni bentuk 3 dimensi dari tanah liat, kertas, atau bahan lain.", "Aesthetic"],
  [47, "Mencari tahu arti kata baru atau istilah sulit di dalam kamus.", "Literary"],
  [48, "Mengikuti ritme musik dengan gerakan tari atau ketukan jari.", "Musical"],
  [49, "Mengumpulkan dana atau pakaian untuk disumbangkan kepada panti asuhan.", "Social Service"],
  [50, "Memeriksa suhu tubuh atau memantau kondisi fisik tubuh secara rutin.", "Medical"],
  [51, "Memancing ikan di danau, sungai, atau ikut kegiatan menjaring ikan.", "Outdoor"],
  [52, "Mengganti ban sepeda yang bocor atau memperbaiki rantai sepeda yang lepas.", "Mechanical & Practical"],
  [53, "Menyusun jadwal pelajaran, kalender kegiatan, atau timeline tugas di buku catatan.", "Computational & Clerical"],
  [54, "Membaca ensiklopedia atau menonton dokumenter tentang kehidupan dinosaurus dan prasejarah.", "Scientific"],
  [55, "Menjadi pembawa acara/MC di acara perpisahan kelas atau pentas seni sekolah.", "Persuasive"],
  [56, "Memilih pakaian dengan kombinasi warna dan gaya yang serasi.", "Aesthetic"],
  [57, "Menulis artikel, laporan liputan, atau opini untuk majalah dinding/buletin sekolah.", "Literary"],
  [58, "Mengulik dan menebak chord sebuah lagu yang baru pertama kali didengar.", "Musical"],
  [59, "Membantu membawakan tas atau barang bawaan guru/orang yang lebih tua secara sukarela.", "Social Service"],
  [60, "Menonton film dokumenter atau acara TV tentang cara kerja dokter bedah di ruang operasi.", "Medical"],
  [61, "Mengumpulkan batu-batuan unik, kerang, atau dedaunan kering saat jalan-jalan di alam.", "Outdoor"],
  [62, "Membantu ayah atau kerabat memperbaiki perabotan rumah yang terbuat dari kayu/besi.", "Mechanical & Practical"],
  [63, "Menyortir dan mengelompokkan barang seperti kartu, koin, atau dokumen berdasarkan tahun/jenis.", "Computational & Clerical"],
  [64, "Menggunakan teleskop atau aplikasi peta bintang di HP untuk melihat rasi bintang.", "Scientific"],
  [65, "Mengajak dan meyakinkan teman untuk membeli produk atau makanan hasil buatan kelompok kelas.", "Persuasive"],
  [66, "Menghias kue, menata makanan di piring, atau membuat kerajinan tangan yang cantik.", "Aesthetic"],
  [67, "Mengikuti klub diskusi buku, klub literasi, atau berpartisipasi dalam klub debat.", "Literary"],
  [68, "Menyusun playlist lagu khusus yang disesuaikan dengan suasana hati atau tema acara.", "Musical"],
  [69, "Menghibur teman yang sedang bersedih, menangis, atau kecewa agar kembali ceria.", "Social Service"],
  [70, "Membaca dengan teliti komposisi gizi dan daftar bahan pada kemasan makanan/minuman sebelum membelinya.", "Medical"],
  [71, "Bersepeda keliling pedesaan, area persawahan, atau taman kota yang banyak pepohonan.", "Outdoor"],
  [72, "Membuka casing komputer, radio, atau HP rusak untuk melihat komponen di dalamnya.", "Mechanical & Practical"],
  [73, "Menggunakan Microsoft Excel atau lembar kerja digital untuk memasukkan data dan nilai secara urut.", "Computational & Clerical"],
  [74, "Melakukan percobaan mencampur zat kimia sederhana di rumah, seperti cuka dan soda kue.", "Scientific"],
  [75, "Mengatur strategi dan membagi peran anggota tim agar bisa menang dalam sebuah permainan/lomba.", "Persuasive"],
  [76, "Mengedit foto atau video dengan memberikan filter, transisi, dan efek visual yang kekinian.", "Aesthetic"],
  [77, "Mendengarkan podcast yang berisi penceritaan dongeng, misteri, atau sejarah.", "Literary"],
  [78, "Menonton konser musik, pertunjukan band sekolah, atau orkestra secara langsung.", "Musical"],
  [79, "Menjadi sukarelawan untuk membimbing siswa baru atau adik kelas saat Masa Pengenalan Lingkungan Sekolah.", "Social Service"],
  [80, "Mencari tahu kegunaan obat herbal atau tanaman tradisional seperti jahe/kunyit untuk menyembuhkan penyakit ringan.", "Medical"],
  [81, "Mengikuti kegiatan menanam padi, memanen buah-buahan, atau bekerja di area perkebunan.", "Outdoor"],
  [82, "Merakit model mainan plastik, Lego, atau miniatur kendaraan secara detail langkah demi langkah.", "Mechanical & Practical"],
  [83, "Menghitung dan mencatat skor pertandingan olahraga secara teliti agar tidak ada kecurangan.", "Computational & Clerical"],
  [84, "Mengamati siklus hidup hewan secara langsung, misalnya ulat menjadi kepompong lalu kupu-kupu.", "Scientific"],
  [85, "Mempromosikan kegiatan ekstrakurikuler di depan kelas agar banyak siswa baru tertarik bergabung.", "Persuasive"],
  [86, "Memerhatikan dengan saksama detail arsitektur atau desain unik dari bangunan bersejarah.", "Aesthetic"],
  [87, "Membaca buku biografi atau kisah hidup tokoh-tokoh sukses dunia dan pahlawan nasional.", "Literary"],
  [88, "Berlatih mengatur napas dan teknik vokal untuk persiapan tampil bernyanyi di paduan suara.", "Musical"],
  [89, "Menjenguk dan membawakan bingkisan untuk tetangga atau teman yang sedang dirawat di rumah sakit.", "Social Service"],
  [90, "Menimbang berat badan, mengukur tinggi badan, dan mencatat perubahannya secara rutin.", "Medical"],
  [91, "Mengikuti aktivitas alam yang menantang seperti mendaki gunung, arung jeram, atau outbound.", "Outdoor"],
  [92, "Membantu kegiatan memotong kayu, mengecat tembok rumah/kelas, atau pekerjaan fisik pertukangan lainnya.", "Mechanical & Practical"],
  [93, "Menyalin catatan pelajaran dengan tulisan yang sangat rapi dan diberi kode warna penanda yang berbeda-beda.", "Computational & Clerical"],
  [94, "Mewakili sekolah dalam Olimpiade Sains, kompetisi Matematika, atau lomba Karya Ilmiah Remaja.", "Scientific"],
  [95, "Menjadi pihak tengah/negosiator yang mendamaikan dua teman yang sedang bertengkar atau berselisih paham.", "Persuasive"],
  [96, "Mendesain motif batik, pakaian, atau merancang karakter animasi menggunakan tablet digital/komputer.", "Aesthetic"],
  [97, "Menulis naskah drama atau dialog script pendek yang akan dipentaskan oleh teman-teman di panggung.", "Literary"],
  [98, "Mengumpulkan informasi tentang alat musik tradisional atau belajar langsung memainkan alat musik daerah.", "Musical"],
  [99, "Mengajar membaca, mendampingi, atau bermain bersama anak-anak di panti asuhan/panti jompo.", "Social Service"],
  [100, "Bergabung dan aktif mengikuti pelatihan Palang Merah Remaja atau program Dokter Kecil di sekolah.", "Medical"],
];

export const minatHobiQuestions: MinatHobiQuestion[] = rawQuestions.map(
  ([number, statement, categoryName]) => ({
    number,
    statement,
    categoryCode: categoryByName[categoryName],
  }),
);

export function getMinatHobiCategory(code: string) {
  return minatHobiCategories.find((category) => category.code === code);
}
