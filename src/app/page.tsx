import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Tes Bakat Holland RIASEC
        </h1>
        <p className="text-gray-600 mb-8">
          Platform tes kepribadian dan pemetaan peminatan
        </p>
        <Link
          href="/admin/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Login Admin
        </Link>
      </div>
    </div>
  );
}