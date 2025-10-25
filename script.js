
const TITLE_TEXT = "smiski";

const SWARM_CATEGORIES = ["clear"];

const FEATURE_CATEGORIES = ["hex", "clear"]; 

const BG_COUNT = 18;                   
const BG_SIZE = { min: 54, max: 140 };  
const DRIFT = { dxMin: 50, dxMax: 140, dyMin: 40, dyMax: 110 };
const DUR   = { min: 18, max: 36 };     

//SMISKIS

const PACKS = [
  // HEXAGON SMISKIS 
  { label: "Series 1: birthday", folder: "series1",   type: "hex", items: [
    "givingabouquet","wrappedup","poppingconfetti","birthdaymessage","littlesmiskidecorating","tasting"
  ]},
  { label: "Pack 2: sunday",     folder: "sunday",    type: "hex", items: [
    "blowingbubbles","paperairplane","sunbathing","singalong","skateboarding","gardening"
  ]},
  { label: "Pack 3: moving",     folder: "moving",    type: "hex", items: [
    "carryingladder","balancingboxes","decorating","littlesmiskiteamwork","greenthumb","fallingdown"
  ]},
  { label: "Pack 4: exercising", folder: "exercising",type: "hex", items: [
    "doingcrunches","aerobics","littlesmiskibalance","dumbbell","hoop","stretch"
  ]},
  { label: "Pack 5: dressing",   folder: "dressing",  type: "hex", items: [
    "underpants","struggling","loosepants","puttingonsocks","sweater","tightpants"
  ]},

  // CLEAR BACKGROUND SMISKIS
  { label: "Pack 6: cheer", folder: "cheer", type: "clear", items: [
    "marching","ondrums","onyourside","dancing","littlesmiskicheerieding","cheering"
  ]},
  { label: "Pack 7: yoga",  folder: "yoga",  type: "clear", items: [
    "lotus","twist","shouldstand","triangle","tree","ship"
  ]},

  // CIRCLE SMISKIS
  { label: "Pack 8: hippers", folder: "hippers", type: "circle", items: [
    "onhissmartphone","tryingtoclimb","lookingout","sticking","dozing","upsidedown"
  ]},
  { label: "Pack 9: atwork", folder: "atwork", type: "circle", items: [
    "approving","researching","presenting","goodidea","ontherord","littlesmiskigroupthink"
  ]},
  { label: "Pack 10: museum", folder: "museum", type: "circle", items: [
    "thesource","fuzin&raijin","bacchus","velazquez","dali","pearlearring"
  ]},
  { label: "Pack 11: bed", folder: "bed", type: "circle", items: [
    "beforerest","sleepy","cosleeping","reading","atsleep","fussing"
  ]},
  { label: "Pack 12: living", folder: "living", type: "circle", items: [
    "daydreaming","playing","hiding","naptime","thinking","lifting"
  ]},
  { label: "Pack 13: bath", folder: "bath", type: "circle", items: [
    "shampooing","notlooking","scrubbing","smiskiwithduck","dazed","looking"
  ]},
  { label: "Pack 14: toilet", folder: "toilet", type: "circle", items: [
    "peakaboo","littlesmelly","squatting","helpingout","resting","holdingin"
  ]},
  { label: "Pack 15: series4", folder: "series4", type: "circle", items: [
    "sneaking","scared","relaxing","lazy","stuck","defeated"
  ]},
  { label: "Pack 16: series3", folder: "series3", type: "circle", items: [
    "bridge","peeking","climbing","little","hiding","handstand"
  ]},
  { label: "Pack 17: series2", folder: "series2", type: "circle", items: [
    "kneeling","climbing","daydreaming","pushing","peeking","listening"
  ]},
  { label: "Pack 18: series1", folder: "series1classic", type: "circle", items: [
    "huggingknees","sitting","lookingback","lounging","hiding","peeking"
  ]},
];

//TIME FOR LOGIC

const clamp = (x, lo, hi) => (x < lo ? lo : x > hi ? hi : x);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
function randBetween(min, max){ return Math.random() * (max - min) + min; }
function range(n){ return Array.from({ length: n }, (_, i) => i); }

function buildPathsFromPacks(packs, allowedTypes){
  const out = [];
  for(const p of packs){
    if (!allowedTypes.includes(p.type)) continue;
    for(const name of p.items){
      const safe = name.replaceAll("&", "%26").replaceAll(" ", "");
      out.push(`assets/${p.folder}/${safe}.png`);
    }
  }
  return out;
}

function chooseTwoDistinct(arr){
  if (arr.length < 2) return [arr[0], arr[0]];
  const i = Math.floor(Math.random() * arr.length);
  let j = Math.floor(Math.random() * arr.length);
  if (j === i) j = (j + 1) % arr.length;
  return [arr[i], arr[j]];
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

  buildStaggeredTitle(document.getElementById("title"), TITLE_TEXT);

  const FEATURE_POOL = buildPathsFromPacks(PACKS, FEATURE_CATEGORIES);
  const SWARM_POOL   = buildPathsFromPacks(PACKS, SWARM_CATEGORIES);

  const [leftSrc, rightSrc] = chooseTwoDistinct(FEATURE_POOL);
  const leftImg = document.getElementById("smiski-left");
  const rightImg = document.getElementById("smiski-right");
  leftImg.src = leftSrc;
  rightImg.src = rightSrc;

  [leftImg, rightImg].forEach((img, idx) => {
    img.style.opacity = "0";
    img.style.transition = "opacity 600ms ease";
    img.style.transitionDelay = `${idx * 120}ms`;
    if (img.complete) requestAnimationFrame(()=> img.style.opacity = "1");
    else img.addEventListener("load", () => img.style.opacity = "1");
  });

  const swarm = document.getElementById("bg-swarm");
  if (SWARM_POOL.length) {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const densityScale = clamp((vw * vh) / (1440*900), 0.6, 1.2);
    const COUNT = Math.round(BG_COUNT * densityScale);


    const pool = [...SWARM_POOL];
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    range(COUNT).forEach(i => {
        const img = document.createElement("img");
        img.className = "bg-smi";
        img.src = pool[i % pool.length];
        img.alt = "";

        const x = Math.floor(Math.random() * vw) - 80;
        const y = Math.floor(Math.random() * vh) - 80;
        const targetPx = randBetween(BG_SIZE.min, BG_SIZE.max);
        const s = targetPx / 100; // ← add this

        const dx = randBetween(DRIFT.dxMin, DRIFT.dxMax) * (Math.random() < 0.5 ? -1 : 1);
        const dy = randBetween(DRIFT.dyMin, DRIFT.dyMax) * (Math.random() < 0.5 ? -1 : 1);
        const dur = randBetween(DUR.min, DUR.max);

        img.style.width = `${targetPx}px`;
        img.style.setProperty("--x", `${x}px`);
        img.style.setProperty("--y", `${y}px`);
        img.style.setProperty("--s", `${s}`);
        img.style.setProperty("--dx", `${dx}px`);
        img.style.setProperty("--dy", `${dy}px`);
        img.style.setProperty("--dur", `${dur}s`);

        img.style.opacity = "0";
        img.style.transition = "opacity 800ms ease";
        const reveal = () => requestAnimationFrame(() => (img.style.opacity = "0.12"));
        if (img.complete) reveal(); else img.addEventListener("load", reveal);

        swarm.appendChild(img);
    });
    }
});

function allEntries() {
    const entries = [];
    for (const p of PACKS) {
        for (const name of p.items) {
            const safe = name.replaceAll("&","%26").replaceAll(" ","");
            entries.push({
                label: name,
                path: `assets/${p.folder}/${safe}.png`,
                type: p.type,
                pack: p.label
            });
        }
    }
    return entries;
}

function sampleN(arr, n, excludeIdx = -1) {
    const idxs = arr.map((_,i)=>i).filter(i => i !== excludeIdx);
    for (let i = idxs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
    }
    return idxs.slice(0, n).map(i => arr[i]);
}

function shuffle(arr){
    for (let i = arr.length - 1; i > 0; i--){
        const j = Math.floor(Math.random()*(i+1));
        [arr[i],arr[j]] = [arr[j],arr[i]];
    }
    return arr;
}

const GAME = {
    pool: allEntries(),
    order: [],
    ptr: 0,
    score: 0,
};

(function setupOrder(){
    GAME.order = GAME.pool.map((_,i)=>i);
    shuffle(GAME.order);
})();

const imgEl = document.getElementById("q-img");
const optionBtns = [...document.querySelectorAll(".option")];
const nextBtn = document.getElementById("next");
const scoreEl = document.getElementById("score");
const qnumEl = document.getElementById("qnum");
const feedbackEl = document.getElementById("feedback");
const resetBtn = document.getElementById("reset");

function makeQuestion() {
  if (GAME.ptr >= GAME.order.length) {
    shuffle(GAME.order);
    GAME.ptr = 0;
  }
  const qIndex = GAME.order[GAME.ptr];
  const correct = GAME.pool[qIndex];

  const sameType = GAME.pool
    .map((e, i) => ({ e, i }))
    .filter(x => x.e.type === correct.type && x.i !== qIndex)
    .map(x => x.e);

  let distractors = sampleN(sameType, 3);
  if (distractors.length < 3) {
    const needed = 3 - distractors.length;
    const others = GAME.pool.filter((e, i) => i !== qIndex && !distractors.includes(e));
    distractors = distractors.concat(sampleN(others, needed));
  }

  const options = shuffle([correct, ...distractors].slice(0,4));

  imgEl.src = correct.path;
  imgEl.dataset.answer = correct.label;
  optionBtns.forEach((btn, i) => {
    btn.disabled = false;
    btn.classList.remove("correct","wrong");
    btn.textContent = options[i].label;
    btn.dataset.correct = String(options[i].label === correct.label);
  });
  feedbackEl.textContent = "";
  nextBtn.disabled = true;

  qnumEl.textContent = (GAME.ptr + 1);
}

function onChoose(e){
  const btn = e.currentTarget;
  if (btn.disabled) return;

  const isCorrect = btn.dataset.correct === "true";
  optionBtns.forEach(b => b.disabled = true);

  if (isCorrect) {
    btn.classList.add("correct");
    GAME.score += 1;
    scoreEl.textContent = GAME.score;
    feedbackEl.textContent = "Correct!";
  } else {
    btn.classList.add("wrong");

    const correctBtn = optionBtns.find(b => b.dataset.correct === "true");
    if (correctBtn) correctBtn.classList.add("correct");
    const answerText = imgEl.dataset.answer;
    feedbackEl.textContent = `Oops — it was “${answerText}”.`;
  }

  nextBtn.disabled = false;
}

function onNext(){
  GAME.ptr += 1;
  makeQuestion();
}

function onReset(){
  GAME.score = 0;
  scoreEl.textContent = "0";
  shuffle(GAME.order);
  GAME.ptr = 0;
  makeQuestion();
}

optionBtns.forEach(b => b.addEventListener("click", onChoose));
nextBtn.addEventListener("click", onNext);
resetBtn.addEventListener("click", onReset);

window.addEventListener("keydown", (e) => {
  if (e.key >= "1" && e.key <= "4") {
    const idx = Number(e.key) - 1;
    if (!optionBtns[idx].disabled) optionBtns[idx].click();
  } else if (e.key === "Enter" && !nextBtn.disabled) {
    nextBtn.click();
  }
});

makeQuestion();
