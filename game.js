function Game(canvas) {
    this.canvas = canvas;
    this.obstacleList = []; // 障碍物数组
    this.player = {}; // 记录玩家位置
    this.pSpeedY = 0;
    this.pSpeedX = 0;
}

// 初始化
Game.prototype.initGame = function() {
    const { canvas } = this;
    const _this = this;
    this.ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.player = {
        x: 100,
        y: canvas.height - 100
    }
    this.initObstacle();
    this.render();
    window.onkeydown = (e) => {
        if (e.key === "c" || e.key === "C" && _this.pSpeedY === 0) {
            _this.pSpeedY = -10;
        } else if (e.key === "ArrowRight") {
            _this.pSpeedX = 5;
        } else if (e.key === "ArrowLeft") {
            _this.pSpeedX = -5;
        }
    }
    window.onkeyup = (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            _this.pSpeedX = 0;
        }
    }
}

// 初始化玩家
Game.prototype.initPlyer = function() {
    const { ctx, player } = this;
    ctx.beginPath();
    ctx.fillStyle = "#535353";
    ctx.arc(player.x, player.y, 25, 0, 2*Math.PI);
    ctx.fill();
}

// 初始化障碍物
Game.prototype.initObstacle = function() {
    const { obstacleList, canvas } = this;
    const yh = [canvas.height - 100, canvas.height - 200, canvas.height - 170];
    let len = 0;
    if (obstacleList.length === 0) {
        for (let i = 0; i < 5; i++) {
            len = 300 + len + Math.random() * 100;
            obstacleList.push({
                x: len,
                y: yh[parseInt(Math.random() * 3)]
            });
        }
    }
    if (obstacleList.length < 8) {
        obstacleList.push({
            x: obstacleList[obstacleList.length - 1].x + 300 + Math.random() * 100,
            y: yh[parseInt(Math.random() * 3)]
        });
    }
}

// 渲染动画
Game.prototype.render = function() {
    const { obstacleList, ctx, canvas, pSpeedY, pSpeedX, player } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.y = player.y + pSpeedY;
    player.x = player.x + pSpeedX;
    if (player.x > canvas.width - 200 ) {
        this.pSpeedX = 0;
    }
    if (player.y < canvas.height - 300) {
        this.pSpeedY = 10;
    } else if (player.y > canvas.height - 100) {
        this.pSpeedY = 0;
    }
    this.initPlyer();
    this.initObstacle();
    obstacleList.forEach((e, index) => {
        ctx.beginPath();
        ctx.fillStyle = "#df7528";
        ctx.fillRect(e.x, e.y, 60, 40);
        e.x = e.x - 5;
        if(e.x < -500) {
            obstacleList.splice(index, 1); 
        }
    });
    window.requestAnimationFrame(() => {
        this.render();
    });
}

window.onload = () => {
    const game = new Game(document.querySelector("#game"));
    game.initGame();
}