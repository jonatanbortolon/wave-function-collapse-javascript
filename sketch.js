let tiles = [
  {
    image: null,
    connections: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  },
  {
    image: null,
    connections: {
      top: 1,
      right: 1,
      bottom: 0,
      left: 1
    }
  },
  {
    image: null,
    connections: {
      top: 1,
      right: 1,
      bottom: 1,
      left: 0
    }
  },
  {
    image: null,
    connections: {
      top: 0,
      right: 1,
      bottom: 1,
      left: 1
    }
  },
  {
    image: null,
    connections: {
      top: 1,
      right: 0,
      bottom: 1,
      left: 1
    }
  }
];

let boardWidth = 4;
let boardHeight = 4;

let board = Array.from({ length: boardWidth * boardHeight })
  .map((_, index) => ({
    tile: null,
    x: index % boardWidth,
    y: Math.floor(index / boardHeight),
    connections: Array.from({ length: tiles.length }).map((_, index) => index)
  }));

function preload() {
  tiles[0].image = loadImage('tiles/simple/1.jpg');
  tiles[1].image = loadImage('tiles/simple/2.jpg');
  tiles[2].image = loadImage('tiles/simple/3.jpg');
  tiles[3].image = loadImage('tiles/simple/4.jpg');
  tiles[4].image = loadImage('tiles/simple/5.jpg');
}

function setup() {
  createCanvas(boardWidth * 100, boardHeight * 100);

  background("black");

  setupBoard();

  paintFirstTile();
}

function draw() {
  paintTile();

  if (!board.some((boardPosition) => boardPosition.tile === null)) {
    finishPaint();
  }
}

function setupBoard() {
  for (const boardPosition of board) {
    stroke("white");
    fill("black");
    rect(boardPosition.x * 100, boardPosition.y * 100, 100, 100);
  }
}

function paintFirstTile() {
  const boardPositionIndex = Math.floor(random(board.length));

  const tile = random(tiles);

  board[boardPositionIndex].tile = tile;

  const boardPosition = board[boardPositionIndex];

  image(tile.image, boardPosition.x * 100, boardPosition.y * 100, 100, 100);

  updateNeighborsConnections(boardPositionIndex);
}

function paintTile() {
  let lowerOptionsNumber = tiles.length;
  let lowerOptions = [];

  for (const [index, boardPosition] of board.entries()) {
    if (boardPosition.tile !== null) {
      continue;
    }

    if (boardPosition.connections.length < lowerOptionsNumber) {
      lowerOptionsNumber = boardPosition.connections.length;
      lowerOptions = [index];
    }

    if (boardPosition.connections.length === lowerOptionsNumber) {
      lowerOptions.push(index);
    }
  }
  
  const boardLowerPositionIndex = random(lowerOptions);
  const boardPosition = board[boardLowerPositionIndex];
  
  const tileIndex = random(boardPosition.connections);
  const tile = tiles[tileIndex];
  
  board[boardLowerPositionIndex].tile = tile;

  image(tile.image, boardPosition.x * 100, boardPosition.y * 100, 100, 100);

  updateNeighborsConnections(boardLowerPositionIndex);
}

function updateNeighborsConnections(index) {
  const boardPosition = board[index];

  if (boardPosition.x > 0) {
    const boardLeftPosition = board[index - 1];

    if (boardLeftPosition.tile === null) {
      //Adjust connections to left position
      const connection = boardPosition.tile.connections.left;

      boardLeftPosition.connections = boardLeftPosition.connections.filter((neighborConnection) => 
        tiles[neighborConnection].connections.right === connection
      );
    }
  }

  if (boardPosition.x < boardWidth - 1) {
    const boardRightPosition = board[index + 1];

    if (boardRightPosition.tile === null) {
      //Adjust connections to right position
      const connection = boardPosition.tile.connections.right;

      boardRightPosition.connections = boardRightPosition.connections.filter((neighborConnection) => 
        tiles[neighborConnection].connections.left === connection
      );
    }
  }

  if (boardPosition.y > 0) {
    const boardTopPosition = board[index - boardWidth];

    if (boardTopPosition.tile === null) {
      //Adjust connections to top position
      const connection = boardPosition.tile.connections.top;

      boardTopPosition.connections = boardTopPosition.connections.filter((neighborConnection) => 
        tiles[neighborConnection].connections.bottom === connection
      );
    }
  }

  if (boardPosition.y < boardHeight - 1) {
    const boardBottomPosition = board[index + boardWidth];

    if (boardBottomPosition.tile === null) {
      //Adjust connections to bottom position
      const connection = boardPosition.tile.connections.bottom;

      boardBottomPosition.connections = boardBottomPosition.connections.filter((neighborConnection) => 
        tiles[neighborConnection].connections.top === connection
      );
    }
  }
}

function finishPaint() {
  noLoop();
}