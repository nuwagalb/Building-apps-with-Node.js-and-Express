const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const sessionsRouter = require('./src/routers/sessionsRouter');
const adminRouter = require('./src/routers/adminRouter');
const authRouter = require('./src/routers/authRouter');

//app should use any port that is provided when we 
//run the nodemon cmd. In our case we passed in 
//port 4000 as an environment variable while 
//running nodemon
const PORT = process.env.PORT || 3000
const app = express();

/**THE EXPRESS MIDDLE WARE HAS TO BE IN ORDER */

//app.use() is an express middleware
app.use(morgan('tiny'));

//set up a middle ware to handle our static files
//that express just needs to send back to the browser
//all the css, fonts, images, js and other static files
//will be sent to the browser from here
app.use(express.static(path.join(__dirname, '/public/')));

//return the contents of the request body
//before express 4.16, the bodyParser module used to handle this
//but for express 4.16 and above, use the steps below
app.use(express.json());
app.use(express.urlencoded({extended: false}));


//we will now work with our cookies and sessions
app.use(cookieParser());

//the session requires a secret to encode our cookie
app.use(session({secret: 'globomantics'}));

//let us set up passport for use
//passport.js returns a function that we execute immediately and pass
//app into it
//Note: passport must be set up after cookieParser and express-session
//because it requires them for it to work
require('./src/config/passport.js')(app);

//app.set() is used to set variables within our app
//context
app.set('views', './src/views');
app.set('view engine', 'ejs');

//set up a middle ware to handle all functionality that
//needs to be run before we can acess the /sessions route
app.use('/sessions', sessionsRouter);

//set up a middle ware to handle all functionality that
//needs to be run before we can acess the /admin route
app.use('/admin', adminRouter);

//set up a middle ware to handle all functionality that
//needs to be run before we can acess the /auth route
app.use('/auth', authRouter);


//routing to the '/' route, the sever should render
//the index.ejs file in our views folder
app.get('/', (req, res) => {
    //res.send('Hello Participant');
    res.render(
        'index', {
                    title: 'Globomantics', 
                    data: ['a', 'b', 'c']
                 }
    );
});

app.listen(PORT, () => {
    debug(`Listening on port ${chalk.green(PORT)}`);
});