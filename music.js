// Interactive Fractal Music Generator
// This project combines fractal visualization with music generation
// to create an audiovisual experience controlled by mouse movement.

// Set up the main container
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
document.body.style.backgroundColor = '#000';
document.body.style.fontFamily = 'Arial, sans-serif';

// Create canvas for fractal visualization
const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Create audio context for sound generation
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Create UI elements
const controlPanel = document.createElement('div');
controlPanel.style.position = 'absolute';
controlPanel.style.top = '20px';
controlPanel.style.right = '20px';
controlPanel.style.padding = '15px';
controlPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
controlPanel.style.borderRadius = '10px';
controlPanel.style.color = '#fff';
controlPanel.style.zIndex = '100';
document.body.appendChild(controlPanel);

// Title
const title = document.createElement('h2');
title.textContent = 'Fractal Sound Explorer';
title.style.margin = '0 0 15px 0';
title.style.textAlign = 'center';
title.style.color = '#4fc3f7';
title.style.textShadow = '0 0 5px rgba(79, 195, 247, 0.8)';
controlPanel.appendChild(title);

// Create UI controls
const controls = [
  { name: 'iterations', label: 'Fractal Complexity', min: 1, max: 10, value: 5, step: 1 },
  { name: 'zoom', label: 'Zoom Level', min: 0.1, max: 2, value: 1, step: 0.1 },
  { name: 'rotationSpeed', label: 'Rotation Speed', min: 0, max: 0.05, value: 0.01, step: 0.005 },
  { name: 'musicComplexity', label: 'Music Complexity', min: 1, max: 8, value: 3, step: 1 },
  { name: 'tempoScale', label: 'Tempo', min: 0.5, max: 2, value: 1, step: 0.1 }
];

// Settings object to hold current values
const settings = {};

// Add sliders for each control
controls.forEach(control => {
  const container = document.createElement('div');
  container.style.marginBottom = '10px';
  
  const label = document.createElement('label');
  label.textContent = control.label;
  label.style.display = 'block';
  label.style.marginBottom = '5px';
  container.appendChild(label);
  
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = control.min;
  slider.max = control.max;
  slider.step = control.step;
  slider.value = control.value;
  slider.style.width = '100%';
  slider.style.accentColor = '#4fc3f7';
  container.appendChild(slider);
  
  const valueDisplay = document.createElement('span');
  valueDisplay.textContent = control.value;
  valueDisplay.style.fontSize = '12px';
  valueDisplay.style.float = 'right';
  container.appendChild(valueDisplay);
  
  // Set initial value
  settings[control.name] = control.value;
  
  // Update value on change
  slider.addEventListener('input', () => {
    settings[control.name] = parseFloat(slider.value);
    valueDisplay.textContent = slider.value;
  });
  
  controlPanel.appendChild(container);
});

// Add color theme selector
const colorThemeContainer = document.createElement('div');
colorThemeContainer.style.marginBottom = '10px';

const colorThemeLabel = document.createElement('label');
colorThemeLabel.textContent = 'Color Theme';
colorThemeLabel.style.display = 'block';
colorThemeLabel.style.marginBottom = '5px';
colorThemeContainer.appendChild(colorThemeLabel);

const colorThemeSelect = document.createElement('select');
colorThemeSelect.style.width = '100%';
colorThemeSelect.style.padding = '5px';
colorThemeSelect.style.backgroundColor = '#333';
colorThemeSelect.style.color = '#fff';
colorThemeSelect.style.border = '1px solid #555';
colorThemeSelect.style.borderRadius = '4px';

const colorThemes = [
  { name: 'Electric Blue', colors: ['#001d3d', '#003566', '#0077b6', '#00b4d8', '#90e0ef'] },
  { name: 'Cosmic Purple', colors: ['#240046', '#3c096c', '#5a189a', '#7b2cbf', '#9d4edd'] },
  { name: 'Forest Green', colors: ['#081c15', '#1b4332', '#2d6a4f', '#40916c', '#52b788'] },
  { name: 'Sunset', colors: ['#3d348b', '#7678ed', '#f7b801', '#f18701', '#f35b04'] },
  { name: 'Neon Night', colors: ['#2b2d42', '#8d99ae', '#ef233c', '#d90429', '#ffb703'] }
];

colorThemes.forEach((theme, index) => {
  const option = document.createElement('option');
  option.value = index;
  option.textContent = theme.name;
  colorThemeSelect.appendChild(option);
});

colorThemeContainer.appendChild(colorThemeSelect);
controlPanel.appendChild(colorThemeContainer);

// Set initial color theme
let currentColorTheme = colorThemes[0].colors;

colorThemeSelect.addEventListener('change', () => {
  currentColorTheme = colorThemes[parseInt(colorThemeSelect.value)].colors;
});

// Add audio toggle button
const audioToggleBtn = document.createElement('button');
audioToggleBtn.textContent = 'Toggle Audio (ON)';
audioToggleBtn.style.width = '100%';
audioToggleBtn.style.padding = '8px';
audioToggleBtn.style.backgroundColor = '#4fc3f7';
audioToggleBtn.style.color = '#000';
audioToggleBtn.style.border = 'none';
audioToggleBtn.style.borderRadius = '4px';
audioToggleBtn.style.cursor = 'pointer';
audioToggleBtn.style.marginTop = '10px';
audioToggleBtn.style.fontWeight = 'bold';

let audioEnabled = true;

audioToggleBtn.addEventListener('click', () => {
  audioEnabled = !audioEnabled;
  audioToggleBtn.textContent = `Toggle Audio (${audioEnabled ? 'ON' : 'OFF'})`;
  audioToggleBtn.style.backgroundColor = audioEnabled ? '#4fc3f7' : '#f44336';
  
  if (!audioEnabled) {
    // Stop all active oscillators
    activeOscillators.forEach(osc => {
      osc.stop();
    });
    activeOscillators = [];
  }
});

controlPanel.appendChild(audioToggleBtn);

// Add save as image button
const saveImageBtn = document.createElement('button');
saveImageBtn.textContent = 'Save as Image';
saveImageBtn.style.width = '100%';
saveImageBtn.style.padding = '8px';
saveImageBtn.style.backgroundColor = '#9c27b0';
saveImageBtn.style.color = '#fff';
saveImageBtn.style.border = 'none';
saveImageBtn.style.borderRadius = '4px';
saveImageBtn.style.cursor = 'pointer';
saveImageBtn.style.marginTop = '10px';
saveImageBtn.style.fontWeight = 'bold';

saveImageBtn.addEventListener('click', () => {
  // Create a download link for the canvas image
  const link = document.createElement('a');
  link.download = 'fractal-music-art.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

controlPanel.appendChild(saveImageBtn);

// Fractal parameters
let angle = 0;
let lastMouseX = window.innerWidth / 2;
let lastMouseY = window.innerHeight / 2;
let activeOscillators = [];

// Sound-related functions
const createTone = (frequency, duration, type = 'sine') => {
  if (!audioEnabled) return null;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  
  // Add slight randomness to make it more organic
  oscillator.detune.value = Math.random() * 10 - 5;
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
  
  // Keep track of active oscillators
  activeOscillators.push(oscillator);
  
  // Clean up the oscillator array
  setTimeout(() => {
    activeOscillators = activeOscillators.filter(osc => osc !== oscillator);
  }, duration * 1000);
  
  return oscillator;
};

// Musical scale frequencies
const cMajorScale = [
  261.63, // C4
  293.66, // D4
  329.63, // E4
  349.23, // F4
  392.00, // G4
  440.00, // A4
  493.88, // B4
  523.25  // C5
];

// Draw a fractal branch
function drawBranch(x, y, length, angle, depth, branchWidth) {
  if (depth === 0) return;
  
  const endX = x + Math.cos(angle) * length;
  const endY = y + Math.sin(angle) * length;
  
  // Draw the branch
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(endX, endY);
  
  // Color based on depth and theme
  const colorIndex = Math.min(depth - 1, currentColorTheme.length - 1);
  ctx.strokeStyle = currentColorTheme[colorIndex];
  ctx.lineWidth = branchWidth;
  ctx.stroke();
  
  // For leaf nodes, draw a circle
  if (depth === 1) {
    ctx.beginPath();
    ctx.arc(endX, endY, branchWidth * 2, 0, Math.PI * 2);
    ctx.fillStyle = currentColorTheme[currentColorTheme.length - 1];
    ctx.fill();
    return;
  }
  
  // Calculate new parameters for the next branches
  const newLength = length * 0.67;
  const newWidth = branchWidth * 0.7;
  const branchAngle = Math.PI / 4 + (Math.sin(angle * 3) * 0.2);
  
  // Recursive calls for branches
  drawBranch(endX, endY, newLength, angle - branchAngle, depth - 1, newWidth);
  drawBranch(endX, endY, newLength, angle + branchAngle, depth - 1, newWidth);
}

// Create a fractal tree
function drawFractalTree(x, y, angle) {
  const iterations = settings.iterations;
  const zoom = settings.zoom;
  
  // Initial branch parameters
  const initialLength = 100 * zoom;
  const initialWidth = 8 * zoom;
  
  drawBranch(x, y, initialLength, angle - Math.PI / 2, iterations, initialWidth);
}

// Generate notes based on fractal parameters
function generateMusic(x, y) {
  if (!audioEnabled) return;
  
  const complexity = settings.musicComplexity;
  const tempo = settings.tempoScale;
  
  // Use mouse position to determine musical parameters
  const xRatio = x / canvas.width;
  const yRatio = y / canvas.height;
  
  // Pick notes from the scale based on position
  const noteIndexBase = Math.floor(xRatio * cMajorScale.length);
  
  // Create a chord or arpeggio pattern
  for (let i = 0; i < complexity; i++) {
    const noteIndex = (noteIndexBase + i * 2) % cMajorScale.length;
    const frequency = cMajorScale[noteIndex] * (1 + (i % 3) * 0.5); // Create harmonics
    
    // Determine note duration based on vertical position
    const baseDuration = 0.1 + yRatio * 0.4;
    const noteDuration = baseDuration / tempo;
    
    // Select different waveforms for variety
    const waveforms = ['sine', 'triangle', 'square', 'sawtooth'];
    const waveform = waveforms[i % waveforms.length];
    
    // Play the note with a delay
    setTimeout(() => {
      createTone(frequency, noteDuration, waveform);
    }, i * (300 / tempo));
  }
}

// Animation function
function animate() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Increment the angle
  angle += settings.rotationSpeed;
  
  // Draw multiple fractal trees
  drawFractalTree(canvas.width / 2, canvas.height - 50, angle);
  drawFractalTree(canvas.width / 2 - 200, canvas.height - 50, angle + 0.5);
  drawFractalTree(canvas.width / 2 + 200, canvas.height - 50, angle - 0.5);
  
  // Request the next frame
  requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Handle mouse movement
canvas.addEventListener('mousemove', (e) => {
  // Only trigger music if the mouse has moved significantly
  const dx = e.clientX - lastMouseX;
  const dy = e.clientY - lastMouseY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance > 30) {
    generateMusic(e.clientX, e.clientY);
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  }
});

// Display instructions
const instructionsBox = document.createElement('div');
instructionsBox.style.position = 'absolute';
instructionsBox.style.bottom = '20px';
instructionsBox.style.left = '20px';
instructionsBox.style.padding = '15px';
instructionsBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
instructionsBox.style.borderRadius = '10px';
instructionsBox.style.color = '#fff';
instructionsBox.style.zIndex = '100';
instructionsBox.style.maxWidth = '400px';

const instructionsTitle = document.createElement('h3');
instructionsTitle.textContent = 'How to Use';
instructionsTitle.style.margin = '0 0 10px 0';
instructionsTitle.style.color = '#4fc3f7';
instructionsBox.appendChild(instructionsTitle);

const instructions = document.createElement('p');
instructions.innerHTML = 'Move your mouse across the screen to generate music.<br>' + 
                        'Adjust sliders to change fractal appearance and sound.<br>' +
                        'Click "Save as Image" to download your fractal creation.';
instructions.style.margin = '0';
instructions.style.lineHeight = '1.5';
instructionsBox.appendChild(instructions);

document.body.appendChild(instructionsBox);

// Start the animation
animate();

// Add performance meter
const performanceMeter = document.createElement('div');
performanceMeter.style.position = 'absolute';
performanceMeter.style.bottom = '20px';
performanceMeter.style.right = '20px';
performanceMeter.style.padding = '8px';
performanceMeter.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
performanceMeter.style.borderRadius = '5px';
performanceMeter.style.color = '#4fc3f7';
performanceMeter.style.fontFamily = 'monospace';
performanceMeter.style.fontSize = '12px';
document.body.appendChild(performanceMeter);

// Performance monitoring
let lastTime = performance.now();
let frameCount = 0;

function updatePerformance() {
  frameCount++;
  const now = performance.now();
  const elapsed = now - lastTime;
  
  if (elapsed >= 1000) {
    const fps = Math.round(frameCount * 1000 / elapsed);
    performanceMeter.textContent = `${fps} FPS`;
    frameCount = 0;
    lastTime = now;
  }
  
  requestAnimationFrame(updatePerformance);
}

updatePerformance();

console.log('Fractal Music Generator initialized successfully!');