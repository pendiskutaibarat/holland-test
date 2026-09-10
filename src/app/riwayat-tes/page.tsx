import CompletedTests from "@/components/CompletedTests";

export default function CompletedTestsPage() {
  return (
    <main className="app-shell py-10 md:py-14">
      <section aria-labelledby="completed-tests-title">
        <div className="mx-auto mb-8 max-w-4xl text-center">
          <p className="section-kicker">Riwayat Pribadi</p>
          <h1 id="completed-tests-title" className="app-page-title mt-2 text-4xl">
            Tes yang sudah kamu selesaikan
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Hasil tersimpan secara lokal di perangkat dan browser ini.
          </p>
        </div>
        <CompletedTests />
      </section>
    </main>
  );
}
