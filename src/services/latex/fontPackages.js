// src/services/latex/fontPackages.js
// Maps a user-facing font choice to the LaTeX package(s) needed to render
// it. Only well-established, widely-available TeXLive packages are used so
// the public compiler API can always find them.

export const FONT_OPTIONS = [
  { id: 'latin-modern', label: 'Latin Modern (default)' },
  { id: 'charter', label: 'Charter (serif, elegant)' },
  { id: 'sans', label: 'Sans-serif (modern)' },
];

export const DEFAULT_FONT = 'latin-modern';

const FONT_PREAMBLE = {
  'latin-modern': '\\usepackage{lmodern}',
  charter: '\\usepackage{charter}',
  sans: '\\usepackage{helvet}\n\\renewcommand{\\familydefault}{\\sfdefault}',
};

export const getFontPreamble = (fontId) => FONT_PREAMBLE[fontId] || FONT_PREAMBLE[DEFAULT_FONT];
