import { db, schema } from './db'
import { asc, eq } from 'drizzle-orm'
import { unstable_cache } from 'next/cache'

export const getProfile = unstable_cache(
  async () => {
    const result = await db.select().from(schema.profile).limit(1)
    return result[0] ?? null
  },
  ['profile'],
  { revalidate: false, tags: ['profile'] }
)

export const getEducation = unstable_cache(
  async () => db.select().from(schema.education).orderBy(asc(schema.education.order)),
  ['education'],
  { revalidate: false, tags: ['education'] }
)

export const getSkills = unstable_cache(
  async () => db.select().from(schema.skills).orderBy(asc(schema.skills.order)),
  ['skills'],
  { revalidate: false, tags: ['skills'] }
)

export const getProjects = unstable_cache(
  async () => db.select().from(schema.projects).orderBy(asc(schema.projects.order)),
  ['projects'],
  { revalidate: false, tags: ['projects'] }
)

export const getInternships = unstable_cache(
  async () => db.select().from(schema.internships).orderBy(asc(schema.internships.order)),
  ['internships'],
  { revalidate: false, tags: ['internships'] }
)

export const getCertifications = unstable_cache(
  async () => db.select().from(schema.certifications).orderBy(asc(schema.certifications.order)),
  ['certifications'],
  { revalidate: false, tags: ['certifications'] }
)

export const getAchievements = unstable_cache(
  async () => db.select().from(schema.achievements).orderBy(asc(schema.achievements.order)),
  ['achievements'],
  { revalidate: false, tags: ['achievements'] }
)

export const getOpenSource = unstable_cache(
  async () => db.select().from(schema.openSource).orderBy(asc(schema.openSource.order)),
  ['opensource'],
  { revalidate: false, tags: ['opensource'] }
)

export const getPublishedPosts = unstable_cache(
  async () =>
    db.select().from(schema.blogPosts)
      .where(eq(schema.blogPosts.published, true))
      .orderBy(asc(schema.blogPosts.createdAt)),
  ['blog'],
  { revalidate: false, tags: ['blog'] }
)

export const getPostBySlug = unstable_cache(
  async (slug: string) => {
    const result = await db.select().from(schema.blogPosts)
      .where(eq(schema.blogPosts.slug, slug))
      .limit(1)
    return result[0] ?? null
  },
  ['blog-post'],
  { revalidate: false, tags: ['blog'] }
)
