const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playAgainButton = document.getElementById('playAgain');

// On-screen control buttons
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

const gridSize = 20;
let tileCount;
let snake;
let direction;
let food;
let score;
let gameOver;
let speed;

// Responsive canvas setup
function setupCanvas() {
  const canvasSize = Math.min(window.innerWidth - 20, window.innerHeight - 120); // Adjust for screen size
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  tileCount = canvas.width / gridSize;
}

// Initialize game
function initGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
  score = 0;
  gameOver = false;
  speed = 200; // Initial speed

  playAgainButton.style.display = 'none'; // Hide the play again button
  gameLoop(); // Start the game
}

// Control snake direction using keyboard
window.addEventListener('keydown', function(e) {
  switch (e.key) {
    case 'ArrowUp':
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
});

// Control snake direction using on-screen buttons
upBtn.addEventListener('click', () => {
  if (direction.y === 0) direction = { x: 0, y: -1 };
});
downBtn.addEventListener('click', () => {
  if (direction.y === 0) direction = { x: 0, y: 1 };
});
leftBtn.addEventListener('click', () => {
  if (direction.x === 0) direction = { x: -1, y: 0 };
});
rightBtn.addEventListener('click', () => {
  if (direction.x === 0) direction = { x: 1, y: 0 };
});

// Game loop
function gameLoop() {
  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", canvas.width / 4, canvas.height / 2);
    playAgainButton.style.display = 'block'; // Show the play again button
    return;
  }

  adjustSpeedBasedOnScore(); // Adjust speed dynamically based on score
  update();
  draw();
  
  setTimeout(gameLoop, speed); // Control snake speed based on points
}

// Adjust speed based on score
function adjustSpeedBasedOnScore() {
  if (score <= 5) {
    speed = 200; // Slow speed for score between 0 and 5
  } else if (score > 5 && score <= 10) {
    speed = 150; // Moderate speed for score between 6 and 10
  } else {
    speed = 100; // Faster speed for score above 10
  }
}

// Update snake and game state
function update() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check wall collision
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    gameOver = true;
  }

  // Check self collision
  for (let part of snake) {
    if (part.x === head.x && part.y === head.y) {
      gameOver = true;
    }
  }

  snake.unshift(head);

  // Check if food is eaten
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
  } else {
    snake.pop(); // Remove tail if not eating food
  }
}

// Draw the snake, food, and score
function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  for (let part of snake) {
    ctx.fillStyle = 'lime';
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
  }

  // Draw food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  // Draw score
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 20);
}

// Reset the game when Play Again is clicked
playAgainButton.addEventListener('click', function() {
  initGame(); // Restart the game
});

// Responsive canvas setup
window.addEventListener('resize', setupCanvas);
setupCanvas(); // Initial setup
initGame(); // Start the game
