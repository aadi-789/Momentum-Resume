// src/components/editor/TemplatePicker.js
// Card-style selector for choosing a resume template. Presentational -
// receives the current templateId and a setter, nothing else.
import React from 'react';
import { Check } from 'lucide-react';
import { TEMPLATES } from '../../constants/resumeDefaults';

const TemplatePicker = ({ templateId, setTemplateId }) => {
  return (
    <div className="surface fade-in-up rounded-lg shadow-md mb-4 lg:mb-6 p-3 lg:p-4">
      <h2 className="font-semibold text-base lg:text-lg mb-3" style={{ color: 'var(--color-foreground)' }}>
        Template
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 lg:gap-3">
        {TEMPLATES.map((template, index) => {
          const isSelected = template.id === templateId;
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => setTemplateId(template.id)}
              className="text-left p-3 rounded-lg border-2 stagger-item bounce-in"
              style={{
                borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                backgroundColor: isSelected ? 'var(--color-primary-soft)' : 'transparent',
                boxShadow: isSelected ? 'var(--shadow-glow)' : 'none',
                transition: 'border-color var(--transition-fast), background-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast)',
                animationDelay: `${index * 60}ms`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm lg:text-base" style={{ color: 'var(--color-foreground)' }}>
                  {template.name}
                </span>
                {isSelected && <Check size={16} style={{ color: 'var(--color-primary)' }} />}
              </div>
              <p className="text-xs lg:text-sm mb-2" style={{ color: 'var(--color-foreground-secondary)' }}>
                {template.description}
              </p>
              {template.badge && (
                <span
                  className="inline-block text-[10px] lg:text-xs font-medium px-2 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--color-success-soft)', color: 'var(--color-success)' }}
                >
                  {template.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplatePicker;
