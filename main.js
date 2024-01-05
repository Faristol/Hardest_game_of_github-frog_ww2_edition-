const board = 800;
const cell = 50;
const gameSpeed = 200;
//------
let id = 0;
//-------

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
let positionLotus_r11 = [];
let positionLotus_r10 = [];
let positionLotus_r9 = [];
let positionLotus_r8 = [];
let positionLotus_r7 = [];
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
  map.set(2, positionsStaticBombsTransition);
  //en el lotus haurem de fer la inversa
  map.set(3, [
    positionLotus_r7,
    positionLotus_r8,
    positionLotus_r8,
    positionLotus_r10,
    positionLotus_r11,
  ]);
  map.set(4, positionsStaticBombsLast);
})();
const generateNumber = () => {
  return Math.floor(Math.random() * 3) + 1;
};

//---------------------------------------
//tant el numero de membres del grup (1-3) serà aleatori com els segons d'espera (1-3)
//tank row
let groupRank_1 = generateNumber();
let secondsWaitRank_1 = generateNumber() * 1000;
//tank row
let groupRank_2 = generateNumber();
let secondsWaitRank_2 = generateNumber() * 1000;
//atomic bomb
let groupRank_3 = generateNumber();
let secondsWaitRank_3 = generateNumber() * 1000;
//ovni
let groupRank_4 = generateNumber();
let secondsWaitRank_4 = generateNumber() * 1000;
//ovni
let groupRank_5 = generateNumber();
let secondsWaitRank_5 = generateNumber() * 1000;
//atomic bomb
let groupRank_6 = generateNumber();
let secondsWaitRank_6 = generateNumber() * 1000;
// lotus ->
let groupRank_7 = generateNumber();
let secondsWaitRank_7 = generateNumber() * 1000;
let groupRank_8 = generateNumber();
let secondsWaitRank_8 = generateNumber() * 1000;
let groupRank_9 = generateNumber();
let secondsWaitRank_9 = generateNumber() * 1000;
let groupRank_10 = generateNumber();
let secondsWaitRank_10 = generateNumber() * 1000;
let groupRank_11 = generateNumber();
let secondsWaitRank_11 = generateNumber() * 1000;

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
  window.clearInterval(id);
  fase = getFrogCurrentPhase();
  update();
  draw();
  //ara llevem segons
  countDown();

  id = window.setInterval(game, gameSpeed);

  //window.requestAnimationFrame(game);
};
const countDown = () => {
  secondsWaitRank_11 = secondsWaitRank_11 - gameSpeed;
  secondsWaitRank_10 = secondsWaitRank_10 - gameSpeed;
  secondsWaitRank_9 = secondsWaitRank_9 - gameSpeed;
  secondsWaitRank_8 = secondsWaitRank_8 - gameSpeed;
  secondsWaitRank_7 = secondsWaitRank_7 - gameSpeed;
  secondsWaitRank_6 = secondsWaitRank_6 - gameSpeed;
  secondsWaitRank_5 = secondsWaitRank_5 - gameSpeed;
  secondsWaitRank_4 = secondsWaitRank_4 - gameSpeed;
  secondsWaitRank_3 = secondsWaitRank_3 - gameSpeed;
  secondsWaitRank_2 = secondsWaitRank_2 - gameSpeed;
  secondsWaitRank_1 = secondsWaitRank_1 - gameSpeed;
};
const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.width);
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
  let leafLotus = [
    positionLotus_r11,
    positionLotus_r10,
    positionLotus_r9,
    positionLotus_r8,
    positionLotus_r7,
  ];
  drawObstacles([leafLotus], [cell], [lotus]);
  /*
[
      directionRight,
      directionLeft,
      directionLeft,
      directionRight,
      directionLeft,
    ]
  */
};
const update = () => {
  updateLotus();
};
const drawObstacles = (arrayPositions, width, images) => {
  for (let i = 0; i < arrayPositions.length; i++) {
    let array = arrayPositions[i];
    let image = images[i];
    for (let j = 0; j < array.length; j++) {
      ctx.drawImage(image, array[j].x * cell, array[j].y * cell);
    }
  }
};
const updateLotus = () => {
  if (positionLotus_r11.length > 0) {
    /*   let groupRank_11 = generateNumber();
let secondsWaitRank_11 = generateNumber();*/
    if (secondsWaitRank_11 > 0) {
    } else {
    }
  } else {
  }
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
  if ([15, 14].includes(positionFrog.y)) {
    return 0;
  } else if ([13, 12, 11, 10, 9, 8].includes(positionFrog.y)) {
    return 1;
  } else if ([7].includes(positionFrog.y)) {
    return 2;
  } else if ([6, 5, 4, 3, 2].includes(positionFrog.y)) {
    return 3;
  } else if ([1, 0].includes(positionFrog.y)) {
    return 4;
  }
};
window.onload = inici;
