function Chess(text) {
    this.text = text;
    this.canvas = document.querySelector("#canvas");
    this.ctx = this.canvas.getContext('2d');
    this.arcList = [];
    this.speed = 5; // 移动基量
    this.posX = 0; // 小球初始x坐标
    this.posY = 0; // 小球初始y坐标
}

Chess.prototype.init = function() {
    const { canvas } = this;
    this.posX = canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.posY = canvas.height - 50;
    // 页面大小发生变化时，重置canvas画布大小
    window.onresize = () => {
        this.posX = canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.posY = canvas.height - 50;
        this.draft();
    }
    this.draft();
}

Chess.prototype.draft = function() {
    const { ctx, text, canvas, arcList, posX, posY } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // this.arcList = [];
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    // 设置字体
    ctx.font = "488px bold 黑体";
    // 设置颜色
    ctx.fillStyle = "#000";
    // 设置水平对齐方式
    ctx.textAlign = "center";
    // 设置垂直对齐方式
    ctx.textBaseline = "middle";
    // 绘制文字（参数：要写的字，x坐标，y坐标）
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < imgData.width; x += 6) {
        for (let y = 0; y < imgData.height; y += 6) {
            var i = (y * imgData.width + x) * 4;
            if (imgData.data[i] === 0) {
                let speed = 5 + Math.random() * 10;
                let a = posX + Math.random() * 200;
                let b = posY + Math.random() * 200;
                arcList.push({
                    x: a,
                    y: b,
                    die: false, 
                    finalX: x,
                    finalY: y,
                    speedX: speed,
                    speedY: speed*(b - y)/(a - x)
                });
            }
        }
    }
    this.render();
}

Chess.prototype.render = function() {
    const { ctx, arcList } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    arcList.forEach(e => {
        ctx.beginPath();
        ctx.fillStyle = "#000";
        ctx.arc(e.x, e.y, 2, 0, 2 * Math.PI);
        ctx.fill();
        if(!e.die) {
            e.x = e.x - e.speedX;
            e.y = e.y - e.speedY;
        }
        if (e.x - e.finalX < 5) {
            e.die = true;
            e.x = e.finalX;
            e.y = e.finalY;
        }
    })
    window.requestAnimationFrame(() => {
        this.render();
    })
}

window.onload = () => {
    document.querySelector("#button").addEventListener("click", function() {
        const val = document.querySelector("#input").value;
        const chess = new Chess(val);
        chess.init();
    });
}
