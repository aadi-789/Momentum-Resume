// src/components/common/CollapsibleSection.js
// Presentational, reusable accordion wrapper. No business logic.
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const CollapsibleSection = ({ title, icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleSection = () => setIsOpen((prev) => !prev);

  return (
    <div className="surface surface-interactive fade-in-up rounded-lg mb-4 lg:mb-6 overflow-hidden">
      <button
        onClick={toggleSection}
        className="w-full flex justify-between items-center p-3 lg:p-4 text-left font-semibold text-base lg:text-lg hover:surface-secondary"
        style={{
          color: 'var(--color-foreground)',
          transition: 'background-color var(--transition-fast)',
        }}
      >
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="flex-shrink-0">
            {React.cloneElement(icon, { size: window.innerWidth < 1024 ? 20 : 24 })}
          </div>
          <span className="truncate">{title}</span>
        </div>
        <ChevronDown
          size={window.innerWidth < 1024 ? 20 : 24}
          className="flex-shrink-0"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform var(--transition-fast)',
          }}
        />
      </button>
      <div
        style={{
          maxHeight: isOpen ? '2000px' : '0px',
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          overflow: isOpen ? 'visible' : 'hidden',
          transition: 'max-height var(--transition-fast) ease-in-out, opacity var(--transition-fast) ease-in-out',
        }}
      >
        <div className="p-3 lg:p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSection;
