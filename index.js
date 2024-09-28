const express = require('express');
const mysql = require('mysql2/promise')
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const dbUser = require('./dbsetting')
const port = 3000;

const dbConfig = {
    host: dbUser.host,
    user: dbUser.user,
    password: dbUser.password,
    database: 'demo_testapp'
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public/")));

app.use(session({
    secret: 'secret_key',
    saveUninitialized: true,
    resave: false,
}));

app.get("/", (req, res) => {
    if (req.session.user) {
        res.render("home", { user: req.session.user });
    } else {
        res.render("home", { user: null });
    }
});

app.get("/login", (req, res) => {
    res.render("login", { message: '' });
});

app.get("/profile", (req, res) => {
    if (req.session.user) {
        res.render('profile', { user: req.session.user });
    } else {
        res.redirect('/');
    }
});

app.get("/register", (req, res) => {
    res.render('register', { errorMessage: null, redirect: false });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    let connection

    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.render('login', { message: 'ไม่พบชื่อผู้ใช้นี้ในระบบ'});
        }

        const user = rows[0];

        const match = await bcrypt.compare(password, user.password);

        if (match) {
            req.session.user = user;
            res.redirect('/profile');
        } else {
            res.render("login", { message: 'username หรือ password ไม่ถูกต้อง' });
        }
    } catch (e) {
        res.status(500).send("เกิดข้อผิดพลาด");
    } finally {
        if (connection) await connection.end();
    }
});

app.post("/logout", (req, res) => {
    req.session.destroy((logouted) => {
        if (logouted) {
            return res.redirect('/profile');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    })
});

app.post("/register", async (req, res) => {
    const { username, password, email, firstname, lastname, age, gender } = req.body;
    let connection;

    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);

        if (rows.length > 0) {
            return res.render('register', { errorMessage: 'username หรือ email นี้ถูกใช้งานแล้วกรุณากรอกใหม่', redirect: false});
        }

        const dateReg = new Date().toISOString().split('T')[0];
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await connection.execute('INSERT INTO users (username, password, email, firstname, lastname, age, gender, date_reg) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [username, hashedPassword, email, firstname, lastname, age, gender, dateReg]
        );

        res.render('register', { errorMessage: 'ลงทะเบียนเรียบร้อย', redirect: true});
    } catch (e) {
        res.status(500).send("เกิดข้อผิดพลาด");
    } finally {
        if (connection) await connection.end();
    }
});

app.listen(port, () => {
    console.log(`Server is ONLINE on port ${port}`)
});