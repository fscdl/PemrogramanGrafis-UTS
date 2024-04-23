const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const DINO_WIDTH = 40; // Lebar dinosaurus
const DINO_HEIGHT = 40; // Tinggi dinosaurus
const GROUND_HEIGHT = 20; // Tinggi tanah

let dinoY = (canvas.height - GROUND_HEIGHT - DINO_HEIGHT) / 2; // Posisi vertikal awal dinosaurus
let jumpVelocity = 0; // Kecepatan lompat
let isJumping = false; // Menandakan apakah dinosaurus sedang melompat
let isGameOver = false; // Menandakan apakah permainan berakhir
let score = 0; // Skor permainan

const cacti = []; // Array untuk menyimpan kaktus
const CACTUS_WIDTH = 25; // Lebar kaktus
const CACTUS_HEIGHT = 40; // Tinggi kaktus
const CACTUS_SPEED = 3; // Kecepatan pergerakan kaktus
const MIN_SPAWN_INTERVAL = 500; // Interval minimum untuk spawn kaktus
const MAX_SPAWN_INTERVAL = 1000; // Interval maksimum untuk spawn kaktus
let cactusSpawnTimer = 0; // Timer untuk spawn kaktus
let cactusSpawnDelay = getRandomSpawnInterval(); // Penundaan spawn kaktus
let initialJumpMade = false; // Menandakan apakah lompatan awal telah dilakukan
let needReset = false; // Menandakan apakah perlu mereset permainan

const dinoImage = new Image(); // Objek gambar untuk dinosaurus
dinoImage.src = 'dinosaurus.png'; // Sumber gambar dinosaurus
dinoImage.onload = function() {
    imagesLoaded();
};

const cactusImage = new Image(); // Objek gambar untuk kaktus
cactusImage.src = 'kaktus.png'; // Sumber gambar kaktus
cactusImage.onload = function() {
    imagesLoaded();
};

let imagesCount = 0; // Jumlah gambar yang telah dimuat
function imagesLoaded() {
    imagesCount++;
    if (imagesCount === 2) {
        gameLoop(); // Mulai loop permainan setelah semua gambar dimuat
    }
}

// Fungsi untuk mendapatkan interval spawn kaktus secara acak
function getRandomSpawnInterval() {
    return Math.random() * (MAX_SPAWN_INTERVAL - MIN_SPAWN_INTERVAL) + MIN_SPAWN_INTERVAL;
}

// Fungsi untuk menggambar dinosaurus
function drawDinosaur() {
    ctx.drawImage(dinoImage, 50, dinoY, DINO_WIDTH, DINO_HEIGHT);
}

// Fungsi untuk menggambar kaktus
function drawCactus(x, y) {
    ctx.drawImage(cactusImage, x, y, CACTUS_WIDTH, CACTUS_HEIGHT);
    // Menggambar garis di bawah kaktus dari ujung kiri ke ujung kanan
    ctx.beginPath();
    ctx.moveTo(0, y + CACTUS_HEIGHT);
    ctx.lineTo(canvas.width, y + CACTUS_HEIGHT);
    ctx.strokeStyle = "black";
    ctx.stroke();
}

// Fungsi untuk melompat
function jump() {
    if (!initialJumpMade) {
        initialJumpMade = true;
        cactusSpawnTimer = cactusSpawnDelay;
    }
    if (!isJumping && !isGameOver) {
        isJumping = true;
        jumpVelocity = 13;
    }
}

// Fungsi untuk memeriksa tabrakan
function checkCollision() {
    for (const cactus of cacti) {
        if (
            dinoY + DINO_HEIGHT >= cactus.y &&
            dinoY <= cactus.y + CACTUS_HEIGHT &&
            50 + DINO_WIDTH >= cactus.x &&
            50 <= cactus.x + CACTUS_WIDTH
        ) {
            isGameOver = true;
            gameOver();
        }
    }
}

// Fungsi untuk pembaruan permainan
function update() {
    if (isJumping) {
        dinoY -= jumpVelocity;
        jumpVelocity -= 0.8;
        if (dinoY >= (canvas.height - GROUND_HEIGHT - DINO_HEIGHT) / 2) {
            dinoY = (canvas.height - GROUND_HEIGHT - DINO_HEIGHT) / 2;
            isJumping = false;
            jumpVelocity = 0;
        }
    }

    if (initialJumpMade) {
        if (cactusSpawnTimer <= 0) {
            cacti.push({ x: canvas.width, y: (canvas.height - GROUND_HEIGHT - CACTUS_HEIGHT) / 2, scored: false });
            cactusSpawnTimer = getRandomSpawnInterval();
        } else {
            cactusSpawnTimer -= 16;
        }

        for (let i = 0; i < cacti.length; i++) {
            cacti[i].x -= CACTUS_SPEED;
            if (cacti[i].x + CACTUS_WIDTH < 0) {
                cacti.splice(i, 1);
                i--;
            }
        }

        checkCollision();

        for (let i = 0; i < cacti.length; i++) {
            if (cacti[i].x + CACTUS_WIDTH < 50 && !cacti[i].scored) {
                score++;
                cacti[i].scored = true;
            }
        }
    }
}

// Fungsi untuk menggambar elemen permainan
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDinosaur();
    drawCacti();
    drawScore();
}

// Fungsi untuk menggambar semua kaktus
function drawCacti() {
    for (const cactus of cacti) {
        drawCactus(cactus.x, cactus.y);
    }
}

// Fungsi untuk menggambar skor
function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, canvas.width - 100, 30);
}

// Fungsi utama permainan
function gameLoop() {
    update();
    draw();
    if (!isGameOver) {
        requestAnimationFrame(gameLoop);
    }
}

// Fungsi untuk mereset permainan
function resetGame() {
    isGameOver = false;
    score = 0;
    cacti.length = 0;
    initialJumpMade = false;
    cactusSpawnTimer = 0;
    gameLoop();
}

// Fungsi ketika permainan berakhir
function gameOver() {
    alert("Your Score : " + score);
    needReset = true;
}

// Mendengarkan tombol yang ditekan
document.addEventListener("keydown", event => {
    if (!isGameOver) {
        if (event.code === "Space" || event.code === "ArrowUp") {
            jump();
        } else if (event.code === "ArrowDown") {
            if (isJumping) {
                jumpVelocity -= 5;
            }
        }
    } else {
        if (needReset && (event.code === "Space" || event.code === "ArrowUp")) {
            resetGame();
            needReset = false;
        }
    }
});
