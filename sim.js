// Interactive Solar System Simulator
// A web-based solar system simulator with interactive planets
// that orbit around the sun at different speeds

// Create the HTML structure
const body = document.querySelector('body');
body.style.margin = '0';
body.style.overflow = 'hidden';
body.style.backgroundColor = '#000';

// Create the container for our solar system
const container = document.createElement('div');
container.id = 'solar-system-container';
container.style.position = 'relative';
container.style.width = '100vw';
container.style.height = '100vh';
container.style.display = 'flex';
container.style.justifyContent = 'center';
container.style.alignItems = 'center';
body.appendChild(container);

// Create the sun
const sun = document.createElement('div');
sun.id = 'sun';
sun.style.position = 'absolute';
sun.style.width = '60px';
sun.style.height = '60px';
sun.style.borderRadius = '50%';
sun.style.backgroundColor = '#FFD700';
sun.style.boxShadow = '0 0 60px #FF8C00';
sun.style.zIndex = '10';
container.appendChild(sun);

// Data for planets
const planets = [
  { name: 'Mercury', color: '#A9A9A9', size: 10, orbitRadius: 80, orbitSpeed: 4.1, moons: 0 },
  { name: 'Venus', color: '#E6E6FA', size: 15, orbitRadius: 120, orbitSpeed: 1.6, moons: 0 },
  { name: 'Earth', color: '#6495ED', size: 16, orbitRadius: 170, orbitSpeed: 1, moons: 1 },
  { name: 'Mars', color: '#FF4500', size: 12, orbitRadius: 220, orbitSpeed: 0.5, moons: 2 },
  { name: 'Jupiter', color: '#F4A460', size: 30, orbitRadius: 300, orbitSpeed: 0.08, moons: 4 },
  { name: 'Saturn', color: '#DAA520', size: 28, orbitRadius: 380, orbitSpeed: 0.03, moons: 3 }
];

// Create planets and their orbits
planets.forEach(planetData => {
  // Create orbit path
  const orbit = document.createElement('div');
  orbit.className = 'orbit';
  orbit.style.position = 'absolute';
  orbit.style.width = `${planetData.orbitRadius * 2}px`;
  orbit.style.height = `${planetData.orbitRadius * 2}px`;
  orbit.style.borderRadius = '50%';
  orbit.style.border = '1px solid rgba(255, 255, 255, 0.2)';
  container.appendChild(orbit);
  
  // Create planet
  const planet = document.createElement('div');
  planet.className = 'planet';
  planet.id = planetData.name.toLowerCase();
  planet.dataset.planetName = planetData.name;
  planet.style.position = 'absolute';
  planet.style.width = `${planetData.size}px`;
  planet.style.height = `${planetData.size}px`;
  planet.style.borderRadius = '50%';
  planet.style.backgroundColor = planetData.color;
  planet.style.left = `${planetData.orbitRadius}px`;
  planet.style.zIndex = '5';
  planet.style.cursor = 'pointer';
  planet.style.transition = 'transform 0.3s';
  
  // Add event listeners for interactivity
  planet.addEventListener('mouseover', () => {
    planet.style.transform = 'scale(1.5)';
    displayPlanetInfo(planetData);
  });
  
  planet.addEventListener('mouseout', () => {
    planet.style.transform = 'scale(1)';
    hidePlanetInfo();
  });
  
  container.appendChild(planet);
  
  // Add moons if any
  for (let i = 0; i < planetData.moons; i++) {
    const moonOrbitRadius = planetData.size + 8 + (i * 6);
    const moonSize = 4;
    
    const moon = document.createElement('div');
    moon.className = 'moon';
    moon.style.position = 'absolute';
    moon.style.width = `${moonSize}px`;
    moon.style.height = `${moonSize}px`;
    moon.style.borderRadius = '50%';
    moon.style.backgroundColor = '#FFFFFF';
    moon.style.top = `${-moonSize/2}px`;
    moon.style.left = `${-moonSize/2}px`;
    
    const moonOrbit = document.createElement('div');
    moonOrbit.className = 'moon-orbit';
    moonOrbit.style.position = 'absolute';
    moonOrbit.style.width = `${moonOrbitRadius * 2}px`;
    moonOrbit.style.height = `${moonOrbitRadius * 2}px`;
    moonOrbit.style.borderRadius = '50%';
    moonOrbit.style.left = `${-moonOrbitRadius}px`;
    moonOrbit.style.top = `${-moonOrbitRadius}px`;
    
    moonOrbit.appendChild(moon);
    planet.appendChild(moonOrbit);
    
    // Animate the moon
    const moonAngle = 360 * (i / planetData.moons);
    const moonSpeed = 3 + (i * 0.5);
    animateMoon(moon, moonAngle, moonSpeed);
  }
});

// Create info panel
const infoPanel = document.createElement('div');
infoPanel.id = 'info-panel';
infoPanel.style.position = 'absolute';
infoPanel.style.bottom = '20px';
infoPanel.style.left = '20px';
infoPanel.style.padding = '10px 20px';
infoPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
infoPanel.style.color = 'white';
infoPanel.style.borderRadius = '8px';
infoPanel.style.fontFamily = 'Arial, sans-serif';
infoPanel.style.opacity = '0';
infoPanel.style.transition = 'opacity 0.3s';
container.appendChild(infoPanel);

// Function to display planet information
function displayPlanetInfo(planetData) {
  infoPanel.innerHTML = `
    <h3>${planetData.name}</h3>
    <p>Orbit Radius: ${planetData.orbitRadius} million km</p>
    <p>Relative Size: ${planetData.size} earth units</p>
    <p>Orbit Speed: ${planetData.orbitSpeed.toFixed(2)} earth years</p>
    <p>Moons: ${planetData.moons}</p>
  `;
  infoPanel.style.opacity = '1';
}

// Function to hide planet information
function hidePlanetInfo() {
  infoPanel.style.opacity = '0';
}

// Create control panel
const controlPanel = document.createElement('div');
controlPanel.id = 'control-panel';
controlPanel.style.position = 'absolute';
controlPanel.style.top = '20px';
controlPanel.style.right = '20px';
controlPanel.style.padding = '10px';
controlPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
controlPanel.style.borderRadius = '8px';
controlPanel.style.display = 'flex';
controlPanel.style.flexDirection = 'column';
controlPanel.style.gap = '10px';
container.appendChild(controlPanel);

// Create speed control
const speedControlLabel = document.createElement('label');
speedControlLabel.textContent = 'Simulation Speed';
speedControlLabel.style.color = 'white';
speedControlLabel.style.fontFamily = 'Arial, sans-serif';
speedControlLabel.style.fontSize = '14px';
controlPanel.appendChild(speedControlLabel);

const speedControl = document.createElement('input');
speedControl.type = 'range';
speedControl.min = '0.1';
speedControl.max = '5';
speedControl.step = '0.1';
speedControl.value = '1';
controlPanel.appendChild(speedControl);

// Create toggle button for labels
const toggleLabelsButton = document.createElement('button');
toggleLabelsButton.textContent = 'Toggle Planet Labels';
toggleLabelsButton.style.padding = '5px 10px';
toggleLabelsButton.style.borderRadius = '4px';
toggleLabelsButton.style.border = 'none';
toggleLabelsButton.style.cursor = 'pointer';
toggleLabelsButton.style.backgroundColor = '#333';
toggleLabelsButton.style.color = 'white';
controlPanel.appendChild(toggleLabelsButton);

// Create planet labels
const labels = document.createElement('div');
labels.id = 'planet-labels';
labels.style.position = 'absolute';
labels.style.width = '100%';
labels.style.height = '100%';
labels.style.pointerEvents = 'none';
container.appendChild(labels);

planets.forEach(planetData => {
  const label = document.createElement('div');
  label.className = 'planet-label';
  label.textContent = planetData.name;
  label.style.position = 'absolute';
  label.style.color = 'white';
  label.style.fontFamily = 'Arial, sans-serif';
  label.style.fontSize = '12px';
  label.style.textShadow = '0 0 2px black';
  label.style.opacity = '0';
  label.style.transition = 'opacity 0.3s';
  labels.appendChild(label);
});

// Toggle planet labels
let labelsVisible = false;
toggleLabelsButton.addEventListener('click', () => {
  labelsVisible = !labelsVisible;
  document.querySelectorAll('.planet-label').forEach(label => {
    label.style.opacity = labelsVisible ? '1' : '0';
  });
});

// Animation functions
function animatePlanets(timestamp) {
  const speedMultiplier = parseFloat(speedControl.value);
  
  planets.forEach((planetData, index) => {
    const planet = document.getElementById(planetData.name.toLowerCase());
    const angle = (timestamp * 0.0001 * planetData.orbitSpeed * speedMultiplier) % (2 * Math.PI);
    
    const x = Math.cos(angle) * planetData.orbitRadius;
    const y = Math.sin(angle) * planetData.orbitRadius;
    
    planet.style.transform = `translate(${x}px, ${y}px)`;
    
    // Update label position
    const label = document.querySelectorAll('.planet-label')[index];
    label.style.left = `${container.offsetWidth / 2 + x}px`;
    label.style.top = `${container.offsetHeight / 2 + y - 20}px`;
  });
  
  requestAnimationFrame(animatePlanets);
}

function animateMoon(moon, startAngle, speed) {
  let angle = startAngle * (Math.PI / 180);
  
  function updateMoonPosition() {
    angle += 0.01 * speed;
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    moon.style.transform = `translate(${x * 100}%, ${y * 100}%)`;
    requestAnimationFrame(updateMoonPosition);
  }
  
  updateMoonPosition();
}

// Create a pulsating effect for the sun
function pulsateSun() {
  let scale = 1;
  let increasing = true;
  
  function updateSunPulse() {
    if (increasing) {
      scale += 0.002;
      if (scale >= 1.1) increasing = false;
    } else {
      scale -= 0.002;
      if (scale <= 0.9) increasing = true;
    }
    
    sun.style.transform = `scale(${scale})`;
    requestAnimationFrame(updateSunPulse);
  }
  
  updateSunPulse();
}

// Start animations
requestAnimationFrame(animatePlanets);
pulsateSun();

// Add fullscreen button
const fullscreenButton = document.createElement('button');
fullscreenButton.textContent = 'Toggle Fullscreen';
fullscreenButton.style.padding = '5px 10px';
fullscreenButton.style.borderRadius = '4px';
fullscreenButton.style.border = 'none';
fullscreenButton.style.cursor = 'pointer';
fullscreenButton.style.backgroundColor = '#333';
fullscreenButton.style.color = 'white';
fullscreenButton.style.marginTop = '10px';
controlPanel.appendChild(fullscreenButton);

fullscreenButton.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

// Add event listener for window resize
window.addEventListener('resize', () => {
  // Recenter the solar system
  sun.style.left = `${container.offsetWidth / 2 - 30}px`;
  sun.style.top = `${container.offsetHeight / 2 - 30}px`;
});

// Initial positioning of the sun
sun.style.left = `${container.offsetWidth / 2 - 30}px`;
sun.style.top = `${container.offsetHeight / 2 - 30}px`;

// Add a title to the simulation
const title = document.createElement('h1');
title.textContent = 'Interactive Solar System';
title.style.position = 'absolute';
title.style.top = '20px';
title.style.left = '20px';
title.style.color = 'white';
title.style.fontFamily = 'Arial, sans-serif';
title.style.margin = '0';
title.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
container.appendChild(title);

console.log('Solar System Simulator initialized successfully!');