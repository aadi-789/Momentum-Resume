// src/components/editor/StyleSettingsPanel.js
// Small settings panel for font / accent color / spacing density. These
// are global style choices (not per-section), so they live in their own
// panel rather than inside any CollapsibleSection.
import React from 'react';
import { FONT_OPTIONS } from '../../services/latex/fontPackages';
import { SPACING_DENSITY_OPTIONS } from '../../constants/resumeDefaults';

const StyleSettingsPanel = ({ styleSettings, updateStyleSetting, templateId }) => {
  const isMinimal = templateId === 'minimal';

  return (
    <div className="surface fade-in-up rounded-lg shadow-md mb-4 lg:mb-6 p-3 lg:p-4">
      <h2 className="font-semibold text-base lg:text-lg mb-3" style={{ color: 'var(--color-foreground)' }}>
        Style
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
        <div>
          <label className="block text-xs lg:text-sm font-medium mb-1" style={{ color: 'var(--color-foreground-secondary)' }}>
            Font
          </label>
          <select
            value={styleSettings.font}
            onChange={(e) => updateStyleSetting('font', e.target.value)}
            className="input-field w-full p-2 text-sm lg:text-base rounded-lg focus:outline-none"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs lg:text-sm font-medium mb-1" style={{ color: 'var(--color-foreground-secondary)' }}>
            Accent Color {isMinimal && <span className="opacity-60">(unused in Minimal)</span>}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={styleSettings.accentColor}
              onChange={(e) => updateStyleSetting('accentColor', e.target.value)}
              disabled={isMinimal}
              className="h-9 w-12 rounded cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title={isMinimal ? 'Minimal template stays black & white for maximum ATS compatibility' : 'Pick an accent color'}
            />
            <span className="text-xs lg:text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
              {styleSettings.accentColor}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs lg:text-sm font-medium mb-1" style={{ color: 'var(--color-foreground-secondary)' }}>
            Spacing
          </label>
          <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--color-border)' }}>
            {SPACING_DENSITY_OPTIONS.map((opt) => {
              const isActive = styleSettings.spacing === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateStyleSetting('spacing', opt.id)}
                  className="flex-1 px-2 py-2 text-xs lg:text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                    color: isActive ? '#fff' : 'var(--color-foreground)',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {isMinimal && (
        <p className="text-xs lg:text-sm mt-3" style={{ color: 'var(--color-foreground-secondary)' }}>
          The Minimal template ignores the accent color by design — it always renders in plain black &amp; white for maximum ATS compatibility.
        </p>
      )}
    </div>
  );
};

export default StyleSettingsPanel;
