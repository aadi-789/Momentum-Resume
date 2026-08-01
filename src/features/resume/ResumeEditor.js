/* src/features/resume/ResumeEditor.js */
// Page-level component: renders layout, connects hooks, passes props.
// All LaTeX generation, PDF export, and storage logic now live in
// services/ and hooks/ - this file only owns form UI + form state.

import React, { useState } from 'react';
import {
  Globe, Code, FileText, Plus, Trash2,
  Download, Loader, AlertTriangle, RefreshCw, Briefcase, Wrench, Award,
} from 'lucide-react';

import ThemeToggle from '../../components/common/ThemeToggle';
import CollapsibleSection from '../../components/common/CollapsibleSection';
import SectionOrderManager from '../../components/editor/SectionOrderManager';
import TemplatePicker from '../../components/editor/TemplatePicker';
import StyleSettingsPanel from '../../components/editor/StyleSettingsPanel';

import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useResumeExport } from '../../hooks/useResumeExport';

import {
  DEFAULT_RESUME_DATA, DEFAULT_SECTION_ORDER, STORAGE_KEYS,
  DEFAULT_TEMPLATE_ID, DEFAULT_STYLE_SETTINGS,
} from '../../constants/resumeDefaults';

const ResumeEditor = () => {
  const [resumeData, setResumeData] = useLocalStorage(STORAGE_KEYS.RESUME_DATA, DEFAULT_RESUME_DATA);
  const [sectionOrder, setSectionOrder] = useLocalStorage(STORAGE_KEYS.SECTION_ORDER, DEFAULT_SECTION_ORDER);
  const [templateId, setTemplateId] = useLocalStorage(STORAGE_KEYS.TEMPLATE, DEFAULT_TEMPLATE_ID);
  const [styleSettings, setStyleSettings] = useLocalStorage(STORAGE_KEYS.STYLE_SETTINGS, DEFAULT_STYLE_SETTINGS);
  const [sectionOrderOpen, setSectionOrderOpen] = useState(false);

  const updateStyleSetting = (field, value) => setStyleSettings((prev) => ({ ...prev, [field]: value }));

  const { pdfUrl, isCompiling, compilationError } = useResumeExport(resumeData, sectionOrder, templateId, styleSettings);

  const clearFormData = () => {
    localStorage.removeItem(STORAGE_KEYS.RESUME_DATA);
    localStorage.removeItem(STORAGE_KEYS.SECTION_ORDER);
    localStorage.removeItem(STORAGE_KEYS.TEMPLATE);
    localStorage.removeItem(STORAGE_KEYS.STYLE_SETTINGS);
    setResumeData(DEFAULT_RESUME_DATA);
    setSectionOrder(DEFAULT_SECTION_ORDER);
    setTemplateId(DEFAULT_TEMPLATE_ID);
    setStyleSettings(DEFAULT_STYLE_SETTINGS);
  };

  // --- Data Update Functions (preserved exactly as original) ---
  const updatePersonalInfo = (field, value) => setResumeData(p => ({ ...p, personalInfo: { ...p.personalInfo, [field]: value } }));
  const addEducation = () => setResumeData(p => ({ ...p, education: [...p.education, { institution: '', duration: '', degree: '', cgpa: '', coursework: '' }] }));
  const removeEducation = index => setResumeData(p => ({ ...p, education: p.education.filter((_, i) => i !== index) }));
  const updateEducation = (index, field, value) => setResumeData(p => ({ ...p, education: p.education.map((e, i) => i === index ? { ...e, [field]: value } : e) }));
  const addExperience = () => setResumeData(p => ({ ...p, experience: [...p.experience, { company: '', duration: '', position: '', location: '', achievements: [''] }] }));
  const removeExperience = index => setResumeData(p => ({ ...p, experience: p.experience.filter((_, i) => i !== index) }));
  const updateExperience = (index, field, value) => setResumeData(p => ({ ...p, experience: p.experience.map((e, i) => i === index ? { ...e, [field]: value } : e) }));
  const addExperienceAchievement = expIndex => setResumeData(p => ({ ...p, experience: p.experience.map((e, i) => i === expIndex ? { ...e, achievements: [...e.achievements, ''] } : e) }));
  const removeExperienceAchievement = (expIndex, achIndex) => setResumeData(p => ({ ...p, experience: p.experience.map((e, i) => i === expIndex ? { ...e, achievements: e.achievements.filter((_, j) => j !== achIndex) } : e) }));
  const updateExperienceAchievement = (expIndex, achIndex, value) => setResumeData(p => ({ ...p, experience: p.experience.map((e, i) => i === expIndex ? { ...e, achievements: e.achievements.map((a, j) => j === achIndex ? value : a) } : e) }));
  const addProject = () => setResumeData(p => ({ ...p, projects: [...p.projects, { name: '', technologies: '', github: '', livesite: '', description: [''] }] }));
  const removeProject = index => setResumeData(p => ({ ...p, projects: p.projects.filter((_, i) => i !== index) }));
  const updateProject = (index, field, value) => setResumeData(p => ({ ...p, projects: p.projects.map((proj, i) => i === index ? { ...proj, [field]: value } : proj) }));
  const addProjectDescription = projIndex => setResumeData(p => ({ ...p, projects: p.projects.map((proj, i) => i === projIndex ? { ...proj, description: [...proj.description, ''] } : proj) }));
  const removeProjectDescription = (projIndex, descIndex) => setResumeData(p => ({ ...p, projects: p.projects.map((proj, i) => i === projIndex ? { ...proj, description: proj.description.filter((_, j) => j !== descIndex) } : proj) }));
  const updateProjectDescription = (projIndex, descIndex, value) => setResumeData(p => ({ ...p, projects: p.projects.map((proj, i) => i === projIndex ? { ...proj, description: proj.description.map((d, j) => j === descIndex ? value : d) } : proj) }));
  const updateSkills = (field, value) => setResumeData(p => ({ ...p, skills: { ...p.skills, [field]: value } }));
  const addCertification = () => setResumeData(p => ({ ...p, certifications: [...p.certifications, { name: '', link: '' }] }));
  const removeCertification = index => setResumeData(p => ({ ...p, certifications: p.certifications.filter((_, i) => i !== index) }));
  const updateCertification = (index, field, value) => setResumeData(p => ({
    ...p,
    certifications: p.certifications.map((c, i) => i === index ? { ...c, [field]: value } : c),
  }));

  // Custom section CRUD functions
  const addCustomSection = () => {
    const newId = `custom-${Date.now()}`;
    setResumeData(p => ({
      ...p,
      customSections: [...(p.customSections || []), { id: newId, title: 'New Section', items: [{ heading: '', subheading: '', date: '', description: [''] }] }],
    }));
    setSectionOrder(prev => [...prev, newId]);
  };

  const removeCustomSection = (sectionId) => {
    setResumeData(p => ({
      ...p,
      customSections: (p.customSections || []).filter(s => s.id !== sectionId),
    }));
    setSectionOrder(prev => prev.filter(id => id !== sectionId));
  };

  const updateCustomSectionTitle = (sectionId, title) => setResumeData(p => ({
    ...p,
    customSections: (p.customSections || []).map(s => s.id === sectionId ? { ...s, title } : s),
  }));

  const addCustomItem = (sectionId) => setResumeData(p => ({
    ...p,
    customSections: (p.customSections || []).map(s => s.id === sectionId
      ? { ...s, items: [...s.items, { heading: '', subheading: '', date: '', description: [''] }] }
      : s),
  }));

  const removeCustomItem = (sectionId, itemIndex) => setResumeData(p => ({
    ...p,
    customSections: (p.customSections || []).map(s => s.id === sectionId
      ? { ...s, items: s.items.filter((_, i) => i !== itemIndex) }
      : s),
  }));

  const updateCustomItem = (sectionId, itemIndex, field, value) => setResumeData(p => ({
    ...p,
    customSections: (p.customSections || []).map(s => s.id === sectionId
      ? { ...s, items: s.items.map((it, i) => i === itemIndex ? { ...it, [field]: value } : it) }
      : s),
  }));

  const addCustomItemBullet = (sectionId, itemIndex) => setResumeData(p => ({
    ...p,
    customSections: (p.customSections || []).map(s => s.id === sectionId
      ? { ...s, items: s.items.map((it, i) => i === itemIndex ? { ...it, description: [...it.description, ''] } : it) }
      : s),
  }));

  const removeCustomItemBullet = (sectionId, itemIndex, bulletIndex) => setResumeData(p => ({
    ...p,
    customSections: (p.customSections || []).map(s => s.id === sectionId
      ? { ...s, items: s.items.map((it, i) => i === itemIndex ? { ...it, description: it.description.filter((_, j) => j !== bulletIndex) } : it) }
      : s),
  }));

  const updateCustomItemBullet = (sectionId, itemIndex, bulletIndex, value) => setResumeData(p => ({
    ...p,
    customSections: (p.customSections || []).map(s => s.id === sectionId
      ? { ...s, items: s.items.map((it, i) => i === itemIndex ? { ...it, description: it.description.map((d, j) => j === bulletIndex ? value : d) } : it) }
      : s),
  }));

  // Generate sections dynamically based on section order
  const renderSectionByType = (sectionType) => {
    switch (sectionType) {
      case 'education':
        return (
          <CollapsibleSection key="education" title="Education" icon={<Code size={24} />} defaultOpen={true}>
            <div className="flex justify-end mb-3 lg:mb-4">
              <button onClick={addEducation} className="btn-primary flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-2 rounded-lg text-xs lg:text-sm font-medium">
                <Plus size={14} /> Add Education
              </button>
            </div>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="border-t pt-3 lg:pt-4 mt-3 lg:mt-4 first:border-t-0 first:mt-0" style={{ borderColor: 'var(--color-border)' }}>
                {resumeData.education.length > 1 && (
                  <div className="flex justify-end mb-2">
                    <button onClick={() => removeEducation(index)} className="text-red-500 hover:text-red-700 p-1 rounded" title="Remove Education">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                  <input type="text" placeholder="Institution Name" value={edu.institution} onChange={(e) => updateEducation(index, 'institution', e.target.value)} className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" />
                  <input type="text" placeholder="Duration (e.g., Sep 2020 - Present)" value={edu.duration} onChange={(e) => updateEducation(index, 'duration', e.target.value)} className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" />
                  <input type="text" placeholder="Degree & Specialization" value={edu.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" />
                  <input type="text" placeholder="Grade (CGPA or %)" value={edu.cgpa} onChange={(e) => updateEducation(index, 'cgpa', e.target.value)} className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" />
                </div>
                <textarea placeholder="Relevant Coursework (comma-separated)" value={edu.coursework} onChange={(e) => updateEducation(index, 'coursework', e.target.value)} rows={2} className="input-field w-full p-2 lg:p-3 text-sm lg:text-base rounded-lg mt-3 lg:mt-4 focus:outline-none resize-none" />
              </div>
            ))}
          </CollapsibleSection>
        );

      case 'experience':
        return (
          <CollapsibleSection key="experience" title="Experience" icon={<Briefcase size={24} />} defaultOpen={true}>
            <div className="flex justify-end mb-3 lg:mb-4">
              <button onClick={addExperience} className="btn-primary flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-2 rounded-lg text-xs lg:text-sm font-medium">
                <Plus size={14} /> Add Experience
              </button>
            </div>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="border-t pt-3 lg:pt-4 mt-3 lg:mt-4 first:border-t-0 first:mt-0" style={{ borderColor: 'var(--color-border)' }}>
                {resumeData.experience.length > 1 && (
                  <div className="flex justify-end mb-2">
                    <button onClick={() => removeExperience(index)} className="text-red-500 hover:text-red-700 p-1 rounded" title="Remove Experience">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 mb-3 lg:mb-4">
                  <input type="text" placeholder="Company Name" value={exp.company} onChange={e => updateExperience(index, 'company', e.target.value)} className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" />
                  <input type="text" placeholder="Duration (e.g., May 2025 – June 2025)" value={exp.duration} onChange={e => updateExperience(index, 'duration', e.target.value)} className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" />
                  <input type="text" placeholder="Position/Role" value={exp.position} onChange={e => updateExperience(index, 'position', e.target.value)} className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" />
                  <input type="text" placeholder="Location (e.g., New Delhi)" value={exp.location} onChange={e => updateExperience(index, 'location', e.target.value)} className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" />
                </div>
                <div className="space-y-2 lg:space-y-3">
                  <label className="font-medium text-xs lg:text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>Achievements/Responsibilities:</label>
                  {exp.achievements.map((ach, achIndex) => (
                    <div key={achIndex} className="flex items-start gap-2">
                      <textarea placeholder="Describe an achievement" value={ach} onChange={e => updateExperienceAchievement(index, achIndex, e.target.value)} rows={2} className="input-field flex-1 p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none resize-none" />
                      {exp.achievements.length > 1 && (
                        <button onClick={() => removeExperienceAchievement(index, achIndex)} className="text-red-500 hover:text-red-700 mt-2 p-1 rounded" title="Remove Achievement">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => addExperienceAchievement(index)} className="text-blue-600 hover:text-blue-800 text-xs lg:text-sm font-medium">+ Add Achievement</button>
                </div>
              </div>
            ))}
          </CollapsibleSection>
        );

      case 'projects':
        return (
          <CollapsibleSection key="projects" title="Projects" icon={<Globe size={24} />} defaultOpen={true}>
            <div className="flex justify-end mb-3 lg:mb-4">
              <button onClick={addProject} className="btn-primary flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-2 rounded-lg text-xs lg:text-sm font-medium">
                <Plus size={14} /> Add Project
              </button>
            </div>
            {resumeData.projects.map((proj, index) => (
              <div key={index} className="border-t pt-3 lg:pt-4 mt-3 lg:mt-4 first:border-t-0 first:mt-0" style={{ borderColor: 'var(--color-border)' }}>
                {resumeData.projects.length > 1 && (
                  <div className="flex justify-end mb-2">
                    <button onClick={() => removeProject(index)} className="text-red-500 hover:text-red-700 p-1 rounded" title="Remove Project">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 mb-3 lg:mb-4">
                  <input type="text" placeholder="Project Name" value={proj.name} onChange={e => updateProject(index, 'name', e.target.value)} className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg md:col-span-2 focus:outline-none" />
                  <input type="text" placeholder="Technologies Used" value={proj.technologies} onChange={e => updateProject(index, 'technologies', e.target.value)} className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg md:col-span-2 focus:outline-none" />
                  <input type="url" placeholder="GitHub Repository URL" value={proj.github} onChange={e => updateProject(index, 'github', e.target.value)} className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" />
                  <input type="url" placeholder="Live Site URL" value={proj.livesite} onChange={e => updateProject(index, 'livesite', e.target.value)} className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" />
                </div>
                <div className="space-y-2 lg:space-y-3">
                  <label className="font-medium text-xs lg:text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>Description:</label>
                  {proj.description.map((desc, descIndex) => (
                    <div key={descIndex} className="flex items-start gap-2">
                      <textarea placeholder="Describe the project and your contributions" value={desc} onChange={e => updateProjectDescription(index, descIndex, e.target.value)} rows={2} className="input-field flex-1 p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none resize-none" />
                      {proj.description.length > 1 && (
                        <button onClick={() => removeProjectDescription(index, descIndex)} className="text-red-500 hover:text-red-700 mt-2 p-1 rounded" title="Remove Description">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => addProjectDescription(index)} className="text-blue-600 hover:text-blue-800 text-xs lg:text-sm font-medium">+ Add Description Point</button>
                </div>
              </div>
            ))}
          </CollapsibleSection>
        );

      case 'skills':
        return (
          <CollapsibleSection key="skills" title="Skills" icon={<Wrench size={24} />} defaultOpen={true}>
            <div className="space-y-3 lg:space-y-4">
              <textarea placeholder="Expertise" value={resumeData.skills.expertise} onChange={(e) => updateSkills('expertise', e.target.value)} rows={2} className="input-field w-full p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none resize-none" />
              <textarea placeholder="Languages" value={resumeData.skills.languages} onChange={(e) => updateSkills('languages', e.target.value)} rows={2} className="input-field w-full p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none resize-none" />
              <textarea placeholder="Frameworks & Technologies" value={resumeData.skills.frameworks} onChange={(e) => updateSkills('frameworks', e.target.value)} rows={2} className="input-field w-full p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none resize-none" />
              <textarea placeholder="Developer Tools" value={resumeData.skills.tools} onChange={(e) => updateSkills('tools', e.target.value)} rows={2} className="input-field w-full p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none resize-none" />
              <textarea placeholder="Professional Skills" value={resumeData.skills.professional} onChange={(e) => updateSkills('professional', e.target.value)} rows={2} className="input-field w-full p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none resize-none" />
            </div>
          </CollapsibleSection>
        );

      case 'certifications':
        return (
          <CollapsibleSection key="certifications" title="Certifications & Achievements" icon={<Award size={24} />} defaultOpen={true}>
            <div className="flex justify-end mb-3 lg:mb-4">
              <button onClick={addCertification} className="btn-primary flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-2 rounded-lg text-xs lg:text-sm font-medium">
                <Plus size={14} /> Add Certification
              </button>
            </div>
            <div className="space-y-3 lg:space-y-4">
              {resumeData.certifications.map((cert, index) => (
                <div key={index} className="border-t pt-3 lg:pt-4 first:border-t-0 first:pt-0" style={{ borderColor: 'var(--color-border)' }}>
                  {resumeData.certifications.length > 1 && (
                    <div className="flex justify-end mb-2">
                      <button onClick={() => removeCertification(index)} className="text-red-500 hover:text-red-700 p-1 rounded" title="Remove Certification">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                    <textarea placeholder="Certification name, issuing organization, etc." value={cert.name} onChange={(e) => updateCertification(index, 'name', e.target.value)} rows={2} className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none resize-none" />
                    <input type="url" placeholder="Certification Link (optional)" value={cert.link} onChange={(e) => updateCertification(index, 'link', e.target.value)} className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" />
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        );

      default: {
        // Handle custom (user-added) sections
        if (typeof sectionType === 'string' && sectionType.startsWith('custom-')) {
          const section = (resumeData.customSections || []).find(s => s.id === sectionType);
          if (!section) return null;

          return (
            <CollapsibleSection key={section.id} title={section.title || 'Custom Section'} icon={<FileText size={24} />} defaultOpen={true}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 lg:mb-4">
                <input type="text" placeholder="Section Title (e.g., Publications, Volunteering, Languages)" value={section.title} onChange={(e) => updateCustomSectionTitle(section.id, e.target.value)} className="input-field flex-1 p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none w-full" />
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => addCustomItem(section.id)} className="btn-primary flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-2 rounded-lg text-xs lg:text-sm font-medium whitespace-nowrap">
                    <Plus size={14} /> Add Entry
                  </button>
                  <button onClick={() => removeCustomSection(section.id)} className="text-red-500 hover:text-red-700 p-2 rounded" title="Remove Section">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="border-t pt-3 lg:pt-4 mt-3 lg:mt-4 first:border-t-0 first:mt-0" style={{ borderColor: 'var(--color-border)' }}>
                  {section.items.length > 1 && (
                    <div className="flex justify-end mb-2">
                      <button onClick={() => removeCustomItem(section.id, itemIndex)} className="text-red-500 hover:text-red-700 p-1 rounded" title="Remove Entry">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                    <input type="text" placeholder="Title (e.g., Paper name, Organization, Language)" value={item.heading} onChange={(e) => updateCustomItem(section.id, itemIndex, 'heading', e.target.value)} className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" />
                    <input type="text" placeholder="Date / Duration (optional)" value={item.date} onChange={(e) => updateCustomItem(section.id, itemIndex, 'date', e.target.value)} className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" />
                    <input type="text" placeholder="Subtitle (e.g., Publisher, Role, Proficiency level)" value={item.subheading} onChange={(e) => updateCustomItem(section.id, itemIndex, 'subheading', e.target.value)} className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none md:col-span-2" />
                  </div>
                  <div className="space-y-2 lg:space-y-3 mt-3 lg:mt-4">
                    <label className="font-medium text-xs lg:text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>Details (optional bullet points):</label>
                    {item.description.map((desc, descIndex) => (
                      <div key={descIndex} className="flex items-start gap-2">
                        <textarea placeholder="Add a detail or bullet point" value={desc} onChange={(e) => updateCustomItemBullet(section.id, itemIndex, descIndex, e.target.value)} rows={2} className="input-field flex-1 p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none resize-none" />
                        {item.description.length > 1 && (
                          <button onClick={() => removeCustomItemBullet(section.id, itemIndex, descIndex)} className="text-red-500 hover:text-red-700 mt-2 p-1 rounded" title="Remove Detail">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button onClick={() => addCustomItemBullet(section.id, itemIndex)} className="text-blue-600 hover:text-blue-800 text-xs lg:text-sm font-medium">+ Add Detail</button>
                  </div>
                </div>
              ))}
            </CollapsibleSection>
          );
        }
        return null;
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="w-full lg:w-1/2 flex flex-col form-section" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="form-container scrollable-content">
          <div className="form-content-wrapper">
            <div className="flex justify-between items-center mb-4 lg:mb-8 sticky top-0 z-10 bg-opacity-95 backdrop-blur-sm p-2 -m-2 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
              <div className="truncate pr-2">
                <h1 className="text-xl lg:text-3xl font-bold" style={{ color: 'var(--color-foreground)' }}>
                  Momentum Resume
                </h1>
                <div className="text-xs lg:text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
                  <span className="opacity-60">Created by </span>
                  <span className="font-medium">Alok Tiwari</span>
                </div>
              </div>

              <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
                <ThemeToggle />
                {pdfUrl && (
                  <a href={pdfUrl} download="resume.pdf" className="btn-primary flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium">
                    <Download size={14} />
                    <span className="hidden sm:inline">Download</span>
                  </a>
                )}
                <button onClick={clearFormData} className="btn-secondary flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium" title="Clear all saved form data">
                  <RefreshCw size={14} />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              </div>
            </div>

            <div className="p-3 lg:p-4 rounded-lg mb-4 lg:mb-6 fade-in-up" style={{ backgroundColor: 'var(--color-success-soft)', color: 'var(--color-success)' }}>
              <p className="text-sm lg:text-base">
                💾 <strong>Auto-Save:</strong> Your form data is automatically saved as you type and will persist even if you close the browser or reload the page.
              </p>
            </div>

            <div className="p-3 lg:p-4 rounded-lg mb-4 lg:mb-6 fade-in-up" style={{ backgroundColor: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
              <p className="text-sm lg:text-base">
                💡 <strong>Tip:</strong> You can now make text bold by enclosing it in asterisks. For example, writing `*your text here*` will render as <strong>your text here</strong>.
              </p>
            </div>

            <div className="space-y-4 lg:space-y-6 pb-8">
              <TemplatePicker templateId={templateId} setTemplateId={setTemplateId} />

              <StyleSettingsPanel
                styleSettings={styleSettings}
                updateStyleSetting={updateStyleSetting}
                templateId={templateId}
              />

              <SectionOrderManager
                sectionOrder={sectionOrder}
                setSectionOrder={setSectionOrder}
                isOpen={sectionOrderOpen}
                setIsOpen={setSectionOrderOpen}
                customSections={resumeData.customSections || []}
              />

              <CollapsibleSection title="Personal Information" icon={<FileText size={24} />} defaultOpen={true}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                  <input type="text" placeholder="Full Name" value={resumeData.personalInfo.name} onChange={(e) => updatePersonalInfo('name', e.target.value)} className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" />
                  <input type="email" placeholder="Email Address" value={resumeData.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" />
                  <input type="tel" placeholder="Phone Number" value={resumeData.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" />
                  <input type="url" placeholder="LinkedIn Profile URL" value={resumeData.personalInfo.linkedin} onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" />
                  <input type="url" placeholder="GitHub Profile URL" value={resumeData.personalInfo.github} onChange={(e) => updatePersonalInfo('github', e.target.value)} className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" />
                  <input type="url" placeholder="Portfolio Website URL" value={resumeData.personalInfo.portfolio} onChange={(e) => updatePersonalInfo('portfolio', e.target.value)} className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" />
                  <input type="url" placeholder="LeetCode Profile URL" value={resumeData.personalInfo.leetcode} onChange={(e) => updatePersonalInfo('leetcode', e.target.value)} className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg md:col-span-2 focus:outline-none" />
                </div>
              </CollapsibleSection>

              {sectionOrder.map(sectionType => renderSectionByType(sectionType))}

              <button onClick={addCustomSection} className="btn-secondary w-full flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm lg:text-base font-medium border-2 border-dashed" style={{ borderColor: 'var(--color-border)' }}>
                <Plus size={16} /> Add Custom Section
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col pdf-section" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
        <div className="pdf-container surface rounded-lg lg:rounded-none flex items-center justify-center p-2 lg:p-4 m-2 lg:m-4 lg:mt-4" style={{ height: 'calc(100vh - 1rem)', minHeight: '400px', maxHeight: 'calc(100vh - 1rem)' }}>
          {isCompiling && (
            <div className="text-center" style={{ color: 'var(--color-foreground-secondary)' }}>
              <Loader size={window.innerWidth < 1024 ? 32 : 48} className="animate-spin mb-2 lg:mb-4 mx-auto" />
              <p className="text-xs lg:text-base">Compiling PDF with your saved data...</p>
            </div>
          )}
          {compilationError && !isCompiling && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-2 lg:p-4 m-2 lg:m-4 rounded-md w-full h-full overflow-y-auto">
              <div className="flex items-center">
                <AlertTriangle size={window.innerWidth < 1024 ? 20 : 24} className="mr-2 lg:mr-3 flex-shrink-0" />
                <p className="font-bold text-sm lg:text-base">Compilation Failed</p>
              </div>
              <p className="text-xs lg:text-sm mt-1 lg:mt-2 mb-1 lg:mb-2">Please check your inputs for special characters. The error from the compiler is shown below:</p>
              <pre className="text-xs mt-1 lg:mt-2 p-1 lg:p-2 bg-red-50 rounded whitespace-pre-wrap font-mono break-all max-h-32 lg:max-h-none overflow-y-auto">
                {compilationError}
              </pre>
            </div>
          )}
          {!isCompiling && !compilationError && pdfUrl && (
            <object data={pdfUrl} type="application/pdf" width="100%" height="100%" className="rounded-lg">
              <div className="text-center p-4">
                <p className="text-sm lg:text-base mb-2" style={{ color: 'var(--color-foreground-secondary)' }}>Your browser does not support PDFs.</p>
                <a href={pdfUrl} className="btn-primary inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium">
                  <Download size={16} /> Download PDF
                </a>
              </div>
            </object>
          )}
          {!isCompiling && !compilationError && !pdfUrl && (
            <div className="text-center" style={{ color: 'var(--color-foreground-secondary)' }}>
              <p className="text-sm lg:text-base">Your resume preview will appear here.</p>
              <p className="text-xs lg:text-sm">Start typing to see it live!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
