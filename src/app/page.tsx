import Image from "next/image";
import Link from "next/link";

const featureCards = [
  {
    badge: "RIASEC",
    icon: "\u{1F9ED}",
    title: "Holland RIASEC",
    subtitle: "Kenali Kepribadian & Lingkungan Kerja",
    description:
      "Temukan di mana tipe kepribadianmu di antara 6 dimensi (Realistic, Investigative, Artistic, Social, Enterprising, Conventional) untuk mencocokkan gaya belajarmu dengan bidang karir yang paling harmonis.",
    footer: "6 dimensi kepribadian",
  },
  {
    badge: "Minat",
    icon: "\u{1F3A8}",
    title: "Eksplorasi Minat & Hobi (RMIB)",
    subtitle: "Petakan Aktivitas & Bakat Alami",
    description:
      "Identifikasi berbagai kegiatan, hobi, dan keterampilan praktis yang paling kamu nikmati guna menyelaraskan kegemaran sehari-hari dengan produktivitas masa depan menggunakan RMIB (Rothwell-Miller Interest Blank).",
    footer: "Berbasis RMIB",
  },
  {
    badge: "Karir",
    icon: "\u{1F393}",
    title: "Rekomendasi Karir & Studi",
    subtitle: "Rancang Arah Pendidikan & Profesi",
    description:
      "Dapatkan panduan konkret berupa rekomendasi pilihan jurusan (Madrasah Aliyah/Perguruan Tinggi) serta rumpun profesi yang paling sesuai dengan hasil pemetaan psikologismu.",
    footer: "Arah studi dan profesi",
  },
] as const;

const guidanceSteps = [
  {
    title: "Registrasi & Pilih Tes",
    description:
      "Masuk menggunakan akun yang telah didaftarkan oleh madrasah, lalu pilih instrumen tes yang ingin dikerjakan.",
  },
  {
    title: "Jawab dengan Jujur",
    description:
      "Tidak ada jawaban benar atau salah. Isilah setiap pernyataan dengan santai sesuai kata hati dan kondisi dirimu yang sesungguhnya.",
  },
  {
    title: "Terima Laporan Instan",
    description:
      "Sistem akan menganalisis jawabanmu secara otomatis dan menyajikan rincian profil kepribadian beserta diagram potensimu.",
  },
  {
    title: "Konsultasi & Diskusikan",
    description:
      "Bawa hasil asesmenmu ke Guru Bimbingan dan Konseling (BK), Konsultan Pendidikan, atau orang tua guna menyusun rencana studi yang matang.",
  },
] as const;

function EducationArtwork() {
  return (
    <div className="education-art">
      <Image
        src="/3d-education.png"
        alt=""
        fill
        priority
        sizes="(max-width: 760px) 86vw, 43vw"
        className="education-art-image"
      />
    </div>
  );
}

export default async function Home() {
  const assessmentHref = "/test/public";

  return (
    <main className="landing-page">
      <section id="beranda" className="landing-hero">
        <div className="hero-photo" aria-hidden="true" />
        <div className="hero-wash" aria-hidden="true" />
        <div className="hero-orb hero-orb-left" aria-hidden="true" />
        <div className="hero-orb hero-orb-right" aria-hidden="true" />

        <div className="hero-content">
          <span className="hero-chip">Platform Asesmen Digital untuk Madrasah</span>
          <p className="hero-eyebrow">Minat Terarah,</p>
          <h1>
            Masa Depan
            <br />
            Cerah!
          </h1>
          <p className="hero-description">
            Jangan sampai salah pilihan. Platform asesmen digital ini dirancang
            untuk memetakan minat, hobi, dan rekomendasi karirmu secara akurat.
            Kenali dirimu lebih dalam hanya dalam beberapa menit.
          </p>
          <div className="hero-actions">
            <Link href={assessmentHref} className="landing-cta landing-cta-primary">
              Mulai Asesmen
            </Link>
            <Link href="#panduan" className="landing-cta landing-cta-secondary">
              Pelajari Jenis Tes
            </Link>
          </div>
          <div className="hero-trust-list" aria-label="Keunggulan utama platform">
            <span>Instrumen terintegrasi</span>
            <span>Laporan instan</span>
            <span>Siap didiskusikan dengan BK</span>
          </div>
        </div>

        <EducationArtwork />
        <div className="hero-curve" aria-hidden="true" />
      </section>

      <section id="pilihan-tes" className="landing-section landing-section-surface">
        <p className="section-kicker">Pilihan Tes</p>
        <h2>Temukan potensi terbaikmu</h2>
        <p className="landing-section-intro">
          Tiga instrumen asesmen terintegrasi yang dirancang khusus untuk
          memetakan kecenderungan akademis dan profesional secara akurat.
        </p>
        <div className="test-grid">
          {featureCards.map((card) => (
            <article key={card.title} className="landing-feature-card">
              <div className="landing-feature-header">
                <span className="landing-feature-badge">{card.badge}</span>
                <span className="landing-feature-icon" aria-hidden="true">
                  {card.icon}
                </span>
              </div>
              <h3>{card.title}</h3>
              <p className="landing-feature-subtitle">{card.subtitle}</p>
              <p>{card.description}</p>
              <div className="landing-feature-footer">{card.footer}</div>
            </article>
          ))}
        </div>
      </section>

      <section id="panduan" className="landing-section landing-section-muted">
        <p className="section-kicker">Panduan Pengisian</p>
        <h2>Langkah Mudah Menuju Masa Depan Cerah</h2>
        <div className="landing-steps-grid">
          {guidanceSteps.map((step, index) => (
            <article key={step.title} className="landing-step-card">
              <div className="landing-step-number">0{index + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="tentang-kami" className="landing-section">
        <p className="section-kicker">Tentang Kami</p>
        <div className="landing-about-panel">
          <div className="landing-about-lead">
            <h2>Sinergi Teknologi dan Pedagogi untuk Madrasah Hebat Bermartabat</h2>
            <p>
              Asesmen Pendis Kutai Barat adalah layanan inovasi teknologi
              pembelajaran yang dikembangkan oleh Seksi Pendidikan Islam Kantor
              Kementerian Agama Kabupaten Kutai Barat. Platform ini memadukan
              teori psikologi pendidikan yang teruji dengan kemudahan akses
              teknologi digital.
            </p>
          </div>
          <div className="landing-about-body">
            <p>
              Hadir sebagai mitra strategis bagi Guru Bimbingan dan Konseling
              (BK), madrasah, serta orang tua, platform ini bertujuan
              meminimalkan risiko salah jurusan, mendukung pembelajaran yang
              berdiferensiasi, serta mengantarkan peserta didik mengenali
              potensi terbaik mereka agar tumbuh menjadi generasi yang mandiri,
              berprestasi, dan berakhlak mulia.
            </p>
            <div className="landing-about-points" aria-label="Nilai utama platform">
              <span>Psikologi pendidikan teruji</span>
              <span>Akses digital yang mudah</span>
              <span>Mitra strategis madrasah dan orang tua</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
