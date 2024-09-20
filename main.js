import "./style.css";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

function setupTextAnimation(headingId) {
  const heading = document.getElementById(headingId);
  const words = heading.querySelectorAll("span");

  gsap.set(words, { overflow: "hidden" });

  words.forEach((word) => {
    const wrapper = document.createElement("span");
    wrapper.style.display = "inline-block";
    word.appendChild(wrapper);
    wrapper.appendChild(word.firstChild);
  });

  const innerWrappers = heading.querySelectorAll("span > span");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: heading,
      toggleActions: "play none none none",
    },
  });

  tl.from(innerWrappers, {
    duration: 0.5,
    y: 50,
    opacity: 0,
    stagger: 0.1,
  });
}

function fadeIn(elementId) {
  const element = document.getElementById(elementId);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: element,

      toggleActions: "play none none none",
    },
  });

  tl.from(element, {
    duration: 2,
    delay: 0.5,
    opacity: 0,
  });

  return tl;
}

function goUP(elementIds) {
  const elements = elementIds.map((elementId) =>
    document.getElementById(elementId)
  );

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: elements,

      toggleActions: "play none none none",
    },
  });

  tl.from(elements, {
    duration: 1.2,
    y: 30,
    opacity: 0,
    stagger: 0.1,
  });

  return tl;
}

function slide(elementIds) {
  const elements = elementIds.map((elementId) =>
    document.getElementById(elementId)
  );

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: elements,
      toggleActions: "play none none none",
    },
  });

  tl.from(elements, {
    duration: 0.5,
    x: -10,
    opacity: 0,
    stagger: 0.5,
  });

  return tl;
}

function setupAllAnimations() {
  const headingIds = ["headOne", "headTwo"];
  headingIds.forEach(setupTextAnimation);

  const subtitlesIds = [
    "subtitleOne",
    "subtitleTwo",
    "subtitle3",
    "slogan1",
    "thumbnail",
  ];
  subtitlesIds.forEach(fadeIn);

  goUP(["btn1", "btn2"]);
  goUP(["logos"]);
  slide(["card1", "card2", "card3", "card4"]);
}

function cardsFollowEffect() {
  document.getElementById("grid-cards").onmousemove = (e) => {
    for (const card of document.getElementsByClassName("card")) {
      const rect = card.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    }
  };
}

let scene, camera, renderer, particles;
let mouseX = 0,
  mouseY = 0;
const particleLayers = [];

// Initialize the scene
function init() {
  const canvas = document.getElementById("particle-canvas");

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    800
  );
  camera.position.z = 50;

  renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Function to create a particle layer with varying depth, size, and alpha
  function createParticleLayer(numParticles, size, alpha, zOffset) {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    for (let i = 0; i < numParticles; i++) {
      const x = Math.random() * 2000 - 1000;
      const y = Math.random() * 2000 - 1000;
      const z = Math.random() * 2000 - 1000 + zOffset; // Add zOffset for depth layering
      vertices.push(x, y, z);
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    const material = new THREE.ShaderMaterial({
      uniforms: {
        pointSize: { value: size }, // Size varies based on the layer
        pointAlpha: { value: alpha }, // Adjust alpha to give depth transparency
      },
      vertexShader: `
          uniform float pointSize;
          varying vec3 vColor;
          void main() {
            // Slight color variation for stars
            vColor = vec3(0.9 + 0.1 * sin(position.x * 0.1), 0.9 + 0.1 * sin(position.y * 0.1), 1.0);
            gl_PointSize = pointSize; // Set point size from uniform
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
      fragmentShader: `
          uniform float pointAlpha;
          varying vec3 vColor;
          void main() {
            vec2 uv = gl_PointCoord.xy - vec2(0.5); // Center the UV coordinates
            float r = length(uv);                   // Get the distance from the center
            float glow = exp(-r * 20.0);             // Create a glow effect by fading the edges
            gl_FragColor = vec4(vColor, glow * pointAlpha); // Glow and transparency effect
          }
        `,
      transparent: true, // Allow stars to be transparent
      blending: THREE.AdditiveBlending, // Additive blending for glowing effect
      depthWrite: false, // Don't write to depth buffer for additive blending
    });

    const particles = new THREE.Points(geometry, material);
    particleLayers.push(particles); // Add this layer to the array
    scene.add(particles);
  }

  // Create multiple particle layers with varying depth
  createParticleLayer(500, 5.5, 0.8, 0); // Layer 1: farthest
  createParticleLayer(1000, 10.0, 1, -10); // Layer 2: middle
  createParticleLayer(2000, 12.0, 2, -50); // Layer 3: closest

  window.addEventListener("resize", onWindowResize, false);
  document.addEventListener("mousemove", onMouseMove, false);
  window.addEventListener("scroll", onScroll, false);

  animate(); // Start the animation loop
}

// Resize handler
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Mouse move handler
function onMouseMove(event) {
  mouseX = (event.clientX - window.innerWidth / 2) * 0.005;
  mouseY = (event.clientY - window.innerHeight / 2) * 0.01;
}

// Scroll handler to rotate particle layers based on scroll
function onScroll() {
  const scrollY = window.scrollY;
  particleLayers.forEach((layer) => {
    layer.rotation.y = scrollY * 0.001;
    layer.rotation.z = scrollY * 0.001;
  });
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  particleLayers.forEach((layer) => {
    layer.rotation.x += 0.0008; // Slower rotation for a more gradual, cosmic feel
    layer.rotation.y += 0.0008;
    layer.rotation.z += 0.0008;
  });

  // Move the camera based on mouse position
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;

  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

document.addEventListener("DOMContentLoaded", () => {
  setupAllAnimations();
  cardsFollowEffect();
  init();
});
