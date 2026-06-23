import Image from "next/image";
import Link from "next/link";

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

        <div className="hero-content">
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
        </div>

        <EducationArtwork />
        <div className="hero-curve" aria-hidden="true" />
      </section>

      <section id="pilihan-tes" className="landing-section">
        <p className="section-kicker">Pilihan Tes</p>
        <h2>Temukan potensi terbaikmu</h2>
        <div className="test-grid">
          <article className="landing-feature-card">
            <span className="landing-feature-badge">RIASEC</span>
            <h3>Holland RIASEC</h3>
            <p>Kenali kepribadian kerja dan bidang karir yang paling cocok.</p>
          </article>
          <article className="landing-feature-card">
            <span className="landing-feature-badge">Minat</span>
            <h3>Minat &amp; Hobi</h3>
            <p>Petakan aktivitas, ketertarikan, dan bakat yang kamu nikmati.</p>
          </article>
          <article className="landing-feature-card">
            <span className="landing-feature-badge">Karir</span>
            <h3>Rekomendasi Karir</h3>
            <p>Dapatkan arahan pendidikan dan profesi berdasarkan hasilmu.</p>
          </article>
        </div>
      </section>

      <section id="panduan" className="landing-section landing-section-muted">
        <p className="section-kicker">Panduan Pengisian</p>
        <h2>Mudah, cepat, dan terarah</h2>
        <p>
          Pilih tes, jawab setiap pertanyaan dengan jujur, lalu pelajari hasil
          asesmenmu bersama guru atau pendamping.
        </p>
      </section>

      <section id="tentang-kami" className="landing-section">
        <p className="section-kicker">Tentang Kami</p>
        <h2>Asesmen Pendis Kutai Barat</h2>
        <p>
          Platform asesmen digital untuk membantu siswa memahami potensi diri
          dan merencanakan masa depan dengan lebih percaya diri.
        </p>
      </section>
    </main>
  );
}
