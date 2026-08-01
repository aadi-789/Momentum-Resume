// src/services/latex/spacingPresets.js
// Vertical-spacing tokens keyed by density. Templates plug these values
// into their \vspace{} calls at the handful of structural points that
// actually matter for perceived density (after header, between sections,
// between entries, after bullet lists) rather than hand-tuning every line.

export const SPACING_PRESETS = {
  compact: {
    afterHeader: '-16pt',
    beforeSection: '-12pt',
    afterEntry: '-6pt',
    afterBulletList: '-10pt',
    betweenBullets: '-3pt',
  },
  normal: {
    afterHeader: '-13pt',
    beforeSection: '-8pt',
    afterEntry: '-2pt',
    afterBulletList: '-8pt',
    betweenBullets: '-2pt',
  },
  spacious: {
    afterHeader: '-6pt',
    beforeSection: '-2pt',
    afterEntry: '4pt',
    afterBulletList: '-2pt',
    betweenBullets: '0pt',
  },
};

export const DEFAULT_SPACING = 'normal';

export const getSpacingTokens = (density) => SPACING_PRESETS[density] || SPACING_PRESETS[DEFAULT_SPACING];
