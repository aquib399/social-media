import prisma from "@/lib/prisma";

export default async function Posts() {
  const posts = await prisma.post.findMany();
  return (
    <section className="w-full ">
      <div className="space-y-3">
        {posts.map((post, index) => (
          <div key={index} className="bg-card">
            {post.content}
          </div>
        ))}
      </div>
    </section>
  );
}
