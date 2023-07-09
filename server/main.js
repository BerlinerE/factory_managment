const express = require('express');
const cors = require('cors')
const connectDB = require('./configs/db')
const session = require('express-session');
const cookieParser = require('cookie-parser');

const usersRouter = require('./routers/usersRouter');
const { router: middleRouter } = require('./middleware/middleRoute');

const departmentsRouter = require('./routers/departmentsRouter')
const employeesRouter = require('./routers/employeesRouter')
const shiftrouter = require('./routers/shiftRouter')


const app = express();
const port = 8000;

connectDB()
app.use(cors());
app.use(express.json());
app.use(cookieParser());
//app.use(express.urlencoded({ extended: true }));

const oneDay = 1000 * 60 * 60 * 24;

app.use(
  session({
    secret: "this-is-my-secret-key-in-nodejs",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
  })
);

// routers
app.use('/auth', middleRouter);
app.use('/users', usersRouter);
app.use('/departments', departmentsRouter);
app.use('/employees', employeesRouter )
app.use('/shifts', shiftrouter);


app.listen(
  port,
  () => console.log(`app is listening at http://localhost:${port}`)
);