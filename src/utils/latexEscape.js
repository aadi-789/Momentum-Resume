// src/utils/latexEscape.js
// Pure helper for escaping user-entered text into safe LaTeX.
// No React / component logic belongs here.

/**
 * Escapes special LaTeX characters in a string while preserving
 * *bold* markdown-style syntax by converting it to \textbf{}.
 */
export const escapeLatex = (str) => {
  if (typeof str !== 'string') return '';

  let result = str.replace(/\*([^*]+)\*/g, '\\textbf{$1}');

  const parts = result.split(/(\\textbf\{[^}]*\})/);

  result = parts.map((part, index) => {
    if (index % 2 === 1) {
      return part;
    }

    return part
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/&/g, '\\&')
      .replace(/%/g, '\\%')
      .replace(/\$/g, '\\$')
      .replace(/#/g, '\\#')
      .replace(/_/g, '\\_')
      .replace(/{/g, '\\{')
      .replace(/}/g, '\\}')
      .replace(/~/g, '\\textasciitilde{}')
      .replace(/\^/g, '\\textasciicircum{}');
  }).join('');

  return result;
};
