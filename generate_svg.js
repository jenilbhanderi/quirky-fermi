const fs = require('fs');
let rects = '';
for (let y=0; y<8; y++) {
  for (let x=0; x<8; x++) {
    // Missing pixels
    if ((x===7 && y===4) || (x===6 && y===5) || (x===5 && y===6) || (x===4 && y===7) ||
        (x===7 && y===6) || (x===6 && y===7)) {
      continue;
    }
    // slightly overlap them (width 20.5) to avoid subpixel rendering gaps, except we want individual pixels visible?
    // the image shows them as perfectly merging. Using width 20 height 20 rx 2 gives a nice subtle grid effect!
    rects += `      <rect x="${x*20}" y="${y*20}" width="20" height="20" rx="2" />\n`;
  }
}
const svg = `<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#B07BFF" />
      <stop offset="50%" stop-color="#7C5CFF" />
      <stop offset="100%" stop-color="#3D7CFF" />
    </linearGradient>
  </defs>
  <g id="pixels" fill="url(#grad)">
${rects}  </g>
</svg>`;
fs.writeFileSync('frontend/public/favicon.svg', svg);
console.log('Done');
