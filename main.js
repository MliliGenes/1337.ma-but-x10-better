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

function init() {
  const canvas = document.getElementById("particle-canvas");

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const numParticles = 500;

  for (let i = 0; i < numParticles; i++) {
    const x = Math.random() * 2000 - 1000;
    const y = Math.random() * 2000 - 1000;
    const z = Math.random() * 2000 - 1000;
    vertices.push(x, y, z);
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );

  const material = new THREE.PointsMaterial({ color: 0xffffff, size: 2 });
  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  window.addEventListener("resize", onWindowResize, false);
  document.addEventListener("mousemove", onMouseMove, false);
  window.addEventListener("scroll", onScroll, false);

  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
  mouseX = (event.clientX - window.innerWidth / 2) * 0.01;
  mouseY = (event.clientY - window.innerHeight / 2) * 0.01;
}

function onScroll() {
  const scrollY = window.scrollY;
  particles.rotation.y = scrollY * 0.001;
  particles.rotation.z = scrollY * 0.001;
}

function animate() {
  requestAnimationFrame(animate);

  particles.rotation.x += 0.001;
  particles.rotation.y += 0.001;

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
