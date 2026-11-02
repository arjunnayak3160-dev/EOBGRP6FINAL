import JSZip from 'jszip';

export interface ParsedSlide {
  id: number;
  title: string;
  texts: string[];
  images: string[];
  rawText?: string;
}

export async function parsePptxFile(file: File): Promise<ParsedSlide[]> {
  try {
    const zip = await JSZip.loadAsync(file);
    const slides: ParsedSlide[] = [];

    // Find all slide files: ppt/slides/slide1.xml, slide2.xml, etc.
    const allPaths = Object.keys(zip.files);
    const slideFileNames = allPaths
      .filter((name) => /ppt\/slides\/slide\d+\.xml$/i.test(name))
      .sort((a, b) => {
        const numA = parseInt(a.match(/slide(\d+)\.xml/i)?.[1] || '0', 10);
        const numB = parseInt(b.match(/slide(\d+)\.xml/i)?.[1] || '0', 10);
        return numA - numB;
      });

    if (slideFileNames.length === 0) {
      throw new Error('No slide files found in this presentation. Please ensure this is a standard .pptx file.');
    }

    // Extract embedded media images (ppt/media/image1.png, etc.)
    const mediaFiles = allPaths.filter((name) =>
      /ppt\/media\/.*\.(png|jpe?g|gif|webp|svg)$/i.test(name)
    );

    const mediaUrls: Record<string, string> = {};
    for (const mediaPath of mediaFiles) {
      const fileData = zip.file(mediaPath);
      if (fileData) {
        try {
          const blob = await fileData.async('blob');
          mediaUrls[mediaPath] = URL.createObjectURL(blob);
        } catch {
          // continue
        }
      }
    }

    const parser = new DOMParser();

    for (let i = 0; i < slideFileNames.length; i++) {
      const slidePath = slideFileNames[i];
      const xmlString = await zip.file(slidePath)?.async('string');
      if (!xmlString) continue;

      let paragraphs: string[] = [];

      try {
        const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

        // Look for paragraph elements: <a:p>
        const pNodes = xmlDoc.getElementsByTagNameNS('*', 'p');
        if (pNodes.length > 0) {
          for (let p = 0; p < pNodes.length; p++) {
            const tNodes = pNodes[p].getElementsByTagNameNS('*', 't');
            let pText = '';
            for (let t = 0; t < tNodes.length; t++) {
              pText += tNodes[t].textContent || '';
            }
            pText = pText.trim();
            if (pText.length > 0) {
              paragraphs.push(pText);
            }
          }
        }

        // Fallback: search for all <*:t> elements
        if (paragraphs.length === 0) {
          const tNodes = xmlDoc.getElementsByTagNameNS('*', 't');
          for (let t = 0; t < tNodes.length; t++) {
            const str = tNodes[t].textContent?.trim();
            if (str && str.length > 0) {
              paragraphs.push(str);
            }
          }
        }
      } catch (err) {
        // Regex fallback if XML DOM parsing has issues
        const textMatches = xmlString.match(/<[^:]*:t[^>]*>([\s\S]*?)<\/[^:]*:t>/gi) || [];
        paragraphs = textMatches
          .map((m) => m.replace(/<[^>]+>/g, '').trim())
          .filter((s) => s.length > 0);
      }

      // If still empty, use regex fallback on xmlString
      if (paragraphs.length === 0) {
        const regexMatches = xmlString.match(/>([^<]{2,})</g) || [];
        paragraphs = regexMatches
          .map((m) => m.replace(/[><]/g, '').trim())
          .filter((s) => s.length > 3 && !/^(en-US|True|False|none|auto|accent\d)/i.test(s));
      }

      let title = `Slide ${i + 1}`;
      let bodyTexts: string[] = [];

      if (paragraphs.length > 0) {
        title = paragraphs[0];
        bodyTexts = paragraphs.slice(1);
      }

      slides.push({
        id: i + 1,
        title: title || `Slide ${i + 1}`,
        texts: bodyTexts.length > 0 ? bodyTexts : paragraphs,
        images: Object.values(mediaUrls).slice(0, 3),
        rawText: paragraphs.join(' ')
      });
    }

    return slides;
  } catch (error: any) {
    console.error('Error parsing PPTX file:', error);
    throw new Error(error.message || 'Could not parse PPTX file archive.');
  }
}
