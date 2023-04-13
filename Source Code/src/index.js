// *********************************
// <!-- Section 1 : Dependencies-->
// *********************************

// importing the dependencies
// Express is a NodeJS framework that, among other features, allows us to create HTML templates.
const express = require('express');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();

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
      res.redirect('/discover');
    }
  })
  .catch(error => {
    res.redirect('/register');
  });
});

// *********************************
// <!-- Section 5 : Start Server-->
// *********************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000, () => {
  console.log('listening on port 3000');
});