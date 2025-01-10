import prisma from "@/lib/prisma";

export default async function Sessions() {
  const sessions = await prisma.session.findMany({ select: { id: true } });
  return (
    <section className="w-full ">
      <div className="space-y-3">
        {sessions.map((sessions, index) => (
          <div key={index} className="bg-card">
            {sessions.id}
          </div>
        ))}
      </div>
    </section>
  );
}
