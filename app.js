var createError = require('http-errors');
var express = require('express');
const helmet = require("helmet");
var path = require('path');
var express = require('express');
// var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
const multer = require("multer");
const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
      // no larger than 10mb.
      fileSize: 10 * 1024 * 1024,
    },
});
var dbConfig = require('./config/database');
// routes
var authRouter = require('./routes/auth');
var usersRouter = require('./routes/user');
var itemsRouter = require('./routes/item');
var favoriteRouter = require('./routes/favorite');
var reviewRouter = require('./routes/review');
var categoryRouter = require('./routes/category');
var notificationRouter = require('./routes/notification');

mongoose.connect(dbConfig.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error:'));
db.once('open', function() {
    // we're connected!
    console.log("DB connection successful");
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());

app.use(logger('dev'));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(express.json());
app.use(multerMid.array("files", 10));
app.use(express.static('public'));
app.use(cookieParser());
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', function(req, res, next) {
//     res.render('index');
// });

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/items', itemsRouter);
app.use('/api/favorite', favoriteRouter);
app.use('/api/review', reviewRouter);
app.use('/api/category', categoryRouter);
app.use('/api/notification', notificationRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;