import { ProgramStudiCluster } from "./types";

export const programStudiClusters: ProgramStudiCluster[] = [
  {
    code: "SIA",
    clusters: [
      {
        name: "Teknologi Pendidikan & Komunikasi",
        programs: ["Teknologi Pendidikan", "Ilmu Komunikasi", "Desain Komunikasi Visual"],
        professions: ["Instructional Designer", "Konsultan EdTech", "Content Strategist"],
      },
      {
        name: "Psikologi & Kesehatan Mental",
        programs: ["Psikologi", "Kesehatan Masyarakat", "Terapi Wicara"],
        professions: ["Psikolog", "Konselor", "Terapis Seni"],
      },
      {
        name: "Seni Pertunjukan & Manajemen",
        programs: ["Seni Pertunjukan", "Manajemen Seni", "Periklanan"],
        professions: ["Sutradara", "Creative Director", "Event Manager"],
      },
    ],
  },
  {
    code: "SAI",
    clusters: [
      {
        name: "Pendidikan & Pengembangan Anak",
        programs: ["PGPAUD", "Psikologi Pendidikan", "Pendidikan Seni"],
        professions: ["Guru TK", "Konselor Anak", "Drama Terapis"],
      },
      {
        name: "Komunikasi & Jurnalisme",
        programs: ["Jurnalisme", "Hubungan Masyarakat", "Komunikasi Digital"],
        professions: ["Jurnalis", "PR Specialist", "Podcaster"],
      },
      {
        name: "Seni Rupa & Kuratorial",
        programs: ["Seni Rupa", "Kurasi Seni", "Desain Interior"],
        professions: ["Kurator", "Dekorator", "Art Therapist"],
      },
    ],
  },
  {
    code: "ISE",
    clusters: [
      {
        name: "Bisnis Berbasis Data & Riset",
        programs: ["Statistika", "Manajemen Bisnis", "Ilmu Komputer"],
        professions: ["Data Scientist", "Business Analyst", "Startup Founder"],
      },
      {
        name: "Teknik Industri & Manajemen",
        programs: ["Teknik Industri", "Sistem Informasi", "Manajemen Operasi"],
        professions: ["Industrial Engineer", "Operations Manager", "Product Owner"],
      },
      {
        name: "Bioteknologi & Kewirausahaan",
        programs: ["Bioteknologi", "Farmasi", "Manajemen Risiko"],
        professions: ["Biotech Entrepreneur", "R&D Manager", "Patent Analyst"],
      },
    ],
  },
  {
    code: "IRA",
    clusters: [
      {
        name: "Arsitektur & Desain Teknis",
        programs: ["Arsitektur", "Desain Produk", "Teknik Mesin"],
        professions: ["Arsitek", "Product Designer", "CAD Engineer"],
      },
      {
        name: "Game Development & Animasi",
        programs: ["Teknik Informatika", "Desain Komunikasi Visual", "Animasi"],
        professions: ["Game Developer", "Technical Artist", "3D Animator"],
      },
      {
        name: "Teknik Lingkungan & Urban Design",
        programs: ["Teknik Lingkungan", "Perencanaan Kota", "Landscape Architecture"],
        professions: ["Environmental Engineer", "Urban Planner", "Landscape Architect"],
      },
    ],
  },
  {
    code: "ESC",
    clusters: [
      {
        name: "Manajemen Korporasi",
        programs: ["Manajemen", "Akuntansi", "Hukum Bisnis"],
        professions: ["CEO", "CFO", "Corporate Lawyer"],
      },
      {
        name: "Politik & Pemerintahan",
        programs: ["Ilmu Politik", "Administrasi Publik", "Hubungan Internasional"],
        professions: ["Politikus", "Diplomat", "Policy Analyst"],
      },
      {
        name: "Manajemen Acara & Hospitality",
        programs: ["Manajemen Perhotelan", "Event Management", "Manajemen Restoran"],
        professions: ["Hotel Manager", "Event Director", "Restaurant Owner"],
      },
    ],
  },
  {
    code: "ECS",
    clusters: [
      {
        name: "Akuntansi & Keuangan",
        programs: ["Akuntansi", "Perpajakan", "Manajemen Keuangan"],
        professions: ["Akuntan Publik", "Tax Consultant", "Financial Controller"],
      },
      {
        name: "Administrasi & SDM",
        programs: ["Administrasi Bisnis", "Manajemen Sumber Daya Manusia", "Hukum Ketenagakerjaan"],
        professions: ["HR Manager", "Compensation & Benefits Specialist", "Legal Officer"],
      },
      {
        name: "Supply Chain & Operasional",
        programs: ["Manajemen Logistik", "Teknik Industri", "Sistem Informasi"],
        professions: ["Supply Chain Manager", "Operations Director", "ERP Consultant"],
      },
    ],
  },
  {
    code: "AIS",
    clusters: [
      {
        name: "Desain Komunikasi Visual & UI/UX",
        programs: ["Desain Komunikasi Visual", "Desain Interior", "Psikologi"],
        professions: ["UI/UX Designer", "Visual Communication Designer", "UX Researcher"],
      },
      {
        name: "Pendidikan & Pengembangan Diri",
        programs: ["Pendidikan Bahasa Inggris", "Psikologi", "Seni Musik"],
        professions: ["Pengajar Kreatif", "Life Coach", "Music Therapist"],
      },
      {
        name: "Kewirausahaan Sosial & Budaya",
        programs: ["Kewirausahaan", "Antropologi", "Kajian Budaya"],
        professions: ["Social Entrepreneur", "Cultural Program Manager", "Community Organizer"],
      },
    ],
  },
  {
    code: "RIE",
    clusters: [
      {
        name: "Teknik & Manufaktur",
        programs: ["Teknik Mesin", "Teknik Elektro", "Teknik Industri"],
        professions: ["Manufacturing Engineer", "Production Manager", "Quality Engineer"],
      },
      {
        name: "Teknologi & Startup",
        programs: ["Teknik Informatika", "Sistem Informasi", "Manajemen Bisnis"],
        professions: ["Tech Founder", "CTO", "Technical Product Manager"],
      },
      {
        name: "Energi & Infrastruktur",
        programs: ["Teknik Sipil", "Teknik Energi", "Perencanaan Wilayah dan Kota"],
        professions: ["Project Manager Konstruksi", "Energy Consultant", "Infrastructure Planner"],
      },
    ],
  },
  {
    code: "SCE",
    clusters: [
      {
        name: "Pelayanan Publik & Administrasi",
        programs: ["Administrasi Publik", "Ilmu Komunikasi", "Hubungan Masyarakat"],
        professions: ["Public Relations Officer", "Customer Experience Manager", "Government Relations Officer"],
      },
      {
        name: "Manajemen Acara & Seni",
        programs: ["Manajemen Seni", "Hotel & Tourism Management", "Event Management"],
        professions: ["Event Coordinator", "Cultural Program Director", "Hospitality Manager"],
      },
      {
        name: "Kesehatan & Pelayanan Sosial",
        programs: ["Kesehatan Masyarakat", "Bimbingan dan Konseling", "Pekerjaan Sosial"],
        professions: ["Social Worker", "Public Health Coordinator", "Community Development Officer"],
      },
    ],
  },
  {
    code: "CEI",
    clusters: [
      {
        name: "Data & Analitik",
        programs: ["Statistika", "Ilmu Komputer", "Sistem Informasi"],
        professions: ["Data Analyst", "Business Intelligence Analyst", "Database Administrator"],
      },
      {
        name: "Audit & Jaminan Kualitas",
        programs: ["Akuntansi", "Teknik Industri", "Hukum"],
        professions: ["Internal Auditor", "QA Manager", "Compliance Officer"],
      },
      {
        name: "Riset & Pengembangan",
        programs: ["Kimia", "Fisika", "Teknik Material"],
        professions: ["R&D Scientist", "Lab Manager", "Research Coordinator"],
      },
    ],
  },
];

export function getProgramStudiByCode(code: string): ProgramStudiCluster | undefined {
  return programStudiClusters.find((p) => p.code === code.toUpperCase());
}
