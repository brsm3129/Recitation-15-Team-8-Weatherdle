// *********************************
// <!-- Section 1 : Dependencies-->
// *********************************

// importing the dependencies
// Express is a NodeJS framework that, among other features, allows us to create HTML templates.
const express = require('express');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part B.

// ***********************************
// <!-- Section 2 : Initialization-->
// ***********************************

// defining the Express app
const app = express();
// using bodyParser to parse JSON in the request body into JS objects
app.use(bodyParser.json());
// Database connection details
const dbConfig = {
  host: 'db',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};
// Connect to database using the above details
const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

const user = {
    username: undefined,
    password: undefined,
    first_name: undefined,
    last_name: undefined,
    email: undefined,
  };


// ****************************************************
// <!-- Section 3 : Examples Enpoint Implementation-->
// ****************************************************

app.set('view engine', 'ejs'); // set the view engine to EJS
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.
app.use(express.static('resources'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});

// ************************************************
// <!-- Section 4 : TODOs Enpoint Implementation-->
// ************************************************

// TODO - Include your API routes here
app.get('/', (req, res) => {
  res.redirect('/login'); //this will call the /anotherRoute route in the API
});

app.get('/login', (req,res) => {
  res.render('pages/login');
})

app.get('/register', (req, res) => {
  res.render('pages/register');
});

app.get('/input_test', (req,res) => {
  res.render('pages/input_test');
});

app.post('/submit', (req,res) => {
  console.log(req.body);
  res.redirect('/input_test');
});

// Register
app.post('/register', async (req, res) => {
  //hash the password using bcrypt library

  // To-DO: Insert username and hashed password into 'users' table
  //hash the password using bcrypt library
  const hash = await bcrypt.hash(req.body.password, 10);

    // Insert username and hashed password into 'users' table
  let query = db.query('INSERT INTO users (username, password) VALUES ($1, $2)', [req.body.username, hash])

    // Redirect to GET /login route page after data has been inserted successfully.
  .then (query => {
    res.redirect('/login');
  })
  .catch (error => {
    // If the insert fails, redirect to GET /register route.
    res.render('pages/register', {message: "Error: Registration Failed", error:true});
  });
});


app.post('/login', async(req,res)=>{
  // check if password from request matches with password in DB

  db.query("SELECT password FROM users WHERE username = ($1);", [req.body.username])
  .then(async query => {
    const passwordMatch = await bcrypt.compare(req.body.password, query[0].password);
    user.username = req.body.username;
    if(!user || !passwordMatch){
      res.render('pages/login', {message: "Incorrect username or password", error:true});
    }
    else{
      req.session.user = user;
      req.session.save();
      res.redirect('/login');
    }
  })
  .catch(error => {
    res.redirect('/register');
  });
});

app.post('/apitest', async(req,res) => {
  axios({
    url: `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Denver%20Colorado/2023-03-17/2023-03-24?`,
    method: 'GET',
    dataType: 'json',
    headers: {
      'Accept-Encoding': 'application/json',
    },
    params: {
      contentType: req.body.contentType,
      unitGroup:'us',
      elements: 'datetime%2Ctempmax%2Ctempmin%2Chumidity%2Cprecip%2Csnow%2Csnowdepth%2Cwindgust%2Csunrise%2Csunset',
      include: 'stats%2C',
      key: process.env.API_KEY
    }
  })
    .then(results => {
      console.log(results.data.resolvedAddress); // the results will be displayed on the terminal if the docker containers are running // Send some parameters

      res.status(200).json({
        message:results.data.resolvedAddress
      });

    })
    .catch(error => {
      // Handle errors
      res.status(400).json({
        error: "API Key was not valid"
      });
    });
});


// Authentication Middleware.
const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    return res.redirect('/login');
  }
  next();
};

// Authentication Required
app.use(auth);

// *********************************
// <!-- Section 5 : Start Server-->
// *********************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');