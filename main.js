const board = 800;
const cell = 50;
const gameSpeed = 10;
//------
let id = 0;
//-------
let deltaOvniRight = 800 / 5 - 10;
let counterOvniRight = 0;
let deltaOvniLeft = 800 / 5 - 10;
let counterOvniLeft = 0;
let directionOvniRight = 1;
let directionOvniLeft = -1;
//16x16
let currentPhase = 0; //0-15 -> 5 fases
let locationFrog = { x: 0, y: 0 };
//------------------------------
let positionFrog = { x: 15, y: 15 };
let positionsTanksRight = [];
let positionsTanksLeft = [];
let positionsStaticBombsTransition = [
  { x: 0, y: 7 },
  { x: 2, y: 7 },
  { x: 3, y: 7 },
  { x: 6, y: 7 },
  { x: 8, y: 7 },
  { x: 10, y: 7 },
  { x: 11, y: 7 },
  { x: 14, y: 7 },
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
let atomicLeft;
let staticBomb;
let frog;
let lotus;
let ovni;
let tankLeft;
let tankRight;
let explotion;

//------------------------------
let canvas = null;
let ctx = null;
let explotionBool = false;
let explotionCounter = 0;
//-----------------------------
//fases map
let map;
/*(() => { volia fer-ho eficient, xo x hui ja ho tinc be
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
})();*/
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
/*//atomic bomb
let groupRank_3 = generateNumber();
let secondsWaitRank_3 = generateNumber() * 1000;*/
/*ovni
let groupRank_4 = generateNumber();
let secondsWaitRank_4 = generateNumber() * 1000;
//ovni
let groupRank_5 = generateNumber();
let secondsWaitRank_5 = generateNumber() * 1000;*/
//atomic bomb
/*let groupRank_6 = generateNumber();
let secondsWaitRank_6 = generateNumber() * 1000;*/
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
    atomicLeft = await loadImage("./atomicleft.png");
    staticBomb = await loadImage("./staticbomb.png");
    frog = await loadImage("./frog.png");
    lotus = await loadImage("./lotus.png");
    ovni = await loadImage("./ovni.png");
    tankLeft = await loadImage("./tankleft.png");
    tankRight = await loadImage("./tankright.png");
    explotion = await loadImage("./explotion.png");
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
  secondsWaitRank_11 = Math.max(0, secondsWaitRank_11 - gameSpeed);
  secondsWaitRank_10 = Math.max(0, secondsWaitRank_10 - gameSpeed);
  secondsWaitRank_9 = Math.max(0, secondsWaitRank_9 - gameSpeed);
  secondsWaitRank_8 = Math.max(0, secondsWaitRank_8 - gameSpeed);
  secondsWaitRank_7 = Math.max(0, secondsWaitRank_7 - gameSpeed);
  // ni l'ovni ni la bomba tenen
  //secondsWaitRank_6 = Math.max(0, secondsWaitRank_6 - gameSpeed); -> ovni no té
  /*secondsWaitRank_5 = Math.max(0, secondsWaitRank_5 - gameSpeed);
  secondsWaitRank_4 = Math.max(0, secondsWaitRank_4 - gameSpeed);
  secondsWaitRank_3 = Math.max(0, secondsWaitRank_3 - gameSpeed);*/
  secondsWaitRank_2 = Math.max(0, secondsWaitRank_2 - gameSpeed);
  secondsWaitRank_1 = Math.max(0, secondsWaitRank_1 - gameSpeed);
};
const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.width);
  //de dalt avall
  //FASE ULTIMA 800x100 (x,y) -> total 16x2 celdes
  //en la segona fila-> bombes estàtiques
  lastPhase();
  riverPhase();
  transitionPhase();
  warPhase();
  if (explotionBool === true) {
    //el gameSpeed està en 10, aleshores han de passar 10fotogrames x a q siga 0'1 sec
    if (explotionCounter < gameSpeed * 10) {
      explotionCounter += gameSpeed;
      ctx.drawImage(explotion, 15 * cell, 10 * cell, cell, cell);
      ctx.drawImage(explotion, 0, 13 * cell, cell, cell);

    } else {
      explotionBool = false;
      explotionCounter = 0;
    }
  }
  

  home();
};
const lastPhase = () => {
  ctx.fillStyle = "#cbf078";
  ctx.fillRect(0, 0, cell * 16, cell * 2);
  ctx.strokeRect(0, 0, cell * 16, cell * 2);
  //-----dibuixar bombes estàtiques
  positionsStaticBombsLast.forEach((position) => {
    ctx.drawImage(staticBomb, position.x * cell, position.y * cell, cell, cell);
  });
};
const riverPhase = () => {
  //800x250 ->  total 16x4 celdes
  ctx.fillStyle = "#9fd3c7";
  ctx.fillRect(0, cell * 2, cell * 16, cell * 5);
  ctx.strokeRect(0, cell * 2, cell * 16, cell * 5);
  drawObstacles(
    [
      positionLotus_r11,
      positionLotus_r10,
      positionLotus_r9,
      positionLotus_r8,
      positionLotus_r7,
    ],
    [50, 50, 50, 50, 50],
    [lotus, lotus, lotus, lotus, lotus]
  );
};

const transitionPhase = () => {
  //800x50
  ctx.fillStyle = "#c7b198";
  ctx.fillRect(0, cell * 7, cell * 16, cell);
  ctx.strokeRect(0, cell * 7, cell * 16, cell);
  positionsStaticBombsTransition.forEach((position) => {
    ctx.drawImage(staticBomb, position.x * cell, position.y * cell, cell, cell);
  });
};
const update = () => {
  updateLotus();
  updateWar();
};
const drawObstacles = (arrayPositions, width, images) => {
  for (let i = 0; i < arrayPositions.length; i++) {
    let array = arrayPositions[i];
    let image = images[i];
    let widthCell = width[i];
    for (let j = 0; j < array.length; j++) {
      ctx.drawImage(image, array[j].x, array[j].y, widthCell, cell);
    }
  }
};
const updateLotus = () => {
  //sino ho tinguera en variables globals, shaguera pogut fer mes eficient xo es el q hi ha
  if (positionLotus_r11.length > 0) {
    if (secondsWaitRank_11 > 0) {
      positionLotus_r11 = positionLotus_r11.filter((item) => {
        return item.x >= -150 && item.x <= 800;
      });
      positionLotus_r11.forEach((item) => {
        item.x += 1;
      });
    } else {
      positionLotus_r11.forEach((item) => {
        item.x += 1;
      });
      if (positionLotus_r11[positionLotus_r11.length - 1].x >= 350) {
        for (let i = 0; i < groupRank_11; i++) {
          positionLotus_r11.push({ x: (0 + i) * -50, y: 2 * 50 });
        }
        groupRank_11 = generateNumber();
        secondsWaitRank_11 = generateNumber() * 1000;
      }
    }
  } else {
    for (let i = 0; i < groupRank_11; i++) {
      positionLotus_r11.push({ x: (0 + i) * -50, y: 2 * 50 });
    }
  }

  if (positionLotus_r10.length > 0) {
    if (secondsWaitRank_10 > 0) {
      positionLotus_r10 = positionLotus_r10.filter((item) => {
        return item.x >= -150 && item.x <= 800;
      });
      positionLotus_r10.forEach((item) => {
        item.x += -1;
      });
    } else {
      positionLotus_r10.forEach((item) => {
        item.x += -1;
      });
      if (positionLotus_r10[positionLotus_r10.length - 1].x <= 450) {
        for (let i = 0; i < groupRank_10; i++) {
          positionLotus_r10.push({ x: (16 - i) * 50, y: 50 * 3 });
        }
        groupRank_10 = generateNumber();
        secondsWaitRank_10 = generateNumber() * 1000;
      }
    }
  } else {
    for (let i = 0; i < groupRank_10; i++) {
      positionLotus_r10.push({ x: (16 - i) * 50, y: 50 * 3 });
    }
  }

  if (positionLotus_r9.length > 0) {
    if (secondsWaitRank_9 > 0) {
      positionLotus_r9 = positionLotus_r9.filter((item) => {
        return item.x >= -150 && item.x <= 800;
      });
      positionLotus_r9.forEach((item) => {
        item.x += 1;
      });
    } else {
      positionLotus_r9.forEach((item) => {
        item.x += 1;
      });
      if (positionLotus_r9[positionLotus_r9.length - 1].x >= 350) {
        for (let i = 0; i < groupRank_9; i++) {
          positionLotus_r9.push({ x: (0 + i) * -50, y: 50 * 4 });
        }
        groupRank_9 = generateNumber();
        secondsWaitRank_9 = generateNumber() * 1000;
      }
    }
  } else {
    for (let i = 0; i < groupRank_9; i++) {
      positionLotus_r9.push({ x: (0 + i) * -50, y: 50 * 4 });
    }
  }

  if (positionLotus_r8.length > 0) {
    if (secondsWaitRank_8 > 0) {
      positionLotus_r8 = positionLotus_r8.filter((item) => {
        return item.x >= -150 && item.x <= 800;
      });
      positionLotus_r8.forEach((item) => {
        item.x += -1;
      });
    } else {
      positionLotus_r8.forEach((item) => {
        item.x += -1;
      });
      if (positionLotus_r8[positionLotus_r8.length - 1].x <= 450) {
        for (let i = 0; i < groupRank_8; i++) {
          positionLotus_r8.push({ x: (16 - i) * 50, y: 50 * 5 });
        }
        groupRank_8 = generateNumber();
        secondsWaitRank_8 = generateNumber() * 1000;
      }
    }
  } else {
    for (let i = 0; i < groupRank_8; i++) {
      positionLotus_r8.push({ x: (16 - i) * 50, y: 50 * 5 });
    }
  }

  if (positionLotus_r7.length > 0) {
    if (secondsWaitRank_7 > 0) {
      positionLotus_r7 = positionLotus_r7.filter((item) => {
        return item.x >= -150 && item.x <= 800;
      });
      positionLotus_r7.forEach((item) => {
        item.x += 1;
      });
    } else {
      positionLotus_r7.forEach((item) => {
        item.x += 1;
      });
      if (positionLotus_r7[positionLotus_r7.length - 1].x >= 350) {
        for (let i = 0; i < groupRank_7; i++) {
          positionLotus_r7.push({ x: (0 + i) * -50, y: 50 * 6 });
        }
        groupRank_7 = generateNumber();
        secondsWaitRank_7 = generateNumber() * 1000;
      }
    }
  } else {
    for (let i = 0; i < groupRank_7; i++) {
      positionLotus_r7.push({ x: (0 + i) * -50, y: 50 * 6 });
    }
  }
};
const updateWar = () => {
  //ovni left, començara d'esquerra, arribarà fins a l'ultima cassella de la dreta i tornarà
  //sols posarem un d'estos
  /*let deltaOvniRight = 800/5;
  let counterOvniRight = 0;*/
  if (positionsOvnisRight.length > 0) {
    if (counterOvniRight < deltaOvniRight) {
      positionsOvnisRight[0].x += 5;
      counterOvniRight++;
      directionOvniRight = -1;
    } else if (
      counterOvniRight === deltaOvniRight &&
      directionOvniRight === -1
    ) {
      deltaOvniRight = 0;
      directionOvniRight = 1;
    } else if (counterOvniRight > deltaOvniRight) {
      positionsOvnisRight[0].x -= 5;
      counterOvniRight--;
    } else if (counterOvniRight === deltaOvniRight) {
      deltaOvniRight = 800 / 5 - 10;
      counterOvniRight = 0;
    }
  } else {
    positionsOvnisRight[0] = { x: 0, y: 400 };
  }
  //ara anema  pel tankleft
  if (positionsTanksLeft.length > 0) {
    if (secondsWaitRank_2 > 0) {
      positionsTanksLeft = positionsTanksLeft.filter((item) => {
        return item.x > -150 && item.x < 1150;
      });
      positionsTanksLeft.forEach((item) => {
        item.x += -1;
      });
    } else {
      positionsTanksLeft.forEach((item) => {
        item.x += -1;
      });
      if (positionsTanksLeft[positionsTanksLeft.length - 1].x <= 100) {
        for (let i = 0; i < groupRank_2; i++) {
          positionsTanksLeft.push({ x: (6 - i) * 150, y: 50 * 9 });
        }
        groupRank_2 = generateNumber();
        secondsWaitRank_2 = generateNumber() * 1000;
      }
    }
  } else {
    for (let i = 0; i < groupRank_2; i++) {
      positionsTanksLeft.push({ x: (6 - i) * 150, y: 50 * 9 });
    }
  }
  //ara farem la bomba direcció dreta

  if (positionsAtomicBombsRight.length > 0) {
    if (positionsAtomicBombsRight[0].x < 800) {
      positionsAtomicBombsRight[0].x += 10;
    } else {
      positionsAtomicBombsRight.pop();
      explotionBool = true;
    }
  } else {
    positionsAtomicBombsRight.push({ x: -100, y: 50 * 10 });
  }
  //ara al ovni left
  if (positionsOvnisLeft.length > 0) {
    if (counterOvniLeft < deltaOvniLeft) {
      positionsOvnisLeft[0].x -= 5;
      counterOvniLeft++;
      directionOvniLeft = 1;
    } else if (counterOvniLeft === deltaOvniLeft && directionOvniLeft === 1) {
      deltaOvniLeft = 0;
      directionOvniLeft = -1;
    } else if (counterOvniLeft > deltaOvniLeft) {
      positionsOvnisLeft[0].x += 5;
      counterOvniLeft--;
    } else if (counterOvniLeft === deltaOvniLeft) {
      deltaOvniLeft = 800 / 5 - 10;
      counterOvniLeft = 0;
    }
  } else {
    positionsOvnisLeft[0] = { x: 750, y: 550 };
  }
  //ara farem el tanque direcció dreta

  if (positionsTanksRight.length > 0) {
    if (secondsWaitRank_1 > 0) {
      positionsTanksRight = positionsTanksRight.filter((item) => {
        return item.x > -450 && item.x < 950;
      });
      positionsTanksRight.forEach((item) => {
        item.x += 1;
      });
    } else {
      positionsTanksRight.forEach((item) => {
        item.x += 1;
      });
      if (positionsTanksRight[positionsTanksRight.length - 1].x >= 550) {
        for (let i = 0; i < groupRank_1; i++) {
          positionsTanksRight.push({ x: (0 + i) * -150, y: 50 * 12 });
          console.log(i);
        }
        
        groupRank_1 = generateNumber();
        secondsWaitRank_1 = generateNumber() * 1000;
      }
    }
  } else {
    for (let i = 0; i < groupRank_1; i++) {
      positionsTanksRight.push({ x: (0 + i) * -150, y: 50 * 12 });
    }
  }
  console.log(positionsTanksRight);
  //i ara la bomba de dreta a esquerra
  if (positionsAtomicBombsLeft.length > 0) {
    if (positionsAtomicBombsLeft[0].x > 0) {
      positionsAtomicBombsLeft[0].x -= 10;
    } else {
      positionsAtomicBombsLeft.pop();
    }
  } else {
    positionsAtomicBombsLeft.push({ x: 900, y: 50 * 13 });
  }
};
const home = () => {
  ctx.fillStyle = "#cbf078";
  ctx.fillRect(0, cell * 14, cell * 16, cell * 6);
  ctx.strokeRect(0, cell * 14, cell * 16, cell * 6);
};

const warPhase = () => {
  ctx.fillStyle = "#dfd3c3";
  ctx.fillRect(0, cell * 8, cell * 16, cell * 6);
  ctx.strokeRect(0, cell * 8, cell * 16, cell * 6);
  drawObstacles(
    [
      positionsTanksRight,
      positionsAtomicBombsLeft,
      positionsOvnisRight,
      positionsTanksLeft,
      positionsAtomicBombsRight,
      positionsOvnisLeft,
    ],
    [150, 100, 50, 150, 100, 50],
    [tankRight, atomicLeft, ovni, tankLeft, atomicRight, ovni]
  );
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
