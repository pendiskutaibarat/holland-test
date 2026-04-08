import { Career, PersonalityType } from "./types";

export const careers: Record<PersonalityType, Career[]> = {
  realistic: [
    {
      name: "Teknisi Listrik",
      desc: "Merawat dan memperbaiki instalasi listrik pada bangunan atau mesin",
    },
    {
      name: "Mekanik Otomotif",
      desc: "Mendiagnosis dan memperbaiki kendaraan bermotor",
    },
    {
      name: "Operator Mesin Industri",
      desc: "Mengoperasikan dan merawat mesin di pabrik manufaktur",
    },
    {
      name: "Surveyor Tanah",
      desc: "Mengukur dan memetakan area lahan untuk keperluan pembangunan",
    },
    {
      name: "Pekerja Konstruksi",
      desc: "Membangun, memperbaiki, dan merawat struktur bangunan",
    },
    {
      name: "Tukang Las (Welder)",
      desc: "Menyambung logam menggunakan peralatan pengelasan",
    },
    {
      name: "Sopir Truk/Bis",
      desc: "Mengemudikan kendaraan berat untuk pengangkutan barang atau penumpang",
    },
    {
      name: "Teknisi AC dan Pendingin",
      desc: "Memasang dan memperbaiki sistem pendingin ruangan",
    },
    {
      name: "Petugas Pemadam Kebakaran",
      desc: "Menangani kebakaran dan penyelamatan darurat",
    },
    {
      name: "Montir Sepeda Motor",
      desc: "Memperbaiki dan melakukan servis sepeda motor",
    },
    {
      name: "Petugas Keamanan (Satpam)",
      desc: "Menjaga keamanan lingkungan atau properti tertentu",
    },
    {
      name: "Petani / Pekebun",
      desc: "Bekerja mengelola lahan pertanian atau kebun",
    },
    { name: "Nelayan", desc: "Menangkap ikan dan hasil laut lainnya" },
    {
      name: "Pemelihara Taman (Tukang Kebun)",
      desc: "Merawat taman dan ruang hijau",
    },
    { name: "Peternak", desc: "Merawat hewan ternak untuk produksi pangan" },
    {
      name: "Teknisi Otomasi / Robotik",
      desc: "Menangani perakitan dan pemeliharaan sistem otomatisasi",
    },
    {
      name: "Pilot Pesawat",
      desc: "Mengoperasikan pesawat komersial atau khusus",
    },
    {
      name: "Teknisi Telekomunikasi",
      desc: "Memasang dan merawat sistem jaringan dan komunikasi",
    },
    { name: "Montir Kapal", desc: "Memperbaiki dan merawat mesin kapal laut" },
    {
      name: "Petugas Lapangan Tambang",
      desc: "Bekerja di lokasi pertambangan untuk ekstraksi sumber daya alam",
    },
    {
      name: "Pekerja Pemrosesan Makanan",
      desc: "Mengoperasikan peralatan di pabrik makanan",
    },
    {
      name: "Teknisi Mesin",
      desc: "Mengerjakan instalasi, perawatan, dan perbaikan mesin",
    },
    {
      name: "Petugas Kebersihan Gedung",
      desc: "Menjaga kebersihan fasilitas umum dan kantor",
    },
    {
      name: "Teknisi Jaringan Komputer",
      desc: "Menangani instalasi dan pemeliharaan jaringan komputer",
    },
    {
      name: "Pemandu Wisata Alam / Ranger",
      desc: "Mengarahkan wisatawan di lokasi alam dan konservasi",
    },
  ],
  investigative: [
    {
      name: "Peneliti / Researcher",
      desc: "Melakukan studi ilmiah untuk menemukan atau mengembangkan pengetahuan baru",
    },
    {
      name: "Dosen / Akademisi",
      desc: "Mengajar dan melakukan penelitian di perguruan tinggi",
    },
    {
      name: "Analis Data (Data Analyst)",
      desc: "Mengumpulkan dan menganalisis data untuk mendukung pengambilan keputusan",
    },
    {
      name: "Statistikawan",
      desc: "Menggunakan metode statistik untuk analisis data kuantitatif",
    },
    {
      name: "Dokter Spesialis",
      desc: "Mendiagnosis dan mengobati penyakit dengan pendekatan berbasis ilmu kedokteran mendalam",
    },
    {
      name: "Psikolog",
      desc: "Menganalisis perilaku dan proses mental manusia untuk membantu penyembuhan atau pengembangan diri",
    },
    {
      name: "Ahli Bioteknologi",
      desc: "Mengembangkan teknologi berbasis ilmu biologi dan kimia untuk keperluan industri dan kesehatan",
    },
    {
      name: "Ilmuwan Komputer (Computer Scientist)",
      desc: "Meneliti dan mengembangkan teknologi, algoritma, dan sistem komputasi",
    },
    {
      name: "Ahli Forensik",
      desc: "Menganalisis bukti ilmiah dalam kasus hukum",
    },
    {
      name: "Aktuaris",
      desc: "Menggunakan statistik untuk menghitung risiko dan premi asuransi",
    },
    {
      name: "Geolog",
      desc: "Meneliti struktur dan proses bumi, termasuk potensi sumber daya alam",
    },
    {
      name: "Ahli Gizi (Nutrisionis)",
      desc: "Menganalisis kebutuhan gizi dan merancang pola makan berdasarkan sains",
    },
    {
      name: "Peneliti Sosial",
      desc: "Mengkaji fenomena sosial menggunakan metode ilmiah",
    },
    {
      name: "Ahli Ekonomi",
      desc: "Menganalisis tren ekonomi dan memberi saran kebijakan atau strategi keuangan",
    },
    {
      name: "Ahli Mikrobiologi",
      desc: "Meneliti mikroorganisme dan dampaknya bagi lingkungan atau kesehatan",
    },
    {
      name: "Analis Riset Pasar (Market Research Analyst)",
      desc: "Mengkaji data konsumen dan pasar untuk menentukan strategi bisnis",
    },
    {
      name: "Ahli Astronomi",
      desc: "Meneliti fenomena luar angkasa dan benda langit",
    },
    {
      name: "Analis Kecerdasan Buatan (AI Analyst)",
      desc: "Mengembangkan dan mengevaluasi sistem berbasis AI dan machine learning",
    },
    {
      name: "Arkeolog",
      desc: "Meneliti peninggalan masa lalu untuk memahami budaya kuno",
    },
    {
      name: "Ahli Lingkungan",
      desc: "Menganalisis dampak lingkungan dan mencari solusi berbasis ilmiah",
    },
    {
      name: "Peneliti Pendidikan",
      desc: "Meneliti proses dan kebijakan pendidikan untuk meningkatkan mutu belajar",
    },
    {
      name: "Programmer Sistem",
      desc: "Membuat dan menguji sistem perangkat lunak yang kompleks",
    },
    {
      name: "Ahli Matematika",
      desc: "Menyelesaikan masalah melalui pendekatan matematis dan logis",
    },
    {
      name: "Pakar Kriptografi",
      desc: "Mengembangkan sistem enkripsi dan keamanan data digital",
    },
    {
      name: "Bioinformatikawan",
      desc: "Menggabungkan ilmu komputer, matematika, dan biologi untuk menganalisis data biologis kompleks",
    },
  ],
  artistic: [
    {
      name: "Desainer Grafis",
      desc: "Membuat desain visual untuk media cetak maupun digital",
    },
    {
      name: "Fotografer",
      desc: "Mengambil dan mengedit gambar untuk keperluan artistik atau komersial",
    },
    {
      name: "Seniman Rupa (Pelukis/Pemahat/Ilustrator)",
      desc: "Mengekspresikan ide melalui karya seni visual",
    },
    {
      name: "Penulis (Fiksi/Nonfiksi)",
      desc: "Menulis cerita, artikel, naskah, atau konten lainnya",
    },
    {
      name: "Desainer Interior",
      desc: "Merancang tata ruang dalam rumah atau gedung agar estetis dan fungsional",
    },
    {
      name: "Musisi / Penyanyi",
      desc: "Menciptakan, membawakan, atau merekam karya musik",
    },
    {
      name: "Aktor / Aktris",
      desc: "Memerankan karakter dalam film, sinetron, teater, atau iklan",
    },
    {
      name: "Editor Video",
      desc: "Mengolah dan menyusun video untuk film, iklan, konten YouTube, dll",
    },
    {
      name: "Animator",
      desc: "Membuat animasi 2D/3D untuk film, iklan, atau video edukatif",
    },
    {
      name: "Desainer Mode (Fashion Designer)",
      desc: "Merancang pakaian dan aksesoris sesuai tren dan estetika",
    },
    {
      name: "Makeup Artist",
      desc: "Menata rias wajah untuk keperluan seni, film, pernikahan, dll",
    },
    {
      name: "Desainer UI/UX",
      desc: "Merancang antarmuka dan pengalaman pengguna untuk aplikasi dan website",
    },
    {
      name: "Content Creator / Influencer",
      desc: "Membuat konten kreatif di media sosial atau platform digital",
    },
    {
      name: "Sutradara",
      desc: "Mengarahkan produksi film, video musik, atau teater",
    },
    {
      name: "Penulis Skenario (Scriptwriter)",
      desc: "Menulis naskah untuk film, sinetron, atau iklan",
    },
    {
      name: "Koreografer / Penari",
      desc: "Menciptakan gerakan tari dan tampil dalam pertunjukan",
    },
    {
      name: "Penyiar Radio / Podcaster",
      desc: "Membuat dan menyampaikan konten audio dengan gaya ekspresif",
    },
    {
      name: "Arsitek",
      desc: "Merancang bangunan dengan pendekatan artistik dan fungsional",
    },
    {
      name: "Desainer Produk",
      desc: "Merancang produk fungsional yang juga menarik secara visual",
    },
    {
      name: "Penyunting Buku (Book Editor)",
      desc: "Menyunting naskah agar layak terbit secara bahasa dan gaya",
    },
    {
      name: "Pewarta Foto (Photojournalist)",
      desc: "Mengabadikan peristiwa nyata melalui lensa kamera dengan nilai artistik",
    },
    {
      name: "Penata Musik (Composer/Sound Designer)",
      desc: "Membuat musik latar atau efek suara untuk berbagai media",
    },
    {
      name: "Ilustrator Buku Anak / Komik",
      desc: "Membuat gambar naratif untuk cerita anak atau komik",
    },
    {
      name: "Fashion Stylist",
      desc: "Menata gaya busana untuk individu atau pemotretan komersial",
    },
    {
      name: "Kurator Galeri / Pameran Seni",
      desc: "Mengelola dan menyusun karya seni untuk dipamerkan",
    },
  ],
  social: [
    {
      name: "Guru / Pengajar",
      desc: "Mendidik dan membimbing siswa di berbagai jenjang pendidikan",
    },
    {
      name: "Perawat",
      desc: "Merawat pasien dan memberikan dukungan kesehatan secara langsung",
    },
    {
      name: "Psikolog",
      desc: "Membantu individu memahami dan mengatasi masalah emosional atau mental",
    },
    {
      name: "Konselor Pendidikan / Bimbingan",
      desc: "Memberikan arahan akademik, karir, dan personal kepada siswa",
    },
    {
      name: "Pekerja Sosial",
      desc: "Menyediakan layanan dukungan kepada individu atau kelompok yang membutuhkan",
    },
    {
      name: "Dosen / Akademisi",
      desc: "Mengajar dan membimbing mahasiswa, serta melakukan penelitian",
    },
    {
      name: "Dokter Umum",
      desc: "Memberikan pelayanan kesehatan secara langsung kepada pasien",
    },
    {
      name: "HRD (Human Resource Development)",
      desc: "Mengelola dan mengembangkan sumber daya manusia dalam organisasi",
    },
    {
      name: "Trainer / Instruktur",
      desc: "Memberikan pelatihan dan pengembangan keterampilan untuk individu atau kelompok",
    },
    {
      name: "Public Relations Officer",
      desc: "Menjalin komunikasi positif antara organisasi dan publik",
    },
    {
      name: "MC / Pembawa Acara",
      desc: "Menyampaikan acara di depan publik dengan keterampilan komunikasi tinggi",
    },
    {
      name: "Penyuluh Lapangan (Pertanian, Kesehatan, Agama, dll.)",
      desc: "Memberikan edukasi dan pendampingan kepada masyarakat secara langsung",
    },
    {
      name: "Relawan / Pegiat LSM",
      desc: "Terlibat dalam kegiatan sosial dan kemanusiaan",
    },
    {
      name: "Customer Service",
      desc: "Menyediakan bantuan dan solusi kepada pelanggan",
    },
    {
      name: "Psikoterapis / Konselor Keluarga",
      desc: "Membantu individu atau keluarga mengatasi permasalahan pribadi dan relasi",
    },
    {
      name: "Pemandu Wisata (Tour Guide)",
      desc: "Memberikan informasi dan pengalaman menyenangkan bagi wisatawan",
    },
    {
      name: "Career Coach",
      desc: "Membimbing orang lain dalam menentukan arah kariernya",
    },
    {
      name: "Manajer Asrama / Panti Asuhan",
      desc: "Mengelola kegiatan dan kebutuhan penghuni lembaga sosial",
    },
    {
      name: "Pendeta / Rohaniwan / Penyuluh Keagamaan",
      desc: "Memberikan bimbingan spiritual dan dukungan moral",
    },
    {
      name: "Bidan",
      desc: "Membantu ibu hamil, persalinan, dan pasca melahirkan secara langsung",
    },
    {
      name: "Ahli Gizi (Nutrisionis) Klinik",
      desc: "Memberikan konseling gizi dan pola makan kepada pasien",
    },
    {
      name: "Mediator / Negosiator Sosial",
      desc: "Menyelesaikan konflik antarindividu atau kelompok dengan pendekatan sosial",
    },
    {
      name: "Pendidik Anak Usia Dini (PAUD)",
      desc: "Mengajar dan membimbing anak-anak pada masa perkembangan awal",
    },
    {
      name: "Pemandu Acara Radio / Penyiar",
      desc: "Membangun hubungan dengan pendengar melalui siaran yang komunikatif",
    },
    {
      name: "Pegawai Layanan Publik (loket, pelayanan masyarakat, dll.)",
      desc: "Melayani masyarakat secara langsung dalam birokrasi atau instansi",
    },
  ],
  enterprising: [
    {
      name: "Pengusaha / Wirausahawan",
      desc: "Membangun dan mengelola bisnis sendiri di berbagai sektor",
    },
    {
      name: "Marketing Executive",
      desc: "Menyusun dan menjalankan strategi pemasaran untuk meningkatkan penjualan",
    },
    {
      name: "Sales Representative",
      desc: "Menjual produk atau layanan kepada pelanggan secara langsung",
    },
    {
      name: "Manajer Penjualan (Sales Manager)",
      desc: "Memimpin tim penjualan dan mengatur target serta strategi pasar",
    },
    {
      name: "Public Relations Specialist",
      desc: "Mengelola citra dan komunikasi organisasi dengan publik atau media",
    },
    {
      name: "Manajer Proyek (Project Manager)",
      desc: "Memimpin proyek dari perencanaan hingga penyelesaian",
    },
    {
      name: "Politikus / Anggota Legislatif",
      desc: "Mengadvokasi kebijakan dan mewakili kepentingan publik",
    },
    {
      name: "Notaris / PPAT",
      desc: "Memberikan jasa hukum dan transaksi properti dengan kewenangan resmi",
    },
    {
      name: "Kepala Sekolah / Pimpinan Lembaga Pendidikan",
      desc: "Memimpin operasional dan pengembangan institusi pendidikan",
    },
    {
      name: "CEO / Direktur Perusahaan",
      desc: "Mengelola perusahaan secara menyeluruh dan membuat keputusan strategis",
    },
    {
      name: "Manajer SDM (HR Manager)",
      desc: "Mengelola strategi sumber daya manusia dan hubungan antarpegawai",
    },
    {
      name: "Broker Saham / Perencana Investasi",
      desc: "Menjual dan mengelola portofolio investasi bagi klien",
    },
    {
      name: "Manajer Restoran / Kafe",
      desc: "Memimpin dan mengelola operasional bisnis makanan dan minuman",
    },
    {
      name: "Konsultan Bisnis",
      desc: "Memberikan saran strategi bisnis untuk peningkatan performa perusahaan",
    },
    {
      name: "Event Organizer / Manajer Acara",
      desc: "Merancang dan melaksanakan berbagai jenis acara komersial dan sosial",
    },
    {
      name: "Franchisor / Mitra Waralaba",
      desc: "Mengelola dan mengembangkan jaringan bisnis waralaba",
    },
    {
      name: "Manajer Produk (Product Manager)",
      desc: "Mengatur pengembangan dan pemasaran produk tertentu",
    },
    {
      name: "Digital Marketer / Growth Hacker",
      desc: "Meningkatkan jangkauan dan konversi melalui strategi pemasaran digital",
    },
    {
      name: "Penasihat Politik / Campaign Manager",
      desc: "Mengatur strategi kampanye dan citra politik kandidat",
    },
    {
      name: "Duta Merek / Brand Ambassador",
      desc: "Mewakili dan mempromosikan brand secara publik",
    },
    {
      name: "Konsultan Hukum Bisnis",
      desc: "Memberikan nasihat hukum kepada perusahaan dan pebisnis",
    },
    {
      name: "Manajer Hotel / Penginapan",
      desc: "Mengelola kegiatan operasional dan pelayanan di sektor hospitality",
    },
    {
      name: "MC Profesional / Host Komersial",
      desc: "Memandu acara dengan gaya komunikatif dan menarik untuk audiens",
    },
    {
      name: "Kepala Divisi Pemasaran",
      desc: "Mengarahkan seluruh strategi pemasaran dalam perusahaan besar",
    },
    {
      name: "Startup Founder / Co-Founder",
      desc: "Mendirikan dan mengembangkan perusahaan rintisan (startup)",
    },
  ],
  conventional: [
    {
      name: "Staf Administrasi",
      desc: "Mengelola dokumen, arsip, dan kebutuhan administrasi kantor",
    },
    {
      name: "Sekretaris",
      desc: "Membantu atasan dalam urusan administrasi dan komunikasi",
    },
    {
      name: "Teller Bank",
      desc: "Melayani transaksi keuangan nasabah secara akurat dan rapi",
    },
    {
      name: "Akuntan",
      desc: "Menyusun laporan keuangan dan memastikan transaksi sesuai standar",
    },
    {
      name: "Analis Keuangan",
      desc: "Mengevaluasi data keuangan untuk pengambilan keputusan",
    },
    {
      name: "Petugas Pajak / Konsultan Pajak",
      desc: "Mengurus pelaporan dan perhitungan kewajiban pajak individu atau perusahaan",
    },
    {
      name: "Auditor",
      desc: "Memeriksa dan menilai akurasi laporan keuangan suatu institusi",
    },
    {
      name: "Staf Kepegawaian (HR Admin)",
      desc: "Mengelola data dan dokumen kepegawaian serta penggajian",
    },
    {
      name: "Petugas Arsip / Dokumentasi",
      desc: "Menyimpan dan mengatur dokumen penting secara sistematis",
    },
    {
      name: "Administrasi Gudang / Inventory Staff",
      desc: "Mengelola stok barang dan catatan keluar-masuk barang",
    },
    {
      name: "Operator Data Entry",
      desc: "Memasukkan dan memperbarui data ke dalam sistem komputer",
    },
    {
      name: "Kasir",
      desc: "Menangani transaksi pembayaran dengan ketelitian tinggi",
    },
    {
      name: "Analis Data Operasional",
      desc: "Mengevaluasi proses kerja dan kinerja operasional perusahaan",
    },
    {
      name: "Asisten Notaris",
      desc: "Membantu penanganan dokumen legal secara administratif",
    },
    {
      name: "Staff Perpajakan Perusahaan",
      desc: "Bertugas menangani pelaporan dan arsip pajak perusahaan",
    },
    {
      name: "Pustakawan",
      desc: "Mengelola koleksi buku, katalog, dan layanan perpustakaan",
    },
    {
      name: "Analis Kredit Bank",
      desc: "Mengevaluasi kelayakan kredit nasabah berdasarkan data",
    },
    {
      name: "Staff Keuangan Sekolah / Lembaga",
      desc: "Mengatur pembukuan dan laporan keuangan institusi pendidikan",
    },
    {
      name: "Staff Pembelian (Purchasing Officer)",
      desc: "Mengelola pembelian barang dan pencatatan transaksi",
    },
    {
      name: "Staff Penjadwalan Produksi",
      desc: "Menyusun jadwal kerja produksi dan memastikan kesesuaian waktu",
    },
    {
      name: "Petugas Lelang / Arsip Pemerintah",
      desc: "Menangani dokumen resmi dan kegiatan administratif lembaga",
    },
    {
      name: "Pegawai Tata Usaha Sekolah",
      desc: "Menyusun dan mengarsip dokumen serta surat menyurat",
    },
    {
      name: "Staf Logistik",
      desc: "Mencatat, menyusun, dan melaporkan alur distribusi barang",
    },
    {
      name: "Pegawai Administrasi Pemerintahan",
      desc: "Bekerja dalam sistem birokrasi untuk pelayanan publik",
    },
    {
      name: "Admin E-Commerce",
      desc: "Mengelola pesanan, pembukuan, dan log data penjualan online",
    },
  ],
};
