import Navbar from "@/app/(main)/navbar";
import { validateRequestAdmin } from "@/auth";
import AdminTabs from "./adminTabs";

export default async function AdminPage() {
  const data = await validateRequestAdmin();
  return (
    <div className="flex min-h-[300vh] flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-3 sm:p-5">
        <AdminTabs />
      </div>
    </div>
  );
}
