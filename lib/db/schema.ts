import {
  pgTable, uuid, text, boolean, timestamp, integer, jsonb
} from 'drizzle-orm/pg-core'

export const profile = pgTable('profile', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  title: text('title').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  city: text('city'),
  linkedin: text('linkedin'),
  github: text('github'),
  website: text('website'),
  about: text('about'),
  avatarUrl: text('avatar_url'),
  resumeData: jsonb('resume_data'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const education = pgTable('education', {
  id: uuid('id').defaultRandom().primaryKey(),
  institution: text('institution').notNull(),
  degree: text('degree').notNull(),
  field: text('field'),
  yearStart: text('year_start'),
  yearEnd: text('year_end'),
  score: text('score'),
  scoreType: text('score_type'),
  description: text('description'),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow()
})

export const skills = pgTable('skills', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  proficiency: text('proficiency'),
  iconUrl: text('icon_url'),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow()
})

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  points: text('points').array(),
  techStack: text('tech_stack').array(),
  githubLink: text('github_link'),
  liveLink: text('live_link'),
  imageUrl: text('image_url'),
  featured: boolean('featured').default(false),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow()
})

export const internships = pgTable('internships', {
  id: uuid('id').defaultRandom().primaryKey(),
  company: text('company').notNull(),
  role: text('role').notNull(),
  durationStart: text('duration_start'),
  durationEnd: text('duration_end'),
  points: text('points').array(),
  companyUrl: text('company_url'),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow()
})

export const certifications = pgTable('certifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  platform: text('platform'),
  year: text('year'),
  link: text('link'),
  imageUrl: text('image_url'),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow()
})

export const achievements = pgTable('achievements', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  year: text('year'),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow()
})

export const openSource = pgTable('open_source', {
  id: uuid('id').defaultRandom().primaryKey(),
  repoName: text('repo_name').notNull(),
  description: text('description'),
  prLink: text('pr_link'),
  repoUrl: text('repo_url'),
  year: text('year'),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow()
})

export const blogPosts = pgTable('blog_posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content'),
  excerpt: text('excerpt'),
  coverImageUrl: text('cover_image_url'),
  published: boolean('published').default(false),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export type Profile = typeof profile.$inferSelect
export type Education = typeof education.$inferSelect
export type Skill = typeof skills.$inferSelect
export type Project = typeof projects.$inferSelect
export type Internship = typeof internships.$inferSelect
export type Certification = typeof certifications.$inferSelect
export type Achievement = typeof achievements.$inferSelect
export type OpenSourceItem = typeof openSource.$inferSelect
export type BlogPost = typeof blogPosts.$inferSelect
