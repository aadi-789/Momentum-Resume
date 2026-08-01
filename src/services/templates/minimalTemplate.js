// src/services/templates/minimalTemplate.js
// Template 3 - Minimal. No icons, no tables, no color - just clean,
// linear text that an ATS parser can read top-to-bottom without
// misinterpreting layout as content. Accent color is intentionally NOT
// applied here (see README note in styleSettings docs) - "plain
// black/white" was an explicit requirement for this template, and it
// takes precedence over the general accent-color setting.

import { getFontPreamble } from '../latex/fontPackages';
import { getSpacingTokens } from '../latex/spacingPresets';

const buildPreamble = (styleSettings) => {
  const { font } = styleSettings;

  return `\\documentclass[letterpaper,11pt]{article}
\\usepackage[empty]{fullpage}
\\usepackage{enumitem}
\\usepackage[english]{babel}
\\usepackage{xcolor}
${getFontPreamble(font)}

\\usepackage[
    colorlinks=true,
    linkcolor=black,
    urlcolor=black,
    pdfborder={0 0 0},
    unicode=true,
    breaklinks=true
]{hyperref}

\\pagestyle{empty}
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-0.75in}
\\addtolength{\\textheight}{1.5in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\parindent}{0pt}

\\newcommand{\\sectiontitle}[1]{\\vspace{2pt}{\\large \\bfseries \\MakeUppercase{#1}}\\\\[-3pt]\\rule{\\textwidth}{0.4pt}\\vspace{4pt}}
\\newcommand{\\entryLine}[4]{\\textbf{#1} \\hfill #2\\\\#3 \\hfill #4\\\\[2pt]}`;
};

const renderHeader = (header, spacing) => {
  const contactLine = header.contacts.map((c) => c.label).join('  |  ');
  return `\\begin{center}
{\\LARGE \\bfseries ${header.name}}\\\\[4pt]
${contactLine}
\\end{center}
\\vspace{${spacing.afterHeader}}`;
};

const renderBullets = (bullets, spacing) => {
  if (!bullets.length) return '';
  return `\\begin{itemize}[leftmargin=0.2in, itemsep=${spacing.betweenBullets}, topsep=1pt]
${bullets.map((b) => `\\item ${b}`).join('\n')}
\\end{itemize}\\vspace{${spacing.afterBulletList}}`;
};

const renderEntries = (entries, spacing) =>
  entries.map((entry) => {
    const line = `\\entryLine{${entry.heading}}{${entry.date}}{${entry.subheading}}{${entry.rightMeta}}`;
    return `${line}${renderBullets(entry.bullets, spacing)}`;
  }).join(`\\vspace{${spacing.afterEntry}}\n`);

const renderSkills = (entries) => {
  if (!entries.length) return '';
  return entries.map((s) => `\\textbf{${s.label}:} ${s.value}\\\\[2pt]`).join('\n');
};

const renderCertifications = (entries) => {
  if (!entries.length) return '';
  return `\\begin{itemize}[leftmargin=0.2in, itemsep=1pt]
${entries.map((c) => `\\item ${c.text}${c.href ? ` (${c.href})` : ''}`).join('\n')}
\\end{itemize}`;
};

const renderSection = (section, spacing) => {
  let body;
  if (section.kind === 'skills') body = renderSkills(section.entries);
  else if (section.kind === 'certifications') body = renderCertifications(section.entries);
  else body = renderEntries(section.entries, spacing);

  return `\\sectiontitle{${section.title}}\n${body}\\vspace{${spacing.beforeSection}}`;
};

export const renderMinimalTemplate = (content, styleSettings) => {
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
