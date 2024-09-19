import "./style.css";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    duration: 1.2,
    x: -100,
    opacity: 0,
    stagger: 0.25,
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

function getCords(e) {
  const { currentTarget: card } = e;

  const rect = card.getBoundingClientRect(),
    x = e.clientX - rect.left,
    y = e.clientY - rect.top;

  card.style.setProperty("--mouse-x", `${x}px`);
  card.style.setProperty("--mouse-y", `${y}px`);
}

function setCords(item) {
  console.log(item);
  item.onmousemove = (e) => {
    getCords(e);
  };
}

function cardsFollowEffect() {
  const cards = document.querySelectorAll(".card");
  cards.forEach(setCords);
}

document.addEventListener("DOMContentLoaded", () => {
  setupAllAnimations();
  cardsFollowEffect();
});
