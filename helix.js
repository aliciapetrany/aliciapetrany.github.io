// ---------- animated DNA helix divider ----------
const HELIX_AMPLITUDE = 12;    // vertical swing, in pixels
const HELIX_FREQUENCY = 0.35;  // how tightly the helix twists
const CHAR_WIDTH = 14;         // horizontal spacing between positions
 
// 0s and 1s show up more often than underscores
function randomChar() {
  const r = Math.random();
  if (r < 0.4) return '0';
  if (r < 0.8) return '1';
  return '_';
}
 
const helixEl = document.getElementById('dna-helix');
 
function calculateHelixLength() {
  const wrapWidth = helixEl.parentElement.clientWidth;
  return Math.max(4, Math.floor(wrapWidth / CHAR_WIDTH));
}
 
let HELIX_LENGTH = helixEl ? calculateHelixLength() : 0;
 
// two arrays hold the character shown at each position on each strand
let frontStrand = Array.from({ length: HELIX_LENGTH }, randomChar);
let backStrand = Array.from({ length: HELIX_LENGTH }, randomChar);
 
function renderHelix() {
  let html = '';
  for (let i = 0; i < HELIX_LENGTH; i++) {
    const angle = i * HELIX_FREQUENCY;
    const frontY = Math.sin(angle) * HELIX_AMPLITUDE;
    const backY = -frontY;
    const x = i * CHAR_WIDTH;
 
    // back strand drawn first (dimmer, reads as "behind" the front strand)
    html += `<span class="helix-char back" style="left:${x}px; top:calc(50% + ${backY}px);">${backStrand[i]}</span>`;
    html += `<span class="helix-char front" style="left:${x}px; top:calc(50% + ${frontY}px);">${frontStrand[i]}</span>`;
  }
  helixEl.innerHTML = html;
}
 
// only swap a random handful of positions each tick, not the whole strand
function scrambleHelix() {
  const changeCount = Math.floor(Math.random() * 4) + 1; // 1-4 changes
  for (let n = 0; n < changeCount; n++) {
    const i = Math.floor(Math.random() * HELIX_LENGTH);
    if (Math.random() < 0.5) {
      frontStrand[i] = randomChar();
    } else {
      backStrand[i] = randomChar();
    }
  }
  renderHelix();
}
 
// keep the strand length matched to the container's current width
function handleResize() {
  const newLength = calculateHelixLength();
  if (newLength === HELIX_LENGTH) return;
 
  if (newLength > HELIX_LENGTH) {
    for (let i = HELIX_LENGTH; i < newLength; i++) {
      frontStrand.push(randomChar());
      backStrand.push(randomChar());
    }
  } else {
    frontStrand.length = newLength;
    backStrand.length = newLength;
  }
  HELIX_LENGTH = newLength;
  renderHelix();
}
 
if (helixEl) {
  renderHelix();
  setInterval(scrambleHelix, 250);
 
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 150);
  });
}