// src/hooks/useResumeExport.js
// Encapsulates "compile resumeData -> PDF" behavior: debounced auto-compile,
// loading/error state, and object-URL lifecycle cleanup. Extracted out of
// the page component so ResumeEditor only has to call one hook instead of
// owning three pieces of state + two effects.
import { useState, useEffect, useCallback, useRef } from 'react';
import { generateFullLatex } from '../services/latexService';
import { compileLatexToPdf } from '../services/exportService';

const AUTO_COMPILE_DELAY_MS = 1000;

export const useResumeExport = (resumeData, sectionOrder, templateId, styleSettings) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilationError, setCompilationError] = useState('');
  const pdfUrlRef = useRef(null);

  // Keep a ref in sync so the compile callback can revoke the previous
  // object URL without needing pdfUrl as a dependency (which previously
  // caused the debounce effect to reset on every successful compile).
  useEffect(() => {
    pdfUrlRef.current = pdfUrl;
  }, [pdfUrl]);

  const handleCompile = useCallback(async () => {
    setIsCompiling(true);
    setCompilationError('');

    const latexString = generateFullLatex(resumeData, sectionOrder, templateId, styleSettings);

    try {
      const pdfBlob = await compileLatexToPdf(latexString);

      if (pdfUrlRef.current) {
        URL.revokeObjectURL(pdfUrlRef.current);
      }

      const newPdfUrl = URL.createObjectURL(pdfBlob) + '#view=FitH&toolbar=0';
      setPdfUrl(newPdfUrl);
    } catch (error) {
      console.error('Compilation failed:', error);
      setCompilationError(error.message);
      setPdfUrl(null);
    } finally {
      setIsCompiling(false);
    }
  }, [resumeData, sectionOrder, templateId, styleSettings]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleCompile();
    }, AUTO_COMPILE_DELAY_MS);

    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeData, sectionOrder, templateId, styleSettings]);

  // Revoke the last object URL on unmount only.
  useEffect(() => {
    return () => {
      if (pdfUrlRef.current) {
        URL.revokeObjectURL(pdfUrlRef.current);
      }
    };
  }, []);

  return { pdfUrl, isCompiling, compilationError };
};
