import prisma from "@/lib/prisma";

export default async function Admins() {
  const admins = await prisma.admin.findMany({ select: { email: true } });
  return (
    <section className="w-full ">
      <div className="space-y-3">
        {admins.map((admin, index) => (
          <div key={index} className="bg-card">
            {admin.email}
          </div>
        ))}
      </div>
    </section>
  );
}
