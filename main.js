const board = 800;
const cell = 50;
//16x16
let currentPhase = 0; //0-15 -> 5 fases
let directionFrog = { x: 0, y: 0 };
let directionRight = { x: 1, y: 0 };
let directionLeft = { x: -1, y: 0 };
let directionUp = { x: 0, y: -1 };
let directionDown = { x: 0, y: 1 };
//------------------------------
let positionFrog = { x: 15, y: 15 };
let positionsTanksRight = [];
let positionsTanksLeft = [];
let positionsStaticBombsTransition = [
  { x: 0, y: 6 },
  { x: 2, y: 6 },
  { x: 3, y: 6 },
  { x: 6, y: 6 },
  { x: 8, y: 6 },
  { x: 10, y: 6 },
  { x: 11, y: 6 },
  { x: 14, y: 6 },
];
let positionsStaticBombsLast = [
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 3, y: 1 },
  { x: 5, y: 1 },
  { x: 6, y: 1 },
  { x: 9, y: 1 },
  { x: 12, y: 1 },
  { x: 13, y: 1 },
  { x: 16, y: 1 },
];
let positionsAtomicBombsRight = [];
let positionsAtomicBombsLeft = [];
let positionsOvnisRight = [];
let positionsOvnisLeft = [];
let positionLotus = [];
//------------------------------
let atomicRight;
let staticBomb;
let frog;
let lotus;
let ovni;
let tankLeft;
let tankRight;
//------------------------------
let canvas = null;
let ctx = null;
//-----------------------------
//fases map
let map;
(() => {
  map = new Map();
  map.set(0, null);
  map.set(1, [
    positionsTanksLeft,
    positionsTanksRight,
    positionsAtomicBombsRight,
    positionsAtomicBombsLeft,
    positionsOvnisLeft,
    positionsOvnisRight,
  ]);
  map.set(2,positionsStaticBombsTransition);
  //en el lotus haurem de fer la inversa
  map.set(3,positionLotus);
  map.set(4,positionsStaticBombsLast)
})();

const inici = async () => {
  canvas = document.querySelector("#cv");
  canvas.width = board;
  canvas.height = board;
  canvas.style.border = "1px solid black";
  if (canvas.getContext) {
    ctx = canvas.getContext("2d");
  }
  try {
    atomicRight = await loadImage("./atomicright.png");
    staticBomb = await loadImage("./staticbomb.png");
    frog = await loadImage("./frog.png");
    lotus = await loadImage("./lotus.png");
    ovni = await loadImage("./ovni.png");
    tankLeft = await loadImage("./tankleft.png");
    tankRight = await loadImage("./tankright.png");
    game();
  } catch (error) {
    console.error("Error loading images:", error);
  }
  game();
};
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};
const game = () => {
  fase = getFrogCurrentPhase();
  draw();
  //update();
  //window.requestAnimationFrame(game);
};
const draw = () => {
  //de dalt avall
  //FASE ULTIMA 800x100 (x,y) -> total 16x2 celdes
  //en la segona fila-> bombes estàtiques
  lastPhase();
  riverPhase();
  transitionPhase();
};
const lastPhase = () => {
  ctx.fillStyle = "#68B000";
  ctx.fillRect(0, 0, cell * 16, cell * 2);
  ctx.strokeRect(0, 0, cell * 16, cell * 2);
  //-----dibuixar bombes estàtiques
  positionsStaticBombsLast.forEach((position) => {
    ctx.drawImage(staticBomb, position.x * cell, position.y * cell, cell, cell);
  });
};
const riverPhase = () => {
  //800x250 ->  total 16x4 celdes
  ctx.fillStyle = "turquoise";
  ctx.fillRect(0, cell * 2, cell * 16, cell * 4);
  ctx.strokeRect(0, cell * 2, cell * 16, cell * 4);
  //bombes estàtiques al començanent del riu
};
const transitionPhase = () => {
  //800x50
  ctx.fillStyle = "#8b8c7a";
  ctx.fillRect(0, cell * 6, cell * 16, cell);
  ctx.strokeRect(0, cell * 6, cell * 16, cell);
  positionsStaticBombsTransition.forEach((position) => {
    ctx.drawImage(staticBomb, position.x * cell, position.y * cell, cell, cell);
  });
};
const getFrogCurrentPhase = () => {
  //5 fases  -> 15 i 14 fase 0 (no colisions)
  // -> 13,12,11,10,9,8 fase 1 (colisions: tankes, bomba atomica i ovni)
  // -> 7 fase 2 (colisions:-> bomba)
  // -> 6,5,4,3,2 fase 3 (el riu)
  // -> 1 , 0 fase 4 (les bombes)
  switch (true) {
    case positionFrog:
        
        break;
  
    default:
        break;
  }
};
window.onload = inici;
