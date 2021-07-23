const { error } = require('console');
var express = require('express');
var app = express();
//socket.io公式：
var http = require('http').Server(app);
var io = require('socket.io')(http);
//session公式：
var session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

//模板引擎
app.set("view engine", "ejs");
//静态服务
app.use(express.static("./public"));

app.get('/', (req, res, next) => {
    res.render('login')
})
let alluser = []
app.get('/login', (req, res) => {
    let user = req.query.user
    if (!user) {
        res.render('error', { 'error': '请输入用户名' })
    }
    if (alluser.indexOf('user') !== -1) {
        res.render('error', { 'error': '用户已存在' })
    }
    alluser.push(user)
    // 临时存储用户名
    req.session.user = user
    // window.sessionStorage.user = user
    res.redirect('/chat')
})
app.get('/chat', (req, res, next) => {
    if(!req.session.user){
		res.redirect("/");
		return;
	}
    res.render('chat',{"name":req.session.user})
})
io.on('connection', (socket) => {
    socket.on('content', (msg) => {
        io.emit('jishou',msg)
    })
})





http.listen(3000, () => {
    console.log('服务已开启 http://localhost:3000');
})