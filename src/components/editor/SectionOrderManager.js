// src/components/editor/SectionOrderManager.js
// Drag-and-drop UI for reordering resume sections. Presentational except
// for the local drag-end handler, which just delegates to setSectionOrder.
import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ChevronDown, GripVertical, Code, Briefcase, Globe, Wrench, Award, FileText } from 'lucide-react';

const SectionOrderManager = ({ sectionOrder, setSectionOrder, isOpen, setIsOpen, customSections = [] }) => {
  const sectionNames = {
    education: { name: 'Education', icon: <Code size={20} /> },
    experience: { name: 'Experience', icon: <Briefcase size={20} /> },
    projects: { name: 'Projects', icon: <Globe size={20} /> },
    skills: { name: 'Skills', icon: <Wrench size={20} /> },
    certifications: { name: 'Certifications and Achievements', icon: <Award size={20} /> },
  };

  customSections.forEach((section) => {
    sectionNames[section.id] = { name: section.title || 'Custom Section', icon: <FileText size={20} /> };
  });

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(sectionOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSectionOrder(items);
  };

  if (!isOpen) {
    return (
      <div className="surface rounded-lg shadow-md mb-4 lg:mb-6 p-3 lg:p-4">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex justify-between items-center text-left font-semibold text-base lg:text-lg"
          style={{ color: 'var(--color-foreground)' }}
        >
          <div className="flex items-center gap-2 lg:gap-3">
            <GripVertical size={window.innerWidth < 1024 ? 20 : 24} />
            <span className="truncate">Customize Section Order</span>
          </div>
          <ChevronDown size={window.innerWidth < 1024 ? 20 : 24} className="flex-shrink-0" />
        </button>
      </div>
    );
  }

  return (
    <div className="surface rounded-lg shadow-md mb-4 lg:mb-6">
      <button
        onClick={() => setIsOpen(false)}
        className="w-full flex justify-between items-center p-3 lg:p-4 text-left font-semibold text-base lg:text-lg"
        style={{ color: 'var(--color-foreground)' }}
      >
        <div className="flex items-center gap-2 lg:gap-3">
          <GripVertical size={window.innerWidth < 1024 ? 20 : 24} />
          <span className="truncate">Customize Section Order</span>
        </div>
        <ChevronDown size={window.innerWidth < 1024 ? 20 : 24} className="transform rotate-180 flex-shrink-0" />
      </button>

      <div className="p-3 lg:p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <p className="text-xs lg:text-sm mb-3 lg:mb-4" style={{ color: 'var(--color-foreground-secondary)' }}>
          Drag and drop to reorder sections. This will change the order in your generated resume.
        </p>

        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {sectionOrder.map((sectionId, index) => (
                  <Draggable key={sectionId} draggableId={sectionId} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`flex items-center gap-2 lg:gap-3 p-2 lg:p-3 surface-secondary rounded-lg border cursor-move hover:surface transition-colors ${
                          snapshot.isDragging ? 'opacity-60 transform rotate-2 shadow-lg z-1000' : ''
                        }`}
                        style={{
                          borderColor: 'var(--color-border)',
                          ...provided.draggableProps.style,
                        }}
                      >
                        <GripVertical size={14} style={{ color: 'var(--color-foreground-secondary)' }} className="flex-shrink-0" />
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {sectionNames[sectionId]?.icon}
                          <span className="font-medium text-sm lg:text-base truncate" style={{ color: 'var(--color-foreground)' }}>
                            {sectionNames[sectionId]?.name}
                          </span>
                        </div>
                        <div className="text-xs lg:text-sm flex-shrink-0" style={{ color: 'var(--color-foreground-secondary)' }}>
                          {index + 1}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="mt-3 lg:mt-4 p-2 lg:p-3 rounded-lg fade-in-up" style={{ backgroundColor: 'var(--color-primary-soft)' }}>
          <p className="text-xs lg:text-sm" style={{ color: 'var(--color-primary)' }}>
            💡 <strong>Tip:</strong> The sections will appear in your resume in the exact order shown above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectionOrderManager;
