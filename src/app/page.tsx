import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthToken, verifyToken } from "@/lib/auth";

export default async function Home() {
  const token = await getAuthToken();
  let shouldRedirect = false;

  if (token) {
    try {
      const payload = verifyToken(token);
      shouldRedirect = payload.status === "ACTIVE";
    } catch {
      // Invalid token, stay on home page
    }
  }

  if (shouldRedirect) {
    redirect("/admin/assessments");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Platform Asesmen Siswa
        </h1>
        <p className="text-gray-600 mb-8">
          Kelola sesi Holland RIASEC, Minat Hobi, dan asesmen lain.
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
