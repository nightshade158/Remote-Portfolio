import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface ResumeData {
  profile?: Record<string, unknown> | null
  education?: Record<string, unknown>[] | null
  skills?: Record<string, unknown>[] | null
  projects?: Record<string, unknown>[] | null
  internships?: Record<string, unknown>[] | null
  certifications?: Record<string, unknown>[] | null
  achievements?: Record<string, unknown>[] | null
}

function value(item: Record<string, unknown> | null | undefined, key: string): string {
  const raw = item?.[key]
  return typeof raw === 'string' ? raw.trim() : ''
}

function arrayValue(item: Record<string, unknown> | null | undefined, key: string): string[] {
  const raw = item?.[key]
  return Array.isArray(raw) ? raw.filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0) : []
}

function escapeLatex(input: string | null | undefined): string {
  if (!input) return ''

  return input
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}')
}

function escapeUrl(input: string | null | undefined): string {
  if (!input) return ''

  return input
    .replace(/\\/g, '/')
    .replace(/%/g, '\\%')
    .replace(/#/g, '\\#')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
}

function compact(items: Array<string | null | undefined>): string[] {
  return items.filter((item): item is string => Boolean(item && item.trim()))
}

function dateRange(start: string, end: string): string {
  if (start && end) return `${start} -- ${end}`
  if (start) return `${start} -- Present`
  return end
}

function oneCol(body: string): string {
  return `\n        \\begin{onecolentry}\n${body}\n        \\end{onecolentry}`
}

function twoCol(date: string, title: string): string {
  if (date) {
    return `\n        \\begin{twocolentry}{\n            \\textbf{${escapeLatex(date)}}\n        }\n            ${title}\\end{twocolentry}`
  }

  return `\n        \\begin{onecolentry}\n            ${title}\n        \\end{onecolentry}`
}

function highlights(items: string[]): string {
  if (items.length === 0) return ''

  return oneCol(`            \\begin{highlights}\n${items.map(item => `                \\item ${item}`).join('\n')}\n            \\end{highlights}`)
}

function section(title: string, body: string): string {
  return body.trim() ? `\n\n    \\section{${title}}\n${body}` : ''
}

function linkedLabel(url: string, label: string): string {
  return url ? `\\hrefWithoutArrow{${escapeUrl(url)}}{${label}}` : label
}

function buildLatex(data: ResumeData): string {
  const profile = data.profile ?? null
  const education = data.education ?? []
  const skills = data.skills ?? []
  const projects = data.projects ?? []
  const internships = data.internships ?? []
  const certifications = data.certifications ?? []
  const achievements = data.achievements ?? []

  const name = escapeLatex(value(profile, 'name') || 'Resume')
  const city = value(profile, 'city')
  const email = value(profile, 'email')
  const phone = value(profile, 'phone')
  const website = value(profile, 'website')
  const linkedin = value(profile, 'linkedin')
  const github = value(profile, 'github')
  const about = value(profile, 'about')

  const contactItems = compact([
    city ? `\\mbox{${escapeLatex(city)}}` : '',
    email ? `\\mbox{\\hrefWithoutArrow{mailto:${escapeUrl(email)}}{${escapeLatex(email)}}}` : '',
    phone ? `\\mbox{\\hrefWithoutArrow{tel:${escapeUrl(phone)}}{${escapeLatex(phone)}}}` : '',
    website ? `\\mbox{${linkedLabel(website, 'Website')}}` : '',
    linkedin ? `\\mbox{${linkedLabel(linkedin, 'LinkedIn')}}` : '',
    github ? `\\mbox{${linkedLabel(github, 'Github')}}` : ''
  ])

  const contactLine = contactItems.length > 0
    ? contactItems.join('\n        \\kern 5.0 pt\n        \\AND\n        \\kern 5.0 pt\n        ')
    : ''

  const educationBody = education.map(edu => {
    const institution = value(edu, 'institution')
    const degree = value(edu, 'degree')
    const field = value(edu, 'field')
    const score = value(edu, 'score')
    const scoreType = value(edu, 'scoreType')
    const description = value(edu, 'description')
    const title = `\\textbf{${escapeLatex(institution || 'Education')}}${degree ? `, ${escapeLatex(degree)}${field ? ` in ${escapeLatex(field)}` : ''}` : ''}`
    const points = compact([
      score ? `\\textbf{${escapeLatex(scoreType || 'Score')}:} ${escapeLatex(score)}` : '',
      description ? escapeLatex(description) : ''
    ])

    return `${twoCol(dateRange(value(edu, 'yearStart'), value(edu, 'yearEnd')), title)}\n${highlights(points)}`
  }).join('\n\n')

  const skillsByCategory = skills.reduce<Record<string, string[]>>((acc, skill) => {
    const category = value(skill, 'category') || 'Skills'
    const name = value(skill, 'name')
    if (!name) return acc
    if (!acc[category]) acc[category] = []
    acc[category].push(name)
    return acc
  }, {})

  const skillsBody = Object.entries(skillsByCategory)
    .map(([category, names]) => oneCol(`            \\textbf{${escapeLatex(category)}:} ${names.map(escapeLatex).join(', ')}`))
    .join('\n')

  const experienceBody = internships.map(internship => {
    const role = value(internship, 'role')
    const company = value(internship, 'company')
    const title = `\\textbf{${escapeLatex(role || 'Experience')}}${company ? `, ${escapeLatex(company)}` : ''}`
    const points = arrayValue(internship, 'points').map(escapeLatex)

    return `${twoCol(dateRange(value(internship, 'durationStart'), value(internship, 'durationEnd')), title)}\n${highlights(points)}`
  }).join('\n\n')

  const projectsBody = projects.map(project => {
    const title = value(project, 'title') || 'Project'
    const projectPoints = arrayValue(project, 'points')
    const description = value(project, 'description')
    const techStack = arrayValue(project, 'techStack')
    const githubLink = value(project, 'githubLink')
    const liveLink = value(project, 'liveLink')
    const links = compact([
      githubLink ? `\\hrefWithoutArrow{${escapeUrl(githubLink)}}{Github}` : '',
      liveLink ? `\\hrefWithoutArrow{${escapeUrl(liveLink)}}{Live}` : ''
    ])
    const highlightItems = compact([
      ...(projectPoints.length > 0
        ? projectPoints.map(escapeLatex)
        : description ? [escapeLatex(description)] : []
      ),
      techStack.length > 0 ? `\\textbf{Technologies:} ${techStack.map(escapeLatex).join(', ')}` : '',
      links.length > 0 ? `\\textbf{Links:} ${links.join(', ')}` : ''
    ])

    return `${twoCol('', `\\textbf{${escapeLatex(title)}}`)}\n${highlights(highlightItems)}`
  }).join('\n\n')

  const certificationsBody = certifications.map(certification => {
    const title = value(certification, 'title') || 'Certification'
    const platform = value(certification, 'platform')
    const link = value(certification, 'link')
    const label = `\\textbf{${escapeLatex(title)}}${platform ? ` -- ${escapeLatex(platform)}` : ''}${link ? ` -- \\hrefWithoutArrow{${escapeUrl(link)}}{Link}` : ''}`

    return twoCol(value(certification, 'year'), label)
  }).join('\n\n')

  const achievementItems = achievements.map(achievement => {
    const title = value(achievement, 'title')
    const description = value(achievement, 'description')
    const year = value(achievement, 'year')
    const text = `${title ? `\\textbf{${escapeLatex(title)}}` : 'Achievement'}${description ? ` -- ${escapeLatex(description)}` : ''}${year ? ` (${escapeLatex(year)})` : ''}`
    return text
  })
  const achievementsBody = achievementItems.length > 0
    ? `        \\begin{highlights}\n${achievementItems.map(item => `            \\item ${item}`).join('\n')}\n        \\end{highlights}`
    : ''

  const sections = [
    section('Summary', about ? oneCol(`            ${escapeLatex(about)}`) : ''),
    section('Education', educationBody),
    section('Experience', experienceBody),
    section('Projects', projectsBody),
    section('Skills', skillsBody),
    section('Certifications', certificationsBody),
    section('Achievements and Leadership', achievementsBody)
  ].join('')

  return `\\documentclass[10pt, letterpaper]{article}
\\usepackage[
    ignoreheadfoot,
    top=1 cm,
    bottom=1 cm,
    left=1 cm,
    right=1 cm,
    footskip=0.5 cm,
]{geometry}
\\usepackage{titlesec}
\\usepackage{tabularx}
\\usepackage{array}
\\usepackage[dvipsnames]{xcolor}
\\definecolor{primaryColor}{RGB}{0, 0, 0}
\\usepackage{enumitem}
\\usepackage{amsmath}
\\usepackage[
    pdftitle={${name} CV},
    pdfauthor={${name}},
    pdfcreator={LaTeX with Portfolio Resume Generator},
    colorlinks=true,
    urlcolor=primaryColor
]{hyperref}
\\usepackage{calc}
\\usepackage{bookmark}
\\usepackage{etoolbox}
\\usepackage{changepage}
\\usepackage{paracol}
\\usepackage{needspace}
\\usepackage{iftex}

\\ifPDFTeX
    \\input{glyphtounicode}
    \\pdfgentounicode=1
    \\usepackage[T1]{fontenc}
    \\usepackage[utf8]{inputenc}
    \\usepackage{lmodern}
\\fi

\\usepackage{charter}

\\raggedright
\\AtBeginEnvironment{adjustwidth}{\\partopsep0pt}
\\pagestyle{empty}
\\setcounter{secnumdepth}{0}
\\setlength{\\parindent}{0pt}
\\setlength{\\topskip}{0pt}
\\setlength{\\columnsep}{0.15cm}
\\pagenumbering{gobble}

\\titleformat{\\section}{\\needspace{4\\baselineskip}\\bfseries\\large}{}{0pt}{}[\\vspace{1pt}\\titlerule]
\\titlespacing{\\section}{-1pt}{0.3 cm}{0.2 cm}

\\renewcommand\\labelitemi{$\\vcenter{\\hbox{\\small$\\bullet$}}$}
\\newenvironment{highlights}{
    \\begin{itemize}[
        topsep=0.10 cm,
        parsep=0.10 cm,
        partopsep=0pt,
        itemsep=0pt,
        leftmargin=0 cm + 10pt
    ]
}{
    \\end{itemize}
}
\\newenvironment{onecolentry}{
    \\begin{adjustwidth}{0 cm + 0.00001 cm}{0 cm + 0.00001 cm}
}{
    \\end{adjustwidth}
}
\\newenvironment{twocolentry}[2][]{
    \\onecolentry
    \\def\\secondColumn{#2}
    \\setcolumnwidth{\\fill, 4.5 cm}
    \\begin{paracol}{2}
}{
    \\switchcolumn \\raggedleft \\secondColumn
    \\end{paracol}
    \\endonecolentry
}
\\newenvironment{header}{
    \\setlength{\\topsep}{0pt}\\par\\kern\\topsep\\centering\\linespread{1.5}
}{
    \\par\\kern\\topsep
}

\\let\\hrefWithoutArrow\\href

\\begin{document}
    \\newcommand{\\AND}{\\unskip
        \\cleaders\\copy\\ANDbox\\hskip\\wd\\ANDbox
        \\ignorespaces
    }
    \\newsavebox\\ANDbox
    \\sbox\\ANDbox{$|$}

    \\begin{header}
        \\fontsize{25 pt}{25 pt}\\selectfont ${name}

        \\vspace{5 pt}

        \\normalsize
        ${contactLine}
    \\end{header}

    \\vspace{5 pt - 0.3 cm}${sections}

\\end{document}`
}

async function compileLatex(latex: string): Promise<ArrayBuffer> {
  const params = new URLSearchParams({
    text: latex,
    command: 'pdflatex',
    force: 'true'
  })

  const compileRes = await fetch(`https://latexonline.cc/compile?${params.toString()}`)

  const contentType = compileRes.headers.get('content-type') ?? ''
  if (!compileRes.ok || !contentType.includes('application/pdf')) {
    throw new Error(`LaTeX compile failed: ${compileRes.status}`)
  }

  return compileRes.arrayBuffer()
}

export async function POST(req: NextRequest) {
  let latex = ''

  try {
    const data = await req.json() as ResumeData
    latex = buildLatex(data)
    const format = req.nextUrl.searchParams.get('format')

    if (format === 'latex') {
      return new NextResponse(latex, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': 'attachment; filename="resume.tex"'
        }
      })
    }

    const pdf = await compileLatex(latex)

    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"'
      }
    })
  } catch (err) {
    console.error('Resume generation error:', err)
    return NextResponse.json({ error: 'Resume generation failed', latex }, { status: 500 })
  }
}
