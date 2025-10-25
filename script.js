//SMISKIS
const MANIFEST = {
    //HEXAGON PICS
  series1: [
    "givingabouquet", "wrappedup", "poppingconfetti", "birthdaymessage", "littlesmiskidecorating", "tasting",
  ],

  sunday: [
    "blowingbubbles", "paperairplane", "sunbathing", "singalong", "skateboarding", "gardening",
  ],

  moving: [
    "carryingladder", "balancingboxes", "decorating", "littlesmiskiteamwork", "greenthumb", "fallingdown",
  ],

  exercising: [
    "doingcrunches", "aerobics", "littlesmiskibalance", "dumbbell", "hoop", "stretch",
  ],

  dressing: [
    "underpants", "struggling", "loosepants", "puttingonsocks", "sweater", "tightpants",
  ],

  //CLEAR BACKGROUND ONES
  cheer: [
    "marching","ondrums","onyourside","dancing","littlesmiskicheerieding","cheering",
  ],

  yoga: [
    "lotus","twist","shouldstand","triangle","tree","ship",
  ],

  //CIRCLE BACKGROUND SMISKIS
  hippers: [
    "onhissmartphone","tryingtoclimb","lookingout","sticking","dozing","upsidedown",
  ],

  atwork: [
    "approving","researching","presenting","goodidea","ontherord","littlesmiskigroupthink",
  ],

  museum: [
    "thesource","fuzin&raijin","bacchus","velazquez","dali","pearlearring",
  ],

  bed: [
    "beforerest","sleepy","cosleeping","reading","atsleep","fussing",
  ],

  living: [
    "daydreaming","playing","hiding","naptime","thinking","lifting",
  ],

  bath: [
    "shampooing","notlooking","scrubbing","smiskiwithduck","dazed","looking",
  ],

  toilet: [
    "peakaboo","littlesmelly","squatting","helpingout","resting","holdingin",
  ],

  series4: [
    "sneaking","scared","relaxing","lazy","stuck","defeated",
  ],

  series3: [
    "bridge","peeking","climbing","little","hiding","handstand",
  ],

  series2: [
    "kneeling","climbing","daydreaming","pushing","peeking","listening",
  ],
  
  series1classic: [
    "huggingknees","sitting","lookingback","lounging","hiding","peeking",
  ],
};

const TITLE_TEXT = "smiski";

const BG_COUNT = 18;

const BG_SIZE = { min: 54, max: 140 };

const DRIFT = { dxMin: 50, dxMax: 140, dyMin: 40, dyMax: 110 };

const DUR = { min: 18, max: 36 };

const clamp = (x, lo, hi) => (x < lo ? lo : x > hi ? hi : x);

function pick(arr){ return arr[Math.floor(Math.random()*arr.length)] }

function chooseTwoDistinct(arr) {
  if (arr.length < 2) return [arr[0], arr[0]];
  const first = Math.floor(Math.random() * arr.length);
  let second = Math.floor(Math.random() * arr.length);
  if (second === first) second = (second + 1) % arr.length;
  return [arr[first], arr[second]];
}

function range(n){ return Array.from({length:n}, (_,i)=>i); }

function randBetween(min, max){ return Math.random()*(max-min)+min; }

function buildAllImagePaths(manifest){
  const out = [];
  for(const series in manifest){
    for(const name of manifest[series]){
      const safeName = name.replaceAll("&", "%26");
      out.push(`assets/${series}/${safeName}.png`);
    }
  }
  return out;
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

  const ALL_IMAGES = buildAllImagePaths(MANIFEST);

  const [leftSrc, rightSrc] = chooseTwoDistinct(ALL_IMAGES);
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

  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  const densityScale = clamp((vw * vh) / (1440*900), 0.6, 1.2);
  const COUNT = Math.round(BG_COUNT * densityScale);

  const pool = [...ALL_IMAGES];
  for(let i = pool.length - 1; i > 0; i--){
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
    const s = randBetween(BG_SIZE.min, BG_SIZE.max) / 100;
    const dx = randBetween(DRIFT.dxMin, DRIFT.dxMax) * (Math.random() < 0.5 ? -1 : 1);
    const dy = randBetween(DRIFT.dyMin, DRIFT.dyMax) * (Math.random() < 0.5 ? -1 : 1);
    const dur = randBetween(DUR.min, DUR.max);

    img.style.setProperty("--x", `${x}px`);
    img.style.setProperty("--y", `${y}px`);
    img.style.setProperty("--s", `${s}`);
    img.style.setProperty("--dx", `${dx}px`);
    img.style.setProperty("--dy", `${dy}px`);
    img.style.setProperty("--dur", `${dur}s`);

    const targetPx = randBetween(BG_SIZE.min, BG_SIZE.max);
    img.style.width = `${targetPx}px`;

    img.style.opacity = "0";
    img.style.transition = "opacity 800ms ease";
    const reveal = () => requestAnimationFrame(()=> img.style.opacity = "0.12");
    if (img.complete) reveal(); else img.addEventListener("load", reveal);

    swarm.appendChild(img);
  });

});
