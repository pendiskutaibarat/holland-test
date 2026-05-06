import { Career, PersonalityType } from "./types";

export const careers: Record<PersonalityType, Career[]> = {
  realistic: [
    {
      name: "Insinyur Sipil (BUMN/Swasta)",
      desc: "Mengawasi proyek pembangunan infrastruktur fisik seperti jalan tol, jembatan, dan gedung.",
      majorRecommendation: "Teknik Sipil",
    },
    {
      name: "Ahli K3 (Kesehatan & Keselamatan Kerja)",
      desc: "Memastikan standar keselamatan pekerja di pabrik, lokasi tambang, atau proyek konstruksi.",
      majorRecommendation: "Kesehatan Masyarakat (K3) / Teknik Keselamatan",
    },
    {
      name: "Teknisi Mesin / Manufaktur",
      desc: "Merawat dan memperbaiki mesin-mesin industri atau kendaraan bermotor.",
      majorRecommendation: "Teknik Mesin / Otomotif",
    },
    {
      name: "Ahli Pertambangan / Perminyakan",
      desc: "Merencanakan dan mengelola ekstraksi sumber daya alam di area tambang/kilang.",
      majorRecommendation: "Teknik Pertambangan / Teknik Perminyakan",
    },
    {
      name: "Polisi / Prajurit TNI",
      desc: "Menjaga keamanan, ketertiban masyarakat, dan pertahanan negara.",
      majorRecommendation: "Akpol / Akmil / Kriminologi",
    },
    {
      name: "Penyuluh Pertanian / Agribisnis",
      desc: "Mengedukasi petani terkait teknologi tanam modern dan manajemen hasil panen.",
      majorRecommendation: "Agroteknologi / Agribisnis",
    },
    {
      name: "Nakhoda / Pelaut",
      desc: "Mengoperasikan kapal untuk keperluan logistik maritim antar pulau atau internasional.",
      majorRecommendation: "Pelayaran / Ketatalaksanaan Pelayaran Niaga",
    },
    {
      name: "Pengusaha Kuliner / Chef",
      desc: "Mengelola dapur profesional, merancang resep, dan membangun bisnis F&B.",
      majorRecommendation: "Tata Boga / Manajemen Kuliner",
    },
    {
      name: "Operator Alat Berat",
      desc: "Mengoperasikan ekskavator, crane, atau alat berat lainnya di lokasi konstruksi/tambang.",
      majorRecommendation: "Teknik Alat Berat (Vokasi)",
    },
    {
      name: "Surveyor Pemetaan (BPN/Swasta)",
      desc: "Melakukan pengukuran lahan untuk pembuatan sertifikat tanah atau peta tata ruang.",
      majorRecommendation: "Teknik Geomatika / Geodesi",
    },
  ],
  investigative: [
    {
      name: "Dokter (Umum/Spesialis)",
      desc: "Mendiagnosis dan memberikan penanganan medis kepada pasien di RS/Puskesmas.",
      majorRecommendation: "Pendidikan Dokter / Kedokteran",
    },
    {
      name: "Programmer / Software Engineer",
      desc: "Menulis kode untuk membangun aplikasi, website, atau sistem informasi instansi/perusahaan.",
      majorRecommendation: "Teknik Informatika / Ilmu Komputer",
    },
    {
      name: "Data Analyst / Data Scientist",
      desc: "Mengolah data besar untuk memberikan insight bisnis atau kebijakan pemerintah.",
      majorRecommendation: "Sains Data / Statistika",
    },
    {
      name: "Dosen / Peneliti (BRIN/Kampus)",
      desc: "Melakukan riset akademik mendalam dan mengajar mahasiswa di perguruan tinggi.",
      majorRecommendation: "Berbagai Ilmu Murni/Terapan (Minimal S2)",
    },
    {
      name: "Apoteker",
      desc: "Meracik, mengembangkan, dan memantau distribusi obat di apotek atau rumah sakit.",
      majorRecommendation: "Farmasi (dan Profesi Apoteker)",
    },
    {
      name: "Analis Laboratorium Medis",
      desc: "Memeriksa sampel darah atau jaringan tubuh di laboratorium untuk diagnosis medis.",
      majorRecommendation: "Teknologi Laboratorium Medik (TLM)",
    },
    {
      name: "Prakirawan Cuaca (Forecaster BMKG)",
      desc: "Menganalisis data satelit untuk memprediksi cuaca dan peringatan dini bencana.",
      majorRecommendation: "Meteorologi / Geofisika",
    },
    {
      name: "Ahli Gizi (Nutrisionis)",
      desc: "Merancang program diet sehat untuk pasien rumah sakit atau edukasi gizi masyarakat.",
      majorRecommendation: "Ilmu Gizi",
    },
    {
      name: "Psikolog Klinis",
      desc: "Memberikan terapi untuk masalah kesehatan mental dan gangguan psikologis.",
      majorRecommendation: "Psikologi (dan Profesi Psikolog)",
    },
    {
      name: "Auditor Forensik / Investigasi",
      desc: "Menyelidiki aliran dana untuk mengungkap kasus kecurangan finansial (fraud).",
      majorRecommendation: "Akuntansi / Kriminologi",
    },
  ],
  artistic: [
    {
      name: "Desainer Grafis / UI-UX Designer",
      desc: "Membuat antarmuka aplikasi atau aset visual promosi yang estetis dan fungsional.",
      majorRecommendation: "Desain Komunikasi Visual (DKV)",
    },
    {
      name: "Content Creator / Video Editor",
      desc: "Memproduksi konten digital kreatif untuk YouTube, TikTok, atau kampanye merek.",
      majorRecommendation: "Ilmu Komunikasi / Film dan Televisi",
    },
    {
      name: "Arsitek",
      desc: "Merancang bentuk fisik rumah, gedung perkantoran, atau fasilitas publik.",
      majorRecommendation: "Arsitektur",
    },
    {
      name: "Desainer Interior",
      desc: "Menata ruang dalam agar nyaman, estetis, dan sesuai dengan kebutuhan klien.",
      majorRecommendation: "Desain Interior",
    },
    {
      name: "Copywriter / Penulis Naskah",
      desc: "Menulis teks iklan yang persuasif atau skenario untuk film dan serial televisi.",
      majorRecommendation: "Sastra Indonesia / Jurnalistik",
    },
    {
      name: "Fashion Designer",
      desc: "Merancang pakaian, hijab, atau aksesoris, khususnya di industri modest fashion lokal.",
      majorRecommendation: "Tata Busana / Desain Mode",
    },
    {
      name: "Make-Up Artist (MUA) Profesional",
      desc: "Menata rias untuk kebutuhan pernikahan, pemotretan komersial, atau syuting film.",
      majorRecommendation: "Tata Rias dan Kecantikan (Vokasi)",
    },
    {
      name: "Fotografer / Videografer",
      desc: "Mendokumentasikan momen pernikahan (wedding), produk komersial, atau jurnalistik.",
      majorRecommendation: "Fotografi / Seni Rupa",
    },
    {
      name: "Musisi / Arranger",
      desc: "Menciptakan, mengaransemen, atau menampilkan karya musik di industri hiburan.",
      majorRecommendation: "Seni Musik",
    },
    {
      name: "Animator 2D/3D",
      desc: "Membuat gambar bergerak untuk serial animasi televisi, iklan, atau game.",
      majorRecommendation: "Animasi / DKV",
    },
  ],
  social: [
    {
      name: "Guru / Pendidik",
      desc: "Merencanakan dan melaksanakan pembelajaran di sekolah dasar maupun menengah.",
      majorRecommendation: "PGSD / Pendidikan Mata Pelajaran",
    },
    {
      name: "Pengembang Teknologi Pembelajaran (PTP)",
      desc: "Mendesain media digital dan mengintegrasikan model pembelajaran inovatif di instansi/sekolah.",
      majorRecommendation: "Teknologi Pendidikan / Ilmu Komputer",
    },
    {
      name: "Perawat",
      desc: "Memberikan asuhan keperawatan dan mendampingi proses pemulihan pasien di faskes.",
      majorRecommendation: "Keperawatan",
    },
    {
      name: "Bidan",
      desc: "Membantu proses persalinan, pemeriksaan kehamilan, dan kesehatan ibu & anak (KIA).",
      majorRecommendation: "Kebidanan",
    },
    {
      name: "Konselor Sekolah (Guru BK)",
      desc: "Membantu peserta didik mengatasi masalah akademik dan merencanakan karir lanjutan.",
      majorRecommendation: "Bimbingan dan Konseling (BK)",
    },
    {
      name: "Penyuluh Agama / Sosial",
      desc: "Memberikan bimbingan keagamaan, sosial, dan moral kepada masyarakat.",
      majorRecommendation: "Ilmu Agama / Komunikasi Penyiaran Islam",
    },
    {
      name: "HRD / Personalia",
      desc: "Mengelola rekrutmen karyawan, kesejahteraan, dan pengembangan SDM perusahaan.",
      majorRecommendation: "Psikologi / Manajemen SDM",
    },
    {
      name: "Pekerja Sosial / Pendamping Desa",
      desc: "Membantu masyarakat desa merencanakan program pemberdayaan ekonomi dan sosial.",
      majorRecommendation: "Ilmu Kesejahteraan Sosial / Sosiologi",
    },
    {
      name: "Humas (Public Relations)",
      desc: "Menjadi jembatan komunikasi antara instansi pemerintah/perusahaan dengan masyarakat.",
      majorRecommendation: "Ilmu Komunikasi (Humas)",
    },
    {
      name: "Pemandu Wisata (Tour Guide)",
      desc: "Memandu wisatawan domestik dan mancanegara di berbagai destinasi wisata lokal.",
      majorRecommendation: "Pariwisata / Usaha Perjalanan Wisata",
    },
  ],
  enterprising: [
    {
      name: "Pengusaha / Wirausaha",
      desc: "Merintis dan membangun bisnis sendiri, mulai dari startup hingga ritel.",
      majorRecommendation: "Kewirausahaan / Bisnis Digital",
    },
    {
      name: "Digital Marketer",
      desc: "Merancang strategi iklan di media sosial dan mesin pencari untuk meningkatkan penjualan.",
      majorRecommendation: "Ilmu Komunikasi / Manajemen Pemasaran",
    },
    {
      name: "Pegawai Bank (Frontliner/Marketing)",
      desc: "Melayani nasabah perbankan dan menawarkan produk keuangan (KPR, Kredit Usaha).",
      majorRecommendation: "Perbankan / Keuangan",
    },
    {
      name: "Pengacara / Konsultan Hukum",
      desc: "Mewakili klien di pengadilan dan memberikan nasihat hukum korporat/pribadi.",
      majorRecommendation: "Ilmu Hukum",
    },
    {
      name: "Diplomat (Kemenlu)",
      desc: "Mewakili kepentingan negara Indonesia di forum internasional atau kedutaan besar.",
      majorRecommendation: "Hubungan Internasional",
    },
    {
      name: "Sales Supervisor / Area Manager",
      desc: "Memimpin tim penjualan lapangan untuk mencapai target distribusi produk perusahaan.",
      majorRecommendation: "Manajemen Bisnis",
    },
    {
      name: "Agen Properti",
      desc: "Membantu klien melakukan transaksi jual-beli atau sewa rumah, tanah, dan apartemen.",
      majorRecommendation: "Manajemen (Umum)",
    },
    {
      name: "Event Organizer (EO)",
      desc: "Mengelola perencanaan dan eksekusi acara berskala besar seperti konser atau pameran.",
      majorRecommendation: "Ilmu Komunikasi / Pariwisata",
    },
    {
      name: "Konsultan Pajak",
      desc: "Membantu individu atau perusahaan menghitung dan melaporkan kewajiban pajaknya.",
      majorRecommendation: "Perpajakan / Administrasi Fiskal",
    },
    {
      name: "Politisi / Anggota Legislatif",
      desc: "Menyusun undang-undang dan mewakili aspirasi masyarakat di DPR/DPRD.",
      majorRecommendation: "Ilmu Politik / Ilmu Pemerintahan",
    },
  ],
  conventional: [
    {
      name: "PNS Administrasi / Analis Kebijakan",
      desc: "Menjalankan roda administrasi dan menganalisis kebijakan di kementerian/pemerintah daerah.",
      majorRecommendation: "Administrasi Negara / Kebijakan Publik",
    },
    {
      name: "Akuntan / APK APBN",
      desc: "Menyusun pembukuan harian dan laporan keuangan tahunan untuk perusahaan/instansi.",
      majorRecommendation: "Akuntansi",
    },
    {
      name: "Staf Administrasi Perkantoran",
      desc: "Mengurus persuratan, jadwal pimpinan, rapat, dan arsip dokumen kantor.",
      majorRecommendation: "Administrasi Perkantoran",
    },
    {
      name: "Analis Anggaran (Pemerintah/Swasta)",
      desc: "Menyusun, memantau, dan mengevaluasi rencana pengeluaran dana instansi.",
      majorRecommendation: "Ilmu Ekonomi / Keuangan Publik",
    },
    {
      name: "Staf Rekam Medis",
      desc: "Mengklasifikasikan dan menjaga kerahasiaan data riwayat penyakit pasien di rumah sakit.",
      majorRecommendation: "Manajemen Informasi Kesehatan",
    },
    {
      name: "Admin Logistik / Ekspedisi",
      desc: "Mengatur kelancaran arus pengiriman barang dan inventaris di gudang (warehouse).",
      majorRecommendation: "Manajemen Logistik / Teknik Industri",
    },
    {
      name: "Auditor Internal",
      desc: "Memeriksa kesesuaian operasional perusahaan dengan Standar Operasional Prosedur (SOP).",
      majorRecommendation: "Akuntansi / Audit",
    },
    {
      name: "Aktuaris",
      desc: "Mengkalkulasi risiko finansial menggunakan ilmu matematika untuk perusahaan asuransi.",
      majorRecommendation: "Ilmu Aktuaria / Matematika",
    },
    {
      name: "Pustakawan / Arsiparis",
      desc: "Mengelola sistem katalog buku di perpustakaan atau arsip dokumen penting negara.",
      majorRecommendation: "Ilmu Perpustakaan dan Informasi",
    },
    {
      name: "Data Entry / Operator Komputer",
      desc: "Menginput, memverifikasi, dan merapikan data secara cepat ke dalam sistem basis data.",
      majorRecommendation: "Manajemen Informatika / Sistem Informasi",
    },
  ],
};
