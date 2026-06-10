import { redirect } from "next/navigation";
import { getAuthToken, verifyToken } from "@/lib/auth";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  const token = await getAuthToken();
  let shouldRedirect = false;

  if (token) {
    try {
      const payload = verifyToken(token);
      shouldRedirect = payload.status === "ACTIVE";
    } catch {
      // Invalid token, stay on login page
    }
  }

  if (shouldRedirect) {
    redirect("/admin/dashboard");
  }

  return <LoginForm />;
}
