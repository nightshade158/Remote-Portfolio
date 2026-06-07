import { getPublishedPosts } from '@/lib/fetchers'
import Link from 'next/link'

export default async function BlogPage() {
  const posts = await getPublishedPosts()

  return (
    <div className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">
          <span className="text-cyan-neon">&lt;</span>
          Blog
          <span className="text-cyan-neon">/&gt;</span>
        </h1>
        <div className="h-px bg-gradient-to-r from-cyan-neon to-transparent opacity-30 mb-12" />
        <div className="space-y-6">
          {posts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <article className="glass rounded-2xl p-6 border-glow hover:glow-cyan-sm transition-all duration-300 block mb-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.tags?.map(tag => (
                    <span
                      key={tag}
                      className="text-xs font-mono text-cyan-neon bg-cyan-neon/5 border border-cyan-neon/20 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">{post.title}</h2>
                <p className="text-slate-400 text-sm">{post.excerpt}</p>
                <p className="text-xs font-mono text-slate-500 mt-3">
                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                </p>
              </article>
            </Link>
          ))}
          {posts.length === 0 && (
            <p className="text-slate-500 font-mono text-sm">No posts published yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
