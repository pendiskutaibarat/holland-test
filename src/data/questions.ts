import { PersonalityQuestions } from "./types";

export const questions: PersonalityQuestions[] = [
  {
    type: "realistic",
    label: "Kepribadian 1",
    categories: [
      {
        title: "Saya adalah orang yang:",
        questions: [
          { text: "Berpikir secara realistis" },
          { text: "Mandiri" },
          { text: "Jujur" },
          { text: "Suka olahraga" },
          { text: "Cinta alam, hewan, dan tumbuhan" },
        ],
      },
      {
        title: "Saya bisa:",
        questions: [
          { text: "Memperbaiki peralatan dan mesin listrik" },
          { text: "Membaca gambar dan desain" },
          { text: "Melakukan 1 jenis olahraga" },
          { text: "Mengoperasikan mesin dan peralatan" },
          { text: "Melakukan pekerjaan manual" },
        ],
      },
      {
        title: "Saya suka:",
        questions: [
          { text: "Bekerja di luar ruangan" },
          { text: "Perakitan furniture" },
          { text: "Menanam pohon, berkebun" },
          { text: "Menggunakan tangan dan kaki untuk bekerja" },
          { text: "Membuat kerajinan tangan" },
        ],
      },
    ],
  },
  {
    type: "investigative",
    label: "Kepribadian 2",
    categories: [
      {
        title: "Saya adalah orang yang:",
        questions: [
          { text: "Punya kemampuan analisis yang tinggi" },
          { text: "Punya pengamatan yang baik" },
          { text: "Punya pemikiran logis" },
          { text: "Berhati-hati dalam segala hal, tepat waktu" },
          { text: "Punya wawasan yang luas" },
        ],
      },
      {
        title: "Saya bisa:",
        questions: [
          { text: "Melakukan eksperimen dan penelitian" },
          { text: "Memikirkan dan memahami masalah yang kompleks dan abstrak" },
          {
            text: "Analisis data dan menyelesaikan masalah matematika dengan baik",
          },
          { text: "Berpikir secara koheren" },
          {
            text: "Cepat memahami ilmu pengetahuan, fisika, matematika, dan lain-lain",
          },
        ],
      },
      {
        title: "Saya suka:",
        questions: [
          { text: "Bekerja sendiri" },
          { text: "Kegiatan investigasi, inspeksi, evaluasi, dan sejenisnya" },
          { text: "Bertanya" },
          {
            text: "Mengunjungi laboratorium, museum sains, atau fasilitas ilmiah lainnya",
          },
          {
            text: "Membaca buku, surat kabar, dan dokumen ilmiah atau teknis khusus",
          },
        ],
      },
    ],
  },
  {
    type: "artistic",
    label: "Kepribadian 3",
    categories: [
      {
        title: "Saya adalah orang yang:",
        questions: [
          { text: "Sangat kreatif" },
          { text: "Memiliki Imajinasi yang tinggi" },
          { text: "Sensitif, emosional" },
          { text: "Tidak ragu mengungkapkan pendapat" },
          { text: "Individualis" },
        ],
      },
      {
        title: "Saya bisa:",
        questions: [
          { text: "Bernyanyi/berdansa/berakting dengan baik" },
          { text: "Menggambar atau mengambil foto dengan baik" },
          { text: "Memainkan instrumen musik" },
          {
            text: "Berbicara di depan orang atau presentasi dengan percaya diri",
          },
          {
            text: "Desain dan penataan (fashion/pakaian, desain interior, dst)",
          },
        ],
      },
      {
        title: "Saya suka:",
        questions: [
          { text: "Kebebasan, tidak suka dibatasi" },
          { text: "Membaca cerita dan puisi" },
          { text: "Menggambar, mengambil foto, merekam" },
          { text: "Menonton drama, pameran seni, mendengarkan musik" },
          { text: "Pekerjaan yang membutuhkan kreativitas" },
        ],
      },
    ],
  },
  {
    type: "social",
    label: "Kepribadian 4",
    categories: [
      {
        title: "Saya adalah orang yang:",
        questions: [
          { text: "Ramah, mudah didekati, senang membantu" },
          { text: "Sopan" },
          { text: "Mau mendengar orang lain" },
          { text: "Simpatik" },
          { text: "Ingin berguna bagi masyarakat dan komunitas" },
        ],
      },
      {
        title: "Saya bisa:",
        questions: [
          { text: "Membimbing dan mengajar orang lain" },
          { text: "Menengahi dan menyelesaikan konflik" },
          { text: "Bekerja sama dalam tim dengan baik" },
          { text: "Mengekspresikan emosi dengan jelas dan wajar" },
          { text: "Memantau sebuah project atau kegiatan" },
        ],
      },
      {
        title: "Saya suka:",
        questions: [
          { text: "Membantu orang lain memecahkan masalah" },
          { text: "Bertemu dan bekerja dengan orang banyak" },
          { text: "Berkontribusi dalam sebuah diskusi (ikut beropini)" },
          { text: "Melakukan pekerjaan sukarela" },
          {
            text: "Mendengarkan, membimbing, menasihati, dan menjelaskan sesuatu pada orang lain",
          },
        ],
      },
    ],
  },
  {
    type: "enterprising",
    label: "Kepribadian 5",
    categories: [
      {
        title: "Saya adalah orang yang:",
        questions: [
          { text: "Yakin dengan keputusan sendiri" },
          { text: "Dinamis, antusias" },
          { text: "Ambisius" },
          { text: "Populer di sekolah/Kampus" },
          { text: "Suka berteman dengan orang baru" },
        ],
      },
      {
        title: "Saya bisa:",
        questions: [
          { text: "Meyakinkan orang lain dengan mudah" },
          { text: "Berekspresi dan berargumentasi dengan baik" },
          { text: "Memimpin sebuah kelompok" },
          {
            text: "Menentukan ide baru dan memulai sebuah project atau kegiatan",
          },
          { text: "Menyusun strategi untuk mencapai sebuah tujuan" },
        ],
      },
      {
        title: "Saya suka:",
        questions: [
          {
            text: "Memiliki hak atau kewenangan atas kekuasaan, manajemen, atau evaluasi",
          },
          { text: "Mempengaruhi orang lain dalam mengambil keputusan" },
          { text: "Ketika orang lain menghormati dan mengagumi saya" },
          { text: "Menghadapi risiko dan tantangan" },
          { text: "Berkompetisi dan menjadi lebih baik dari orang lain" },
        ],
      },
    ],
  },
  {
    type: "conventional",
    label: "Kepribadian 6",
    categories: [
      {
        title: "Saya adalah orang yang:",
        questions: [
          { text: "Akurat, dapat diandalkan" },
          { text: "Rapi" },
          { text: "Teliti" },
          { text: "Bekerja sesuai prinsip dan prosedur" },
          { text: "Berpikir secara terorganisasi (runtut)" },
        ],
      },
      {
        title: "Saya bisa:",
        questions: [
          { text: "Memperkirakan pendapatan dan pengeluaran secara akurat" },
          { text: "Menulis laporan dan melakukan perhitungan dengan baik" },
          { text: "Mengurus dokumen dengan cepat" },
          {
            text: "Bekerja di perusahaan atau lembaga yang punya sistem teratur/baku",
          },
          {
            text: "Menyelesaikan dengan baik tugas-tugas yang memerlukan ketelitian tinggi",
          },
        ],
      },
      {
        title: "Saya suka:",
        questions: [
          { text: "Merapikan atau mengatur tempat kerja dan tempat tinggal" },
          { text: "Menetapkan rencana atau tujuan hidup" },
          { text: "Menyusun jadwal dan mengikutinya" },
          { text: "Bekerja dengan angka dan data" },
          {
            text: "Pekerjaan yang berkaitan dengan menyimpan, mengklasifikasikan, atau memperbarui informasi",
          },
        ],
      },
    ],
  },
];
