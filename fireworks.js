function FireWorks(canvas) {
    this.canvas = canvas;
    this.fireList = [];  // 烟花数组
    this.bloomList = []; // 爆炸后的小烟花数组
    this.nightList = []; // 星空数组
    this.speed = 15; // 烟花上升速度
}

FireWorks.prototype.init = function() {
    const { canvas } = this;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.ctx = canvas.getContext('2d');
    this.initNight();
    this.render();
    // 页面大小发生变化时，重置canvas画布大小
    window.onresize = function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}

// 初始化星空
FireWorks.prototype.initNight = function() {
    const { nightList } = this;
    // 生成星星
    for (let i = 0; i < 100; i++) {
        nightList.push({
            x: Math.random() * canvas.width, 
            y: Math.random() * 300, 
            radius: 1 + parseInt(Math.random() * 2)
        });
    }
}

// 绘制星空
FireWorks.prototype.drawNight = function() {
    const { ctx, nightList } = this;
    nightList.forEach(e => {
        ctx.beginPath();
        ctx.fillStyle = "#fff";
        ctx.arc(e.x, e.y, e.radius, 0, 2 * Math.PI);
        ctx.fill();
    })
}

// 渲染
FireWorks.prototype.render = function() {
    const { ctx, canvas, fireList, speed, getRgb } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (fireList.length < 5) {
        for (let i = 0; i < 3; i++) {
            this.fireList.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height - Math.random() * 50,
                speed: speed + Math.random() * 10,
                rgb: getRgb()
            });
        }
    }
    this.drawFire();
    this.drawNight();
    this.drawBloom();
    window.requestAnimationFrame(() => {
        setTimeout(() => {
            this.render();
        }, 20);
    });
}

// 绘制未爆炸时的烟花
FireWorks.prototype.drawFire = function() {
    const { ctx, fireList } = this;
    fireList.forEach((e, index) => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${e.rgb.r}, ${e.rgb.g}, ${e.rgb.b}, 1`;
        ctx.arc(e.x, e.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        this.drawTail({
            x: e.x, // 当前坐标
            y: e.y, // 当前坐标
            rgb: e.rgb,
            radius: 5
        });
        e.y = e.y - e.speed;
        if (e.y < (100 + Math.random()*100)) {
            fireList.splice(index, 1);
            this.initBloom({
                x: e.x, // 当前坐标
                y: e.y, // 当前坐标
                radius: 30 + parseInt(Math.random() * 50),
            });
        }
    });
}

// 绘制烟花上升时拖尾效果
FireWorks.prototype.drawTail = function(e) {
    const { ctx } = this;
    ctx.beginPath();
    const gra = ctx.createLinearGradient(e.x, e.y, e.x, e.y + 40);
    // 线性渐变
    gra.addColorStop(0, `rgba(${e.rgb.r}, ${e.rgb.g}, ${e.rgb.b}, 1`);
    gra.addColorStop(0.25, `rgba(${e.rgb.r}, ${e.rgb.g}, ${e.rgb.b}, 0.75`);
    gra.addColorStop(0.5, `rgba(${e.rgb.r}, ${e.rgb.g}, ${e.rgb.b}, 0.5`);
    gra.addColorStop(0.75, `rgba(${e.rgb.r}, ${e.rgb.g}, ${e.rgb.b}, 0.25`);
    gra.addColorStop(1, `rgba(${e.rgb.r}, ${e.rgb.g}, ${e.rgb.b}, 0`);
    ctx.fillStyle = gra;
    ctx.fillRect(e.x - e.radius + 1, e.y, 2 * e.radius - 2, 40);
}

// 初始化烟花碎屑
FireWorks.prototype.initBloom = function(e) {
    const { bloomList, getRgb } = this;
    for(let a=1;a<4;a++) {
        for (let i = 0; i < 7; i++) {
            const posx = e.radius * 0.5 * a * Math.sin(15 * i * 2 * Math.PI / 360); // 根据度数计算x坐标
            const posy = e.radius * 0.5 * a * Math.cos(15 * i * 2 * Math.PI / 360); // 根据度数计算y坐标
            bloomList.push({
                x: e.x - posx,
                y: e.y - posy,
                speedx: parseInt(Math.random() * 10) - 5,
                speedy: parseInt(Math.random() * 3) - 6,
                opacity: 1,
                rgb: getRgb()
            })
            bloomList.push({
                x: e.x - posx,
                y: e.y + posy,
                speedx: parseInt(Math.random() * 10) - 5,
                speedy: parseInt(Math.random() * 3) - 6,
                opacity: 1,
                rgb: getRgb()
            })
            bloomList.push({
                x: e.x + posx,
                y: e.y - posy,
                speedx: parseInt(Math.random() * 10) - 5,
                speedy: parseInt(Math.random() * 3) - 6,
                opacity: 1,
                rgb: getRgb()
            })
            bloomList.push({
                x: e.x + posx,
                y: e.y + posy,
                speedx: parseInt(Math.random() * 10) - 5,
                speedy: parseInt(Math.random() * 3) - 6,
                opacity: 1,
                rgb: getRgb()
            })
        }
    }
}

// 绘制烟花爆炸效果
FireWorks.prototype.drawBloom = function() {
    const { ctx, bloomList, canvas } = this;
    bloomList.forEach((e, index) => {
        ctx.beginPath();
        const radius = 2;
        ctx.fillStyle = `rgba(${e.rgb.r}, ${e.rgb.g}, ${e.rgb.b}, ${e.opacity})`;
        ctx.arc(e.x, e.y, radius, 0, 2 * Math.PI);
        ctx.fill();
        e.x = e.x + e.speedx;
        e.speedy = e.speedy + 0.5;
        e.y = e.y + e.speedy + Math.random() * 3;
        e.opacity = e.opacity - 0.02;
        if (e.opacity < 0) {
            bloomList.splice(index, 1);
        }
    });
}

// 随机生成烟花颜色
FireWorks.prototype.getRgb = function() {
    const rgb = {
        r: 55 + parseInt(Math.random() * 200),
        g: 55 + parseInt(Math.random() * 200),
        b: 55 + parseInt(Math.random() * 200),
    }
    return rgb;
}

window.onload = () => {
    const fireWorks = new FireWorks(document.querySelector("#canvas"));
    fireWorks.init();
};