// src/services/templates/classicTemplate.js
// Template 1 - Classic. Single column, icon contact line, tabular-aligned
// entries. This is the original Momentum Resume design, now parameterized
// by font/accent/spacing instead of hardcoded values.

import { getFontPreamble } from '../latex/fontPackages';
import { getSpacingTokens } from '../latex/spacingPresets';

const ICON_MAP = {
  envelope: '\\faIcon{envelope}',
  phone: '\\faIcon{phone}',
  linkedin: '\\faIcon{linkedin}',
  github: '\\faIcon{github}',
  code: '\\faIcon{code}',
  'code-branch': '\\faIcon{code-branch}',
};

const buildPreamble = (styleSettings) => {
  const { font, accentColor } = styleSettings;
  const accentHex = (accentColor || '2563EB').replace('#', '');

  return `\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{fontawesome5}
\\usepackage{xcolor}
${getFontPreamble(font)}

\\definecolor{accent}{HTML}{${accentHex}}

\\usepackage[
    colorlinks=true,
    linkcolor=black,
    citecolor=black,
    filecolor=black,
    urlcolor=blue,
    pdfborder={0 0 0},
    unicode=true,
    breaklinks=true
]{hyperref}

\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large\\color{accent}
}{}{0em}{}[\\color{accent}\\titlerule \\vspace{-5pt}]

\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProject}[4]{
  \\vspace{0.5mm}\\item
    \\begin{tabular*}{0.98\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
        \\textbf{#1} & \\textit{\\footnotesize{#3}} \\\\
        \\footnotesize{\\textit{#2}} & \\footnotesize{#4}
    \\end{tabular*}
    \\vspace{-4.4mm}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}}

\\addtolength{\\topmargin}{-12pt}
\\addtolength{\\textheight}{24pt}`;
};

const renderHeader = (header, spacing) => {
  const contactSection = header.contacts
    .map((c) => `${ICON_MAP[c.icon] || ''} \\href{${c.href}}{\\color{black}${c.label}}`)
    .join(' \\hspace{3mm} ');

  return `\\begin{center}
    \\textbf{\\Huge \\scshape ${header.name}} \\\\ \\vspace{8pt}
    \\small
    ${contactSection}
\\end{center}

\\vspace{${spacing.afterHeader}}`;
};

const renderEntries = (entries, spacing) =>
  entries.map((entry) => {
    const bulletList = entry.bullets.length
      ? `\\resumeItemListStart\n${entry.bullets.map((b) => `\\resumeItem{${b}}`).join('\n')}\n\\resumeItemListEnd\\vspace{${spacing.afterBulletList}}`
      : '';
    return `\\resumeSubheading
  {${entry.heading}}{${entry.date}}
  {${entry.subheading}}{${entry.rightMeta ? `\\textbf{${entry.rightMeta}}` : ''}}
  ${bulletList}`;
  }).join('\n');

const renderProjectEntries = (entries, spacing) =>
  entries.map((entry) => {
    const bulletList = entry.bullets.length
      ? `\\resumeItemListStart\n${entry.bullets.map((b) => `\\resumeItem{${b}}`).join('\n')}\n\\resumeItemListEnd\\vspace{${spacing.afterBulletList}}`
      : '';
    return `\\resumeProject
  {${entry.heading}}{${entry.subheading}}{}{}
  ${bulletList}`;
  }).join('\n');

const renderSkills = (entries) => {
  if (!entries.length) return '';
  const rows = entries.map((s) => `\\textbf{${s.label}}{: ${s.value}}`);
  return `\\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
        ${rows.join(' \\\\\n\\vspace{3pt}\n')}
    }}
\\end{itemize}`;
};

const renderCertifications = (entries) => {
  if (!entries.length) return '';
  const rows = entries.map((c) => {
    const link = c.href ? `\\href{${c.href}}{\\textcolor{accent}{(Link)}}` : '';
    return `\\resumeItem{${link ? `${c.text} ${link}` : c.text}}`;
  });
  return `\\begin{itemize}[leftmargin=0.15in, label={}]
    \\item{
        \\begin{itemize}[leftmargin=0.15in, itemsep=-2pt]
            ${rows.join('\\vspace{4pt}\n')}
        \\end{itemize}
    }
\\end{itemize}`;
};

const renderSection = (section, spacing) => {
  let body = '';
  if (section.kind === 'skills') body = renderSkills(section.entries);
  else if (section.kind === 'certifications') body = renderCertifications(section.entries);
  else if (section.id === 'projects') body = `\\resumeSubHeadingListStart\n${renderProjectEntries(section.entries, spacing)}\n\\resumeSubHeadingListEnd`;
  else body = `\\resumeSubHeadingListStart\n${renderEntries(section.entries, spacing)}\n\\resumeSubHeadingListEnd`;

  return `\\vspace{${spacing.beforeSection}}
\\section{${section.title}}
${body}`;
};

export const renderClassicTemplate = (content, styleSettings) => {
  const spacing = getSpacingTokens(styleSettings.spacing);
  const preamble = buildPreamble(styleSettings);
  const header = renderHeader(content.header, spacing);
  const sections = content.sections.map((s) => renderSection(s, spacing)).join('\n');

  return `${preamble}

\\begin{document}
${header}
${sections}
\\end{document}
`;
};
