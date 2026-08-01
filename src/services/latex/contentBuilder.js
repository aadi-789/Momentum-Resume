// src/services/latex/contentBuilder.js
// Turns raw resumeData + sectionOrder into a template-agnostic content tree.
// All user text is escaped here ONCE, so classic/modern/minimal templates
// never touch escapeLatex directly - they just place already-safe strings.
// This is what lets three very different visual layouts share one source
// of truth (and automatically support Phase 1 custom sections).

import { escapeLatex } from '../../utils/latexEscape';
import { ensureHttpProtocol } from '../../utils/urlHelpers';

const CONTACT_DEFS = [
  { key: 'email', icon: 'envelope', label: (v) => escapeLatex(v), href: (v) => `mailto:${v}` },
  { key: 'phone', icon: 'phone', label: (v) => escapeLatex(v), href: (v) => `tel:${v.replace(/[^\d+]/g, '')}` },
  { key: 'linkedin', icon: 'linkedin', label: () => 'LinkedIn', href: (v) => ensureHttpProtocol(v) },
  { key: 'github', icon: 'github', label: () => 'GitHub', href: (v) => ensureHttpProtocol(v) },
  { key: 'portfolio', icon: 'code', label: () => 'Portfolio', href: (v) => ensureHttpProtocol(v) },
  { key: 'leetcode', icon: 'code-branch', label: () => 'LeetCode', href: (v) => ensureHttpProtocol(v) },
];

const buildHeader = (personalInfo) => {
  const contacts = CONTACT_DEFS
    .filter((def) => personalInfo[def.key] && personalInfo[def.key].trim() !== '')
    .map((def) => ({
      icon: def.icon,
      label: def.label(personalInfo[def.key]),
      href: def.href(personalInfo[def.key]),
    }));

  return {
    name: escapeLatex(personalInfo.name) || 'Your Name',
    contacts,
  };
};

const buildEducationEntries = (education) =>
  (education || [])
    .filter((e) => e && e.institution)
    .map((edu) => ({
      heading: escapeLatex(edu.institution),
      date: escapeLatex(edu.duration),
      subheading: escapeLatex(edu.degree),
      rightMeta: edu.cgpa ? escapeLatex(edu.cgpa) : '',
      bullets: edu.coursework
        ? [`\\textit{Relevant Coursework:} ${escapeLatex(edu.coursework)}`]
        : [],
    }));

const buildExperienceEntries = (experience) =>
  (experience || [])
    .filter((e) => e && e.company)
    .map((exp) => ({
      heading: escapeLatex(exp.company),
      date: escapeLatex(exp.duration),
      subheading: escapeLatex(exp.position),
      rightMeta: escapeLatex(exp.location),
      bullets: (exp.achievements || []).filter((a) => a.trim() !== '').map(escapeLatex),
    }));

const buildProjectEntries = (projects) =>
  (projects || [])
    .filter((p) => p && p.name && p.name.trim() !== '')
    .map((proj) => {
      const links = [];
      if (proj.github && proj.github.trim() !== '') {
        links.push(`\\href{${ensureHttpProtocol(proj.github)}}{\\textcolor{accent}{(GitHub)}}`);
      }
      if (proj.livesite && proj.livesite.trim() !== '') {
        links.push(`\\href{${ensureHttpProtocol(proj.livesite)}}{\\textcolor{accent}{(Live Site)}}`);
      }
      const linkString = links.join(' ');
      const techWithLinks = proj.technologies
        ? `${escapeLatex(proj.technologies)}${linkString ? ' ' + linkString : ''}`
        : linkString;

      return {
        heading: escapeLatex(proj.name),
        date: '',
        subheading: techWithLinks,
        rightMeta: '',
        bullets: (proj.description || []).filter((d) => d && d.trim() !== '').map(escapeLatex),
      };
    });

const buildSkillsEntries = (skills) =>
  Object.entries(skills || {})
    .filter(([, value]) => value && value.trim() !== '')
    .map(([key, value]) => ({
      label: escapeLatex(key.charAt(0).toUpperCase() + key.slice(1)),
      value: escapeLatex(value),
    }));

const buildCertificationEntries = (certifications) =>
  (certifications || [])
    .filter((c) => c && c.name && c.name.trim() !== '')
    .map((cert) => ({
      text: escapeLatex(cert.name),
      href: cert.link && cert.link.trim() !== '' ? ensureHttpProtocol(cert.link) : null,
    }));

const buildCustomEntries = (section) =>
  (section.items || [])
    .filter((item) => item && (item.heading || item.subheading))
    .map((item) => ({
      heading: escapeLatex(item.heading || ''),
      date: escapeLatex(item.date || ''),
      subheading: escapeLatex(item.subheading || ''),
      rightMeta: '',
      bullets: (item.description || []).filter((d) => d && d.trim() !== '').map(escapeLatex),
    }));

const SECTION_LABELS = {
  education: 'Education',
  experience: 'Experience',
  projects: 'Projects',
  skills: 'Skills',
  certifications: 'Certifications \\& Achievements',
};

/**
 * Builds the full, template-agnostic content tree for a resume.
 * Returns { header, sections: [{ id, title, kind, entries }] }
 * kind is one of: 'entries' | 'skills' | 'certifications'
 */
export const buildResumeContent = (resumeData, sectionOrder) => {
  const header = buildHeader(resumeData.personalInfo);

  const builders = {
    education: () => ({ kind: 'entries', title: SECTION_LABELS.education, entries: buildEducationEntries(resumeData.education) }),
    experience: () => ({ kind: 'entries', title: SECTION_LABELS.experience, entries: buildExperienceEntries(resumeData.experience) }),
    projects: () => ({ kind: 'entries', title: SECTION_LABELS.projects, entries: buildProjectEntries(resumeData.projects) }),
    skills: () => ({ kind: 'skills', title: SECTION_LABELS.skills, entries: buildSkillsEntries(resumeData.skills) }),
    certifications: () => ({ kind: 'certifications', title: SECTION_LABELS.certifications, entries: buildCertificationEntries(resumeData.certifications) }),
  };

  (resumeData.customSections || []).forEach((section) => {
    builders[section.id] = () => ({
      kind: 'entries',
      title: escapeLatex(section.title || 'Custom Section'),
      entries: buildCustomEntries(section),
    });
  });

  const sections = sectionOrder
    .filter((id) => !!builders[id])
    .map((id) => ({ id, ...builders[id]() }))
    .filter((section) => section.entries.length > 0);

  return { header, sections };
};
