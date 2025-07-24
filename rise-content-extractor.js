/**
 * Rise Content Extractor Utility
 * Helps analyze and extract content from unzipped Rise course files
 */

class RiseContentExtractor {
  constructor() {
    this.supportedFormats = ['.html', '.htm', '.json'];
    this.riseMarkers = [
      'rise-player',
      'rise-content',
      'articulate',
      'data-rise',
      'rise-lesson',
      'storyline',
      'articulate-content',
      'rise-course',
      'rise-block'
    ];
  }

  /**
   * Analyze a Rise course folder structure
   * @param {FileList} files - Files from folder input
   * @returns {Object} Analysis results
   */
  async analyzeCourseStructure(files) {
    const analysis = {
      totalFiles: files.length,
      htmlFiles: [],
      jsonFiles: [],
      mediaFiles: [],
      lessons: [],
      mainIndex: null,
      courseStructure: {}
    };

    for (const file of files) {
      const fileName = file.name.toLowerCase();
      const filePath = file.webkitRelativePath || file.name;

      // Categorize files
      if (fileName.endsWith('.html') || fileName.endsWith('.htm')) {
        analysis.htmlFiles.push({ file, path: filePath });
      } else if (fileName.endsWith('.json')) {
        analysis.jsonFiles.push({ file, path: filePath });
      } else if (this.isMediaFile(fileName)) {
        analysis.mediaFiles.push({ file, path: filePath });
      }

      // Look for main index file
      if (fileName === 'index.html' && !filePath.includes('/')) {
        analysis.mainIndex = { file, path: filePath };
      }
    }

    // Analyze HTML files for Rise content
    for (const htmlFile of analysis.htmlFiles) {
      try {
        const content = await this.readFileAsText(htmlFile.file);
        const lessonData = await this.analyzeLessonContent(content, htmlFile);
        
        if (lessonData.isRiseContent) {
          analysis.lessons.push(lessonData);
        }
      } catch (error) {
        console.warn(`Error analyzing ${htmlFile.path}:`, error);
      }
    }

    // Sort lessons by their natural order
    analysis.lessons.sort((a, b) => this.compareFileNames(a.path, b.path));

    return analysis;
  }

  /**
   * Analyze individual lesson content
   * @param {string} content - HTML content
   * @param {Object} fileInfo - File information
   * @returns {Object} Lesson analysis
   */
  async analyzeLessonContent(content, fileInfo) {
    const lesson = {
      file: fileInfo.file,
      path: fileInfo.path,
      fileName: fileInfo.file.name,
      isRiseContent: false,
      title: '',
      description: '',
      blocks: [],
      interactions: [],
      assessments: [],
      media: [],
      cleanContent: '',
      metadata: {}
    };

    // Check if it's Rise content
    lesson.isRiseContent = this.isRiseContent(content);
    
    if (!lesson.isRiseContent) {
      return lesson;
    }

    // Extract title
    lesson.title = this.extractTitle(content, fileInfo.file.name);

    // Extract description/summary
    lesson.description = this.extractDescription(content);

    // Extract content blocks
    lesson.blocks = this.extractContentBlocks(content);

    // Extract interactions
    lesson.interactions = this.extractInteractions(content);

    // Extract assessments
    lesson.assessments = this.extractAssessments(content);

    // Extract media references
    lesson.media = this.extractMediaReferences(content);

    // Clean content for PDF
    lesson.cleanContent = this.cleanContentForPDF(content);

    // Extract metadata
    lesson.metadata = this.extractMetadata(content);

    return lesson;
  }

  /**
   * Check if content is from Rise
   * @param {string} content - HTML content
   * @returns {boolean}
   */
  isRiseContent(content) {
    const contentLower = content.toLowerCase();
    return this.riseMarkers.some(marker => contentLower.includes(marker));
  }

  /**
   * Extract title from content
   * @param {string} content - HTML content
   * @param {string} fileName - File name fallback
   * @returns {string}
   */
  extractTitle(content, fileName) {
    // Try multiple title extraction methods
    const titleMatches = [
      content.match(/<title[^>]*>([^<]+)<\/title>/i),
      content.match(/<h1[^>]*>([^<]+)<\/h1>/i),
      content.match(/<h2[^>]*>([^<]+)<\/h2>/i),
      content.match(/data-title="([^"]+)"/i),
      content.match(/title:\s*["']([^"']+)["']/i)
    ];

    for (const match of titleMatches) {
      if (match && match[1] && match[1].trim() && !match[1].toLowerCase().includes('rise')) {
        return this.cleanText(match[1]);
      }
    }

    // Fallback to filename
    return fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Extract description/summary
   * @param {string} content - HTML content
   * @returns {string}
   */
  extractDescription(content) {
    const descMatches = [
      content.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i),
      content.match(/<p[^>]*class="[^"]*summary[^"]*"[^>]*>([^<]+)<\/p>/i),
      content.match(/<div[^>]*class="[^"]*description[^"]*"[^>]*>([^<]+)<\/div>/i)
    ];

    for (const match of descMatches) {
      if (match && match[1] && match[1].trim()) {
        return this.cleanText(match[1]);
      }
    }

    return '';
  }

  /**
   * Extract content blocks
   * @param {string} content - HTML content
   * @returns {Array}
   */
  extractContentBlocks(content) {
    const blocks = [];
    
    // Extract different types of content blocks
    const blockPatterns = [
      { type: 'text', pattern: /<div[^>]*class="[^"]*text-block[^"]*"[^>]*>([\s\S]*?)<\/div>/gi },
      { type: 'image', pattern: /<div[^>]*class="[^"]*image-block[^"]*"[^>]*>([\s\S]*?)<\/div>/gi },
      { type: 'video', pattern: /<div[^>]*class="[^"]*video-block[^"]*"[^>]*>([\s\S]*?)<\/div>/gi },
      { type: 'audio', pattern: /<div[^>]*class="[^"]*audio-block[^"]*"[^>]*>([\s\S]*?)<\/div>/gi }
    ];

    blockPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.pattern.exec(content)) !== null) {
        blocks.push({
          type: pattern.type,
          content: this.cleanText(match[1]),
          rawHtml: match[0]
        });
      }
    });

    return blocks;
  }

  /**
   * Extract interactions
   * @param {string} content - HTML content
   * @returns {Array}
   */
  extractInteractions(content) {
    const interactions = [];
    
    const interactionPatterns = [
      { type: 'button', pattern: /<button[^>]*class="[^"]*rise[^"]*"[^>]*>([^<]+)<\/button>/gi },
      { type: 'accordion', pattern: /<div[^>]*class="[^"]*accordion[^"]*"[^>]*>([\s\S]*?)<\/div>/gi },
      { type: 'tab', pattern: /<div[^>]*class="[^"]*tab[^"]*"[^>]*>([\s\S]*?)<\/div>/gi },
      { type: 'popup', pattern: /<div[^>]*class="[^"]*popup[^"]*"[^>]*>([\s\S]*?)<\/div>/gi }
    ];

    interactionPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.pattern.exec(content)) !== null) {
        interactions.push({
          type: pattern.type,
          content: this.cleanText(match[1])
        });
      }
    });

    return interactions;
  }

  /**
   * Extract assessments/quizzes
   * @param {string} content - HTML content
   * @returns {Array}
   */
  extractAssessments(content) {
    const assessments = [];
    
    const assessmentPatterns = [
      { type: 'quiz', pattern: /<div[^>]*class="[^"]*quiz[^"]*"[^>]*>([\s\S]*?)<\/div>/gi },
      { type: 'question', pattern: /<div[^>]*class="[^"]*question[^"]*"[^>]*>([\s\S]*?)<\/div>/gi },
      { type: 'knowledge-check', pattern: /<div[^>]*class="[^"]*knowledge-check[^"]*"[^>]*>([\s\S]*?)<\/div>/gi }
    ];

    assessmentPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.pattern.exec(content)) !== null) {
        assessments.push({
          type: pattern.type,
          content: this.cleanText(match[1])
        });
      }
    });

    return assessments;
  }

  /**
   * Extract media references
   * @param {string} content - HTML content
   * @returns {Array}
   */
  extractMediaReferences(content) {
    const media = [];
    
    const mediaPatterns = [
      { type: 'image', pattern: /<img[^>]*src="([^"]+)"[^>]*>/gi },
      { type: 'video', pattern: /<video[^>]*src="([^"]+)"[^>]*>/gi },
      { type: 'audio', pattern: /<audio[^>]*src="([^"]+)"[^>]*>/gi }
    ];

    mediaPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.pattern.exec(content)) !== null) {
        media.push({
          type: pattern.type,
          src: match[1],
          element: match[0]
        });
      }
    });

    return media;
  }

  /**
   * Clean content for PDF generation
   * @param {string} content - HTML content
   * @returns {string}
   */
  cleanContentForPDF(content) {
    let cleaned = content;

    // Remove scripts and styles
    cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/gi, '');
    cleaned = cleaned.replace(/<style[\s\S]*?<\/style>/gi, '');

    // Remove Rise-specific elements that won't work in PDF
    cleaned = cleaned.replace(/<div[^>]*class="[^"]*rise-player[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
    cleaned = cleaned.replace(/<div[^>]*data-rise[^>]*>[\s\S]*?<\/div>/gi, '');

    // Extract main content
    const bodyMatch = cleaned.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      cleaned = bodyMatch[1];
    }

    // Remove navigation and UI elements
    cleaned = cleaned.replace(/<nav[\s\S]*?<\/nav>/gi, '');
    cleaned = cleaned.replace(/<header[\s\S]*?<\/header>/gi, '');
    cleaned = cleaned.replace(/<footer[\s\S]*?<\/footer>/gi, '');
    cleaned = cleaned.replace(/<div[^>]*class="[^"]*nav[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');

    // Clean up empty elements
    cleaned = cleaned.replace(/<(\w+)[^>]*>\s*<\/\1>/gi, '');
    
    // Normalize whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    return cleaned;
  }

  /**
   * Extract metadata
   * @param {string} content - HTML content
   * @returns {Object}
   */
  extractMetadata(content) {
    const metadata = {};

    // Extract meta tags
    const metaPattern = /<meta[^>]*name="([^"]+)"[^>]*content="([^"]+)"/gi;
    let match;
    while ((match = metaPattern.exec(content)) !== null) {
      metadata[match[1]] = match[2];
    }

    // Extract data attributes
    const dataPattern = /data-([^=]+)="([^"]+)"/gi;
    while ((match = dataPattern.exec(content)) !== null) {
      metadata[`data-${match[1]}`] = match[2];
    }

    return metadata;
  }

  /**
   * Utility functions
   */
  readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  cleanText(text) {
    return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  isMediaFile(fileName) {
    const mediaExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.mp4', '.mp3', '.wav', '.pdf'];
    return mediaExtensions.some(ext => fileName.endsWith(ext));
  }

  compareFileNames(a, b) {
    // Natural sort for file names
    const aNum = a.match(/\d+/);
    const bNum = b.match(/\d+/);
    
    if (aNum && bNum) {
      return parseInt(aNum[0]) - parseInt(bNum[0]);
    }
    
    return a.localeCompare(b);
  }

  /**
   * Generate enhanced PDF structure
   * @param {Array} lessons - Analyzed lessons
   * @param {Object} options - PDF options
   * @returns {Object} PDF structure
   */
  generatePDFStructure(lessons, options = {}) {
    const structure = {
      title: options.title || 'Rise Course Job Aid',
      author: options.author || 'Course Author',
      generated: new Date().toLocaleDateString(),
      tableOfContents: [],
      sections: []
    };

    // Generate table of contents
    lessons.forEach((lesson, index) => {
      structure.tableOfContents.push({
        title: lesson.title,
        page: index + 2, // Assuming first page is cover
        sections: lesson.blocks.length > 0 ? lesson.blocks.map(block => block.type) : []
      });
    });

    // Generate sections
    lessons.forEach(lesson => {
      const section = {
        title: lesson.title,
        description: lesson.description,
        content: lesson.cleanContent,
        interactions: lesson.interactions,
        assessments: lesson.assessments,
        media: lesson.media,
        reflection: {
          question: "What are the key takeaways from this lesson?",
          space: "Use this area to write your notes and action items."
        }
      };
      
      structure.sections.push(section);
    });

    return structure;
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RiseContentExtractor;
} else if (typeof window !== 'undefined') {
  window.RiseContentExtractor = RiseContentExtractor;
}