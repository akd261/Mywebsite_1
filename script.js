const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const splashScreen = document.getElementById('splash-screen');
const startButton = document.getElementById('start-button');

// Set canvas size
canvas.width = 800;
canvas.height = 400;

// Game objects
const paddleWidth = 10;
const paddleHeight = 60;
const ballSize = 8;

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 4,
    dy: 4,
    size: ballSize
};

let leftPaddle = {
    x: 50,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 5,
    score: 0
};

let rightPaddle = {
    x: canvas.width - 50 - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 5,
    score: 0
};

// Key states
let keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};

// Event listeners
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

startButton.addEventListener('click', () => {
    splashScreen.style.display = 'none';
    canvas.style.display = 'block';
    gameLoop();
});

function movePaddles() {
    // Left paddle
    if (keys.w && leftPaddle.y > 0) leftPaddle.y -= leftPaddle.dy;
    if (keys.s && leftPaddle.y < canvas.height - leftPaddle.height) leftPaddle.y += leftPaddle.dy;

    // Right paddle
    if (keys.ArrowUp && rightPaddle.y > 0) rightPaddle.y -= rightPaddle.dy;
    if (keys.ArrowDown && rightPaddle.y < canvas.height - rightPaddle.height) rightPaddle.y += rightPaddle.dy;
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collisions
    if (ball.y <= 0 || ball.y >= canvas.height) ball.dy *= -1;

    // Paddle collisions
    if (checkPaddleCollision(leftPaddle) || checkPaddleCollision(rightPaddle)) {
        ball.dx *= -1.1; // Increase speed slightly
    }

    // Score points
    if (ball.x <= 0) {
        rightPaddle.score++;
        resetBall();
    }
    if (ball.x >= canvas.width) {
        leftPaddle.score++;
        resetBall();
    }
}

function checkPaddleCollision(paddle) {
    return ball.x < paddle.x + paddle.width &&
           ball.x + ball.size > paddle.x &&
           ball.y < paddle.y + paddle.height &&
           ball.y + ball.size > paddle.y;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = 4 * (Math.random() > 0.5 ? 1 : -1);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    // Draw ball
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);

    // Draw center line
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    // Draw scores
    ctx.font = '32px "Courier New"';
    ctx.fillText(leftPaddle.score, canvas.width / 4, 50);
    ctx.fillText(rightPaddle.score, 3 * canvas.width / 4, 50);
}

function gameLoop() {
    movePaddles();
    moveBall();
    draw();
    requestAnimationFrame(gameLoop);
} 