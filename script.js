const SMISKI_IMAGES = [
  "assets/series1/hiding.png",
  "assets/series1/peeking.png"
];

const TITLE_TEXT = "smiski";

function chooseTwoDistinct(arr) {
  if (arr.length < 2) return [arr[0], arr[0]];
  const first = Math.floor(Math.random() * arr.length);
  let second = Math.floor(Math.random() * arr.length);
  if (second === first) {
    second = (second + 1) % arr.length;
  }
  return [arr[first], arr[second]];
}

function buildStaggeredTitle(el, text) {
  el.innerHTML = "";
  [...text].forEach((ch, i) => {
    const span = document.createElement("span");
    span.className = "letter";
    span.textContent = ch;
    span.style.animationDelay = `${i * 90}ms`;
    el.appendChild(span);
  });
}


window.addEventListener("DOMContentLoaded", () => {

  const titleEl = document.getElementById("title");
  buildStaggeredTitle(titleEl, TITLE_TEXT);

  const [leftSrc, rightSrc] = chooseTwoDistinct(SMISKI_IMAGES);
  const leftImg = document.getElementById("smiski-left");
  const rightImg = document.getElementById("smiski-right");
  leftImg.src = leftSrc;
  rightImg.src = rightSrc;

  [leftImg, rightImg].forEach((img, idx) => {
    img.style.opacity = "0";
    img.style.transition = "opacity 600ms ease";

    if (img.complete) {
      requestAnimationFrame(() => (img.style.opacity = "1"));
    } else {
      img.addEventListener("load", () => (img.style.opacity = "1"));
    }

    img.style.transitionDelay = `${idx * 120}ms`;
  });
});
