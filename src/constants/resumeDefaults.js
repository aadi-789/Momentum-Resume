// src/constants/resumeDefaults.js
// Single source of truth for the resume's initial/default shape.
// Previously this object literal was duplicated in two places inside
// Resume.js (initial state + clearFormData) and could drift out of sync.

export const DEFAULT_RESUME_DATA = {
  personalInfo: { name: '', email: '', phone: '', linkedin: '', github: '', portfolio: '', leetcode: '' },
  education: [{ institution: '', duration: '', degree: '', cgpa: '', coursework: '' }],
  experience: [{ company: '', duration: '', position: '', location: '', achievements: [''] }],
  projects: [{ name: '', technologies: '', github: '', livesite: '', description: [''] }],
  skills: { expertise: '', languages: '', frameworks: '', tools: '', professional: '' },
  certifications: [{ name: '', link: '' }],
  customSections: [],
};

export const DEFAULT_SECTION_ORDER = [
  'education',
  'projects',
  'experience',
  'skills',
  'certifications',
];

export const STORAGE_KEYS = {
  RESUME_DATA: 'resumeData',
  SECTION_ORDER: 'sectionOrder',
  THEME: 'theme',
  TEMPLATE: 'resumeTemplate',
  STYLE_SETTINGS: 'resumeStyleSettings',
};

// --- Phase 2: templates ---

export const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Single-column, ATS-friendly. The safest choice for most job applications.',
    badge: 'Recommended — ATS-friendly',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Two-column layout with an accent-colored header and sidebar.',
    badge: null,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'No icons, no color, no tables - maximum ATS compatibility.',
    badge: null,
  },
];

export const DEFAULT_TEMPLATE_ID = 'classic';

// --- Phase 3: style customization ---

export const DEFAULT_STYLE_SETTINGS = {
  font: 'latin-modern',
  accentColor: '#2563EB',
  spacing: 'normal',
};

export const SPACING_DENSITY_OPTIONS = [
  { id: 'compact', label: 'Compact' },
  { id: 'normal', label: 'Normal' },
  { id: 'spacious', label: 'Spacious' },
];
