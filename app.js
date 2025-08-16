const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const flash = require('connect-flash');
const expressSession = require('express-session');

require("dotenv").config();

const ownersRouter = require('./routes/ownersRouter');
const usersRouter = require('./routes/usersRouter');
const productsRouter = require('./routes/productsRouter');
const indexRouter = require('./routes/index');

const db = require('./config/mongoose-connection');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    expressSession({
        secret: process.env.SESSION_SECRET,
        resave: false,
        sevUninitialized: false,
    })
)

app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', indexRouter);
app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);

app.get('/cart1', (req, res) => {
    res.render('cart1');
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
 