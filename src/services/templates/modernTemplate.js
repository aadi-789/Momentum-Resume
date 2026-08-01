// src/services/templates/modernTemplate.js
// Template 2 - Modern. Two-column layout: a colored header band, a narrow
// sidebar (Education / Skills / Certifications) and a wider main column
// (Experience / Projects / any custom sections), in the user's chosen
// section order within each column.

import { getFontPreamble } from '../latex/fontPackages';
import { getSpacingTokens } from '../latex/spacingPresets';

// Sections that belong in the sidebar. Everything else goes in the main
// column. Order within each column follows the user's sectionOrder.
const SIDEBAR_SECTION_IDS = new Set(['education', 'skills', 'certifications']);

const buildPreamble = (styleSettings) => {
  const { font, accentColor } = styleSettings;
  const accentHex = (accentColor || '2563EB').replace('#', '');

  return `\\documentclass[letterpaper,10.5pt]{article}
\\usepackage[empty]{fullpage}
\\usepackage{enumitem}
\\usepackage[english]{babel}
\\usepackage{fontawesome5}
\\usepackage{xcolor}
\\usepackage{tikz}
${getFontPreamble(font)}

\\definecolor{accent}{HTML}{${accentHex}}

\\usepackage[
    colorlinks=true,
    linkcolor=black,
    urlcolor=accent,
    pdfborder={0 0 0},
    unicode=true,
    breaklinks=true
]{hyperref}

\\pagestyle{empty}
\\addtolength{\\oddsidemargin}{-0.6in}
\\addtolength{\\evensidemargin}{-0.6in}
\\addtolength{\\textwidth}{1.2in}
\\addtolength{\\topmargin}{-0.7in}
\\addtolength{\\textheight}{1.4in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\parindent}{0pt}

\\newcommand{\\sectiontitle}[1]{{\\color{accent}\\scshape\\large #1}\\\\[-4pt]{\\color{accent}\\hrule height 1pt}\\vspace{4pt}}
\\newcommand{\\sidebartitle}[1]{{\\color{accent}\\scshape\\bfseries #1}\\\\[2pt]{\\color{accent}\\hrule height 0.5pt}\\vspace{4pt}}
\\newcommand{\\entryHeading}[4]{\\textbf{#1} \\hfill {\\small\\textit{#2}}\\\\{\\small\\textit{#3}} \\hfill {\\small #4}\\\\[1pt]}
\\newcommand{\\sidebarEntry}[2]{\\textbf{\\small #1}\\\\{\\footnotesize\\textit{#2}}\\\\[3pt]}`;
};

const renderHeaderBand = (header) => {
  const contactSection = header.contacts.map((c) => c.label).join(' \\ $\\cdot$ \\ ');
  return `\\noindent\\colorbox{accent}{\\begin{minipage}{\\dimexpr\\textwidth-2\\fboxsep}
\\color{white}
\\begin{center}
{\\Huge \\scshape ${header.name}}\\\\[6pt]
{\\small ${contactSection}}
\\end{center}
\\end{minipage}}`;
};

const renderBullets = (bullets, spacing) => {
  if (!bullets.length) return '';
  return `\\begin{itemize}[leftmargin=0.15in, itemsep=${spacing.betweenBullets}, topsep=2pt]
${bullets.map((b) => `\\item \\small ${b}`).join('\n')}
\\end{itemize}\\vspace{${spacing.afterBulletList}}`;
};

const renderMainSection = (section, spacing) => {
  const body = section.entries.map((entry) => {
    const heading = `\\entryHeading{${entry.heading}}{${entry.date}}{${entry.subheading}}{${entry.rightMeta}}`;
    return `${heading}${renderBullets(entry.bullets, spacing)}`;
  }).join(`\\vspace{${spacing.afterEntry}}\n`);

  return `\\sectiontitle{${section.title}}\n${body}\\vspace{${spacing.beforeSection}}`;
};

const renderSidebarEducationOrCustom = (section, spacing) => {
  const body = section.entries.map((entry) => {
    const meta = [entry.subheading, entry.date].filter(Boolean).join(' \u2022 ');
    const bullets = renderBullets(entry.bullets, spacing);
    return `\\sidebarEntry{${entry.heading}}{${meta}}${bullets}`;
  }).join('\n');

  return `\\sidebartitle{${section.title}}\n${body}\\vspace{${spacing.beforeSection}}`;
};

const renderSidebarSkills = (section, spacing) => {
  if (!section.entries.length) return '';
  const rows = section.entries.map((s) => `\\textbf{\\footnotesize ${s.label}:} {\\footnotesize ${s.value}}\\\\[2pt]`).join('\n');
  return `\\sidebartitle{${section.title}}\n${rows}\\vspace{${spacing.beforeSection}}`;
};

const renderSidebarCertifications = (section, spacing) => {
  if (!section.entries.length) return '';
  const rows = section.entries.map((c) => {
    const link = c.href ? ` \\href{${c.href}}{\\footnotesize (Link)}` : '';
    return `{\\footnotesize $\\bullet$ ${c.text}${link}}\\\\[2pt]`;
  }).join('\n');
  return `\\sidebartitle{${section.title}}\n${rows}\\vspace{${spacing.beforeSection}}`;
};

const renderSidebarSection = (section, spacing) => {
  if (section.kind === 'skills') return renderSidebarSkills(section, spacing);
  if (section.kind === 'certifications') return renderSidebarCertifications(section, spacing);
  return renderSidebarEducationOrCustom(section, spacing);
};

export const renderModernTemplate = (content, styleSettings) => {
  const spacing = getSpacingTokens(styleSettings.spacing);
  const preamble = buildPreamble(styleSettings);
  const header = renderHeaderBand(content.header);

  const sidebarSections = content.sections.filter((s) => SIDEBAR_SECTION_IDS.has(s.id) || s.kind === 'skills' || s.kind === 'certifications');
  const mainSections = content.sections.filter((s) => !sidebarSections.includes(s));

  const sidebarBody = sidebarSections.map((s) => renderSidebarSection(s, spacing)).join('\n\\vspace{6pt}\n');
  const mainBody = mainSections.map((s) => renderMainSection(s, spacing)).join('\n');

  return `${preamble}

\\begin{document}
${header}
\\vspace{10pt}

\\noindent
\\begin{minipage}[t]{0.32\\textwidth}
\\colorbox{accent!8}{\\begin{minipage}[t]{\\dimexpr0.32\\textwidth-2\\fboxsep}
\\vspace{4pt}
${sidebarBody}
\\vspace{4pt}
\\end{minipage}}
\\end{minipage}
\\hfill
\\begin{minipage}[t]{0.64\\textwidth}
${mainBody}
\\end{minipage}
\\end{document}
`;
};
