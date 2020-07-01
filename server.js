/*
* 加载【http】模块,该模块由javascript来编写
* 职责是创建 web 服务器 及 处理http相关的任务等
*/
const http = require('http');
var fs = require('fs');//引入文件读取模块

const hostname = '127.0.0.1';
const port = 3000;

// 通过 createServer 创建 web服务器
const server = http.createServer((req, res) => {
    //req 请求体：获取请求相关的信息（请求来自哪里、是get还是post）
    //res 响应体：告诉服务器给请求响应什么内容
    res.statusCode = 200;
    const url = './' + req.url;
    if (url === ".//") {
        fs.readFile('./index.html', function (err, data) {
            res.writeHeader(200, {
                'content-type': 'text/html;charset="utf-8"'
            });
            res.write(data);//将index.html显示在客户端
            res.end();
        })
        return;
    }
    fs.readFile(url, function (err, data) {
        /*
            一参为文件路径
            二参为回调函数
                回调函数的一参为读取错误返回的信息，返回空就没有错误
                二参为读取成功返回的文本内容
        */
        if (err) {
            res.writeHeader(404, {
                'content-type': 'text/html;charset="utf-8"'
            });
            res.write('<h1>404错误</h1><p>你要找的页面不存在</p>');
            res.end();
        } else {
            const type = req.url.split('.')[1];
            res.writeHeader(200, {
                'content-type': 'text/' + type + ';charset="utf-8"'
            });
            res.write(data);//将index.html显示在客户端
            res.end();
        }

    });
});
// 通过 listen 监听端口 的请求
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});