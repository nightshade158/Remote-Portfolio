import { getPostBySlug, getPublishedPosts } from '@/lib/fetchers'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const posts = await getPublishedPosts()
  return posts.map(p => ({ slug: p.slug }))
}

export default async function BlogPostPage({
  params
}: {
  params: { slug: string }
}) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  return (
    <div className="min-h-screen pt-32 pb-24 px-6">
      <article className="max-w-3xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags?.map(tag => (
            <span
              key={tag}
              className="text-xs font-mono text-cyan-neon bg-cyan-neon/5 border border-cyan-neon/20 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
        <p className="text-xs font-mono text-slate-500 mb-8">
          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
        </p>
        <div className="h-px bg-gradient-to-r from-cyan-neon to-transparent opacity-30 mb-8" />
        <div
          className="prose prose-invert prose-cyan max-w-none text-slate-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
        />
      </article>
    </div>
  )
}
