import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Education from '@/components/sections/Education'
import Skills from '@/components/sections/Skills'
import Projects from '@/components/sections/Projects'
import Internships from '@/components/sections/Internships'
import Certifications from '@/components/sections/Certifications'
import Achievements from '@/components/sections/Achievements'
import OpenSource from '@/components/sections/OpenSource'
import Blog from '@/components/sections/Blog'
import Contact from '@/components/sections/Contact'
import ResumeDownload from '@/components/ResumeDownload'
import {
  getProfile, getEducation, getSkills, getProjects,
  getInternships, getCertifications, getAchievements, getOpenSource
} from '@/lib/fetchers'

export default async function HomePage() {
  const [
    profile, education, skills, projects,
    internships, certifications, achievements, openSource
  ] = await Promise.all([
    getProfile(), getEducation(), getSkills(), getProjects(),
    getInternships(), getCertifications(), getAchievements(), getOpenSource()
  ])

  return (
    <>
      <Hero profile={profile} />
      <About profile={profile} />
      <Education items={education} />
      <Skills items={skills} />
      <Projects items={projects} />
      <Internships items={internships} />
      <Certifications items={certifications} />
      <Achievements items={achievements} />
      <OpenSource items={openSource} />
      <Blog />
      <ResumeDownload
        profile={profile}
        education={education}
        skills={skills}
        projects={projects}
        internships={internships}
        certifications={certifications}
        achievements={achievements}
      />
      <Contact />
    </>
  )
}
