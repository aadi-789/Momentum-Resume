// src/services/latexService.js
// Orchestrator: builds template-agnostic content once, then delegates
// rendering to whichever template the user picked. No React dependency -
// stays unit-testable and reusable outside components.

import { buildResumeContent } from './latex/contentBuilder';
import { renderClassicTemplate } from './templates/classicTemplate';
import { renderModernTemplate } from './templates/modernTemplate';
import { renderMinimalTemplate } from './templates/minimalTemplate';

const TEMPLATE_RENDERERS = {
  classic: renderClassicTemplate,
  modern: renderModernTemplate,
  minimal: renderMinimalTemplate,
};

/**
 * Builds the full LaTeX document string for the given resume data, section
 * order (including custom sections), chosen template, and style settings
 * (font / accentColor / spacing).
 */
export const generateFullLatex = (resumeData, sectionOrder, templateId = 'classic', styleSettings = {}) => {
  const content = buildResumeContent(resumeData, sectionOrder);
  const renderer = TEMPLATE_RENDERERS[templateId] || TEMPLATE_RENDERERS.classic;
  return renderer(content, styleSettings);
};
