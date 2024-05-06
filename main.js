let cells = 20;

let applePosition, currentDirection, head, snake, inPause, tickInterval;

const canvas = document.getElementById('gridCanvas');
const score = document.getElementById('score');
function drawGrid() {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  const cellSize = width / cells;

  ctx.clearRect(0, 0, width, height);

  for(let i = 0; i < snake.length; i++){
    ctx.fillStyle = i === 0 ? '#c2271f' : '#1bde48';
    ctx.fillRect(
      snake[i].x * cellSize,
      snake[i].y * cellSize,
      cellSize,
      cellSize
    );
  }

  const posx = applePosition.x * cellSize + cellSize / 2;
  const posy = applePosition.y * cellSize + cellSize / 2;

  ctx.fillStyle = "#f00";
  ctx.beginPath();
  ctx.arc(posx, posy, cellSize / 3, 0, 2 * Math.PI);
  ctx.fill();
}

const newApplePosition = () =>{
  const newPosition = { x: Math.floor(Math.random() * cells), y: Math.floor(Math.random() * cells) };
  if(inSnake(newPosition, false) || newPosition === applePosition){
    return newApplePosition();
  }
  return newPosition;
}

const directions = {right: 'r', left: 'l', up: 'u', down: 'd'};
function tick(){
  for(let i = snake.length - 1; i >= 1; i--){
    snake[i].x = snake[i - 1].x;
    snake[i].y = snake[i - 1].y;
  }
  if(currentDirection === directions.right){
    head.x++;
  }
  else if(currentDirection === directions.left){
    head.x--;
  }
  else if(currentDirection === directions.up){
    head.y--;
  }
  else if(currentDirection === directions.down){
    head.y++;
  }

  if(inApple(head)){
    snake.push({x: snake[snake.length - 1].x, y: snake[snake.length - 1].y});
    applePosition = newApplePosition();
    score.innerHTML = snake.length - 5;
  }

  if(inWall(head) || inSnake(head)){
    // alert("perdiste");
    reset()
  }
}

function reset(){
  head = { x: 6, y: 1 };
  snake = [head, {x: 5, y: 1}, {x: 4, y: 1}, {x: 3, y: 1}, {x: 2, y: 1}]
  applePosition = newApplePosition();
  currentDirection = directions.right;
  score.innerHTML = 0;
  inPause = true;
  clearInterval(tickInterval);

  drawGrid()
}
let then = performance.now();
const fps = 15;   
function gameLoop(now) {
  const elapsed = now - then;

  if (elapsed > 1000 / fps) {
    then = now - (elapsed % (1000 / fps));

    if (!inPause) {
      tick();
      drawGrid();
    }
  }

  requestAnimationFrame(gameLoop);
}

reset()
gameLoop()

function inApple({x, y}){
  return x === applePosition.x && y === applePosition.y;
}

function inWall({x, y}){
  return x < 0 || x >= cells || y < 0 || y >= cells;
}

function inSnake({x, y}, ignoreHead = true){
  for(let i = ignoreHead ? 1 : 0; i < snake.length; i++){
    if(x === snake[i].x && y === snake[i].y){
      return true;
    }
  }
  return false;
}

// Handle arrow key events
window.addEventListener('keydown', (event) => {
  if(event.key === ' ')
    inPause = !inPause;
  
  if(inPause) return;

  if(event.key === 'ArrowRight' && currentDirection !== directions.left){
    currentDirection = directions.right;
  }
  else if(event.key === 'ArrowLeft' && currentDirection !== directions.right){
    currentDirection = directions.left;
  }
  else if(event.key === 'ArrowUp' && currentDirection !== directions.down){
    currentDirection = directions.up;
  }
  else if(event.key === 'ArrowDown' && currentDirection !== directions.up){
    currentDirection = directions.down;
  } 
});

