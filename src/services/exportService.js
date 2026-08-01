// src/services/exportService.js
// Talks to the remote LaTeX compiler. Kept free of React so it can be
// swapped out or mocked in tests without touching any component.

const LATEX_COMPILE_ENDPOINT = 'https://latex.ytotech.com/builds/sync';

/**
 * Sends a LaTeX document string to the compiler and resolves with a PDF Blob.
 * Throws an Error with a human-readable message on failure.
 */
export const compileLatexToPdf = async (latexString) => {
  const response = await fetch(LATEX_COMPILE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      compiler: 'pdflatex',
      resources: [{ path: 'main.tex', content: latexString }],
    }),
  });

  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.log || errorData.message || JSON.stringify(errorData);
    } catch (e) {
      const textError = await response.text();
      if (textError) { errorMessage = textError; }
    }
    throw new Error(errorMessage);
  }

  return response.blob();
};
