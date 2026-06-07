import Link from 'next/link'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { getPublishedPosts } from '@/lib/fetchers'

export default async function Blog() {
  const posts = await getPublishedPosts()

  return (
    <SectionWrapper id="blog" title="Blog">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <article className="glass rounded-2xl p-6 border-glow hover:glow-cyan-sm transition-all duration-300 h-full flex flex-col cursor-pointer hover:-translate-y-1">
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags?.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="text-xs font-mono text-cyan-neon bg-cyan-neon/5 border border-cyan-neon/20 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-white font-semibold mb-2 flex-1">{post.title}</h3>
              <p className="text-slate-400 text-sm line-clamp-2">{post.excerpt}</p>
              <p className="text-xs font-mono text-slate-500 mt-4">
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
              </p>
            </article>
          </Link>
        ))}
        {posts.length === 0 && (
          <p className="text-slate-600 font-mono text-sm col-span-3 text-center">No blog posts published yet.</p>
        )}
      </div>
    </SectionWrapper>
  )
}
