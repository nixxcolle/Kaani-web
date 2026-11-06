import type { LearningModule } from './data';
import { cleanModulePages } from './module-quiz';

export async function moduleQuizText(module: LearningModule): Promise<string> {
  if (!module.file_data && !module.file_name) return module.contentSections.map(section=>section.body).join('\n');
  const pdf = await import('pdfjs-dist');
  const { default: workerUrl } = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
  pdf.GlobalWorkerOptions.workerSrc = workerUrl;
  let data: Uint8Array;
  if (module.file_data) {
    const encoded = module.file_data.replace(/^data:application\/pdf;base64,/,'').replace(/\s/g,'');
    if (encoded.length>24*1024*1024) throw new Error('This module PDF is too large to prepare a quiz in the browser.');
    data = Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));
  } else {
    const response = await fetch(`${import.meta.env.BASE_URL}assets/docs/${encodeURIComponent(module.file_name)}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('The module PDF could not be loaded.');
    data = new Uint8Array(await response.arrayBuffer());
  }
  const task = pdf.getDocument({ data, stopAtErrors: true, standardFontDataUrl: `${import.meta.env.BASE_URL}assets/pdf-fonts/` });
  try {
    const document = await task.promise;
    // shortcut: 400 pages / 2 million characters per module, move extraction server-side for larger textbooks.
    if (document.numPages>400) throw new Error('This module PDF is too large to prepare a quiz in the browser.');
    const pages: string[] = []; let length = 0;
    for (let pageNumber=1;pageNumber<=document.numPages;pageNumber++) {
      const page = await document.getPage(pageNumber); const content = await page.getTextContent();
      const text = content.items.map(item=>'str' in item ? item.str+('hasEOL' in item && item.hasEOL ? '\n' : ' ') : '').join('');
      pages.push(text); length+=text.length;
      page.cleanup();
      if (length>2_000_000) throw new Error('This module PDF is too large to prepare a quiz in the browser.');
    }
    return cleanModulePages(pages);
  } finally { await task.destroy(); }
}
