import prisma from "@/lib/prisma";

export default async function Users() {
  const users = await prisma.user.findMany({ select: { email: true } });
  return (
    <section className="w-full ">
      <div className="space-y-3">
        {users.map((user, index) => (
          <div key={index} className="bg-card p-4">
            {user.email}
          </div>
        ))}
      </div>
    </section>
  );
}
