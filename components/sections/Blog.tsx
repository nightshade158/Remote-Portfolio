import Link from 'next/link'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { getPublishedPosts } from '@/lib/fetchers'

export default async function Blog() {
  const posts = await getPublishedPosts()

  return (
    <SectionWrapper id="blog" title="Blog">
      <div className="flex overflow-x-auto gap-6 snap-x snap-mandatory pb-4">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="snap-start shrink-0 w-[300px]">
            <article
              className={`rounded-2xl p-6 border-glow hover:glow-cyan-sm transition-all duration-300 h-full flex flex-col cursor-pointer hover:-translate-y-1 relative overflow-hidden ${
                post.coverImageUrl ? 'border border-white/5' : 'glass'
              }`}
              style={post.coverImageUrl ? { backgroundImage: `url(${post.coverImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
            >
              {post.coverImageUrl && (
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
              )}
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags?.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className={`text-xs font-mono border px-2 py-0.5 rounded ${
                        post.coverImageUrl
                          ? 'text-white bg-white/10 border-white/20'
                          : 'text-cyan-neon bg-cyan-neon/5 border-cyan-neon/20'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-white font-semibold mb-2 flex-1 drop-shadow-lg">{post.title}</h3>
                <p className="text-white/80 text-sm line-clamp-2 drop-shadow-lg">{post.excerpt}</p>
                <p className="text-xs font-mono text-white/60 mt-4 drop-shadow-lg">
                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                </p>
              </div>
            </article>
          </Link>
        ))}
        {posts.length === 0 && (
          <p className="text-slate-600 font-mono text-sm w-full text-center">No blog posts published yet.</p>
        )}
      </div>
    </SectionWrapper>
  )
}
