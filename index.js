const rain = {
    state: {
        canvas: document.querySelector("#canvas"),
        lineList: [],
        dropList: [],
        speed: 15,
        width: window.innerWidth,
        height: window.innerHeight,
        offsetX: 0,
        mousePos: [0,0],
        radius: 35,
    },
    init: function() {
        const { canvas, width, height } = rain.state;
        canvas.width = width;
        canvas.height = height;
        rain.render();
        window.onmousemove = (e) => {
            rain.state.offsetX = parseFloat((e.clientX - width/2)/50);
            rain.state.mousePos = [e.clientX, e.clientY];
        }
        // 页面大小发生变化时，重置canvas画布大小
        window.onresize = function () {
            rain.state.width = window.innerWidth;
            rain.state.height = window.innerHeight;
            canvas.width = rain.state.width;
            canvas.height = rain.state.height;
        }
    },
    // 创建雨滴
    initLine: function(x, y) {
        const line = {
            x,
            y,
        }
        rain.state.lineList.push(line);
    },
    // 创建溅射水滴
    initDrop: function(x, y) {
        for (let i = 0; i < parseInt(Math.random()*6); i++) {
            const drop = {
                x: x + Math.random() * 5,
                y: y + Math.random() * 5,
                vy: Math.random() * -9
            };
            rain.state.dropList.push(drop);
        }
    },
    // 渲染画布
    render: function() {
        const { canvas, lineList, dropList, speed, width, height, offsetX, mousePos, radius } = rain.state;
        const ctx = canvas.getContext("2d");
        for (let i = 0; i < 3; i++) {
            const x = parseInt(Math.random() * width);
            rain.initLine(x, -10);
        }
        ctx.clearRect(0, 0, width, height);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#fff";
        // 绘制雨滴
        lineList.forEach((e, index) => {
            ctx.beginPath();
            ctx.moveTo(e.x, e.y);
            e.x = e.x + offsetX;
            e.y = e.y + speed + parseInt(Math.random() * 5);
            ctx.lineTo(e.x, e.y);
            ctx.stroke();
            if (e.y > height - 100 || Math.sqrt((Math.pow(Math.abs(mousePos[0] - e.x), 2) + Math.pow(Math.abs(mousePos[1] - e.y), 2))) < radius) {
                lineList.splice(index, 1);
                rain.initDrop(e.x, e.y)
            }
        });
        ctx.lineWidth = 1;
        // 绘制溅射雨滴
        dropList.forEach((e, index) => {
            ctx.beginPath();
            ctx.arc(e.x, e.y, 3, Math.random() * Math.PI * 2, 1 * Math.PI);
            ctx.stroke();
            e.x = e.x + offsetX * Math.random()*3;
            e.vy = e.vy + 0.5;
            e.y = e.y + e.vy;
            if (e.y > height) {
                dropList.splice(index, 1);
            }
        });

        window.requestAnimationFrame(() => {
            setTimeout(rain.render, 30);
        });
    }
}

window.onload = () => {
    rain.init();
}
