import {promises as fsPromises, existsSync} from 'node:fs';
import path from 'node:path';
import Image from '@11ty/eleventy-img';

// Output, not source. Writing into src/ meant passthrough had already run by the
// time `eleventy.after` fired, so a card only appeared on the *next* build — which
// is why this event used to be guarded to serve mode and the results committed.
const ogImagesDir = './dist/assets/og-images';

export const svgToJpeg = async () => {
  const socialPreviewImagesDir = 'dist/assets/og-images/';

  if (!existsSync(socialPreviewImagesDir)) {
    console.log('⚠ No OG images dir found');
    return;
  }

  const files = await fsPromises.readdir(socialPreviewImagesDir);
  if (files.length > 0) {
    // `for…of`, not `forEach(async …)`. forEach discards the promise, so
    // `eleventy.after` returned before any card had finished encoding.
    for (const filename of files) {
      const outputFilename = filename.substring(0, filename.length - 4);
      if (filename.endsWith('.svg') & !existsSync(path.join(ogImagesDir, outputFilename))) {
        const imageUrl = socialPreviewImagesDir + filename;
        await Image(imageUrl, {
          formats: ['jpeg'],
          outputDir: ogImagesDir,
          statsOnly: process.env.BASELINE_PREPASS_ACTIVE === '1',
          filenameFormat: function (id, src, width, format, options) {
            return `${outputFilename}.${format}`;
          }
        });
      }
    }
  } else {
    console.log('⚠ No images found on OG images dir');
  }
};
