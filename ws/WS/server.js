var http = require('http')
const fs = require('fs')
const url = require('url')

const WebSocket = require("ws")

let user = {}
let server = http.createServer((req, res) => {
    res.setHeader("content-type", "text/html;charset=utf8");
    let urlpath = url.parse(req.url).pathname

    if (urlpath === '/') {
        fs.readFile('./login.html', (err, data) => {
            res.end(data.toString())
        })
    } else if (urlpath === '/login') {
        let nickname = url.parse(req.url, true).query.user
        user.nickname = nickname;
        if (!nickname) {
            res.end("请输入昵称")
        }
        // window.localStorage.setItem('chat_message',user)
        fs.readFile('./chat.html', (err, data) => {
            res.end(data.toString())
        })
    } else {
        res.end('对不起没找到')
    }
})
const wss = new WebSocket.Server({ server })

function broadcast(obj) {
    wss.clients.forEach((client) => {
        client.send(obj.toString())
    })
}
wss.on("connection", (ws) => {
    console.log("server: receive connection");
    ws.on("message", (obj) => {
        console.log(obj.toString());
        if (obj.num == 1) {
            broadcast({
                num:1,
                uid:obj.uid,
                nickname:obj.nickname,
                user:user,
                msg:obj.nickname+'加入聊天室'
            })
        }
        if (obj.num == 2) {
            broadcast({
                num:2,
                uid:obj.uid,
                nickname:obj.nickname,
                user:user,
                msg:obj.msg
            })
        }
    })
})



server.listen(8080, () => {
    console.log('服务已开启 http://localhost:8080');
})












