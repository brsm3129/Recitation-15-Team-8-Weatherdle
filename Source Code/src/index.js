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
// allows use of resources
app.use( express.static( "resources" ) );
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
app.use(express.static('resources'));
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
  res.json({ status: 'success', message: 'Welcome!' });
});

// ************************************************
// <!-- Section 4 : TODOs Enpoint Implementation-->
// ************************************************

// TODO - Include your API routes here
app.get('/', (req, res) => {
  //check if first time
    //if user has a session stored pull up their game
    //if not pull up fresh page and instructions
  //res.json({message:'first visit'})
  res.redirect('/login'); 
});

app.get('/login', (req, res) => {
  res.render('pages/login');
})

app.get('/register', (req, res) => {
  res.render('pages/register');
});
app.get('/profile', (req, res) => {
  var username = null;
  var isUser = false;
  var login = false;
  if(!req.query.username){
    if (!req.session.user) {
      res.redirect('/weatherdle');
    } else {
      username = req.session.user.username;
      isUser = true;
      login = true;
    }
  } else{
    username = req.query.username
  }
  console.log(username);
  console.log(query);

    //Userdata query
    var query = `select * from userdata WHERE username = '${username}';`;
    //User ranking query
    var query2 = `select t.Rank from (select ROW_NUMBER() OVER(ORDER BY streak DESC) AS Rank, username FROM userdata) t where t.username = '${username}'`;
    var query3 = `select t.Rank from (select ROW_NUMBER() OVER(ORDER BY avgGuess ASC) AS Rank, username FROM userdata) t where t.username = '${username}'`;
  

  if(username){
  db.task('get-everything', task => {
    return task.batch([task.any(query), task.any(query2), task.any(query3)]);
  })
    // if query execution succeeds
    // query results can be obtained
    // as shown below
    .then(data => {
      res.render('pages/profile', {
        login,
        user: data[0][0],
        rank: [data[1][0].rank, data[2][0].rank],
        isUser
      });
    })
    // if query execution fails
    // send error message
    .catch(err => {
      console.log('Uh Oh spaghettio');
      console.log(err);
      res.status('400').json({
        current_user: '',
        city_users: '',
        error: err,
      });
    });
  }

});
app.get('/profile/change', (req,res) =>{
  res.redirect('/profile');
});
app.post('/profile/change', (req,res) => {
  var username = null;

  if(!req.query.username){
    if (!req.session.user) {
      res.redirect('/weatherdle');
    } else {
      username = req.session.user.username;
    }
  } else{
    username = req.query.username
  }

  var query = `UPDATE userdata SET pfp = $1 WHERE username = $2`;

  db.any(query, [req.body.pfp, username])
  // if query execution succeeds
  // send success message
  .then(function (data) {
    console.log(query);
    
    res.redirect('/profile');
    
  })
  // if query execution fails
  // send error message
  .catch(function (err) {
    return console.log(err);
  });
});

app.get('/leaderboard', (req, res) => {
  //order by streak, then by average if the streak is the same
  var username = null;

  var query = "select * from userdata ORDER BY streak DESC, avgGuess ASC;";

  var scope = req.query.scope;
  var sort = req.query.sort;
  var login = false;
  
    if (!req.session.user) {
      res.redirect('/login');
    } else {
      username = req.session.user.username;
      login = true;
    }
    var userQuery = `select * from userdata WHERE username = '${username}';`;

  //console.log(sort);
  if (sort == "avg"){
      //order by average, then by streak if the average is the same
    query = "select * from userdata ORDER BY avgGuess ASC, streak DESC;";
  }
  if(username){
    db.task('get-everything', task => {
      return task.batch([task.any(query), task.any(userQuery)]);
    })
  .then(data =>{
    console.log(userQuery);
    res.render('pages/leaderboard', {
      login,
      user: data[1][0],
      users: data[0]
    });
  });
}
});

//if user is not logged in, load an empty table
//if user is logged in, retrieve guesses
app.get('/weatherdle', (req,res) => {
  var login = false;

  var username;
  if(req.session.user) {
    username = req.session.user.username;
    login = true;
  } 
  else{
    res.redirect('/login')
  }
  var userQuery = `select * from userdata WHERE username = '${username}';`
  if(username != undefined) {
    //get both the user's guesses and the target city data
    const userguesses = `SELECT * FROM guesses WHERE username = '${username}'`;
    const targetcity = `SELECT * FROM guesses WHERE username = 'targetcity'`;
    db.task('get-everything', task => {
      return task.batch([task.any(userguesses), task.any(targetcity),task.any(userQuery)]);
    })
    .then(function (data) {
      //get weather data for each guess and the target city
      const targetdataquery = `SELECT * FROM weather_data WHERE location = '${data[1][0].guess1}'`
      db.any(targetdataquery)
      .then(targetdata => {
        var tasks = [];
        if(data[0].length > 0) {
          for(var i = 1; i <= 8; i++) {
            tasks.push(`SELECT * FROM weather_data WHERE location = '${data[0][0][`guess${i}`]}'`);
          }
          db.task(`get all guess data`, task => {
            return task.batch([task.any(tasks[0]), task.any(tasks[1]), task.any(tasks[2]),task.any(tasks[3]),task.any(tasks[4]), task.any(tasks[5]),task.any(tasks[6]),task.any(tasks[7])]);
          })
          .then(function (guessdata) {
            var guesses = [];
            for(var i = 0; i < 8; i++) {
              if(guessdata[i].length > 0) {
                correct_guess = targetdata[0].location == guessdata[i][0].location;
                city_name = guessdata[i][0].location;
                if(correct_guess) {
                  summer_hi = {
                    value : guessdata[i][0].summer_high,
                    higher: false,
                    close: false,
                    correct: true
                  }
                  summer_lo = {
                    value : guessdata[i][0].summer_low,
                    higher: false,
                    close: false,
                    correct: true
                  }
                  longest_day = {
                    value : guessdata[i][0].summer_longest_day,
                    higher: false,
                    close: false,
                    correct: true
                  }
                  winter_hi = {
                    value : guessdata[i][0].winter_high,
                    higher: false,
                    close: false,
                    correct: true
                  }
                  winter_lo = {
                    value : guessdata[i][0].winter_low,
                    higher: false,
                    close: false,
                    correct: true
                  }
                  shortest_day = {
                    value : guessdata[i][0].winter_longest_day,
                    higher: false,
                    close: false,
                    correct: true
                  }
                } else {
                  summer_hi = {
                    value : guessdata[i][0].summer_high,
                    higher: (guessdata[i][0].summer_high > targetdata[0].summer_high),
                    close: ((guessdata[i][0].summer_high - targetdata[0].summer_high) < 5),
                    correct: false
                  }
                  summer_lo = {
                    value : guessdata[i][0].summer_low,
                    higher: (guessdata[i][0].summer_low > targetdata[0].summer_low),
                    close: ((guessdata[i][0].summer_low - targetdata[0].summer_low) < 5),
                    correct: false
                  }
                  longest_day = {
                    value : guessdata[i][0].summer_longest_day,
                    higher: (guessdata[i][0].summer_longest_day > targetdata[0].summer_longest_day),
                    close: ((guessdata[i][0].summer_longest_day - targetdata[0].summer_longest_day) < .25),
                    correct: false
                  }
                  winter_hi = {
                    value : guessdata[i][0].winter_high,
                    higher: (guessdata[i][0].winter_high > targetdata[0].winter_high),
                    close: ((guessdata[i][0].winter_high - targetdata[0].winter_high) < 5),
                    correct: false
                  }
                  winter_lo = {
                    value : guessdata[i][0].winter_low,
                    higher: (guessdata[i][0].winter_low > targetdata[0].winter_low),
                    close: ((guessdata[i][0].winter_low - targetdata[0].winter_low) < 5),
                    correct: false
                  }
                  shortest_day = {
                    value : guessdata[i][0].winter_longest_day,
                    higher: (guessdata[i][0].winter_longest_day > targetdata[0].winter_longest_day),
                    close: ((guessdata[i][0].winter_longest_day - targetdata[0].winter_longest_day) < .25),
                    correct: false
                  }
                }
                guesses.push({
                  correct_guess: correct_guess,
                  city_name: city_name,
                  summer_hi: summer_hi,
                  summer_lo: summer_lo,
                  longest_day: longest_day,
                  winter_hi: winter_hi,
                  winter_lo: winter_lo,
                  shortest_day: shortest_day
                });
              }
            }
            res.locals.guesses = guesses;
            res.render('pages/weatherdle', {
              login,
              user: data[2][0],
              guesses: guesses});

          });
        } else {

          res.locals.guesses = [];
          res.render('pages/weatherdle', {guesses: []});
        }
      });
        
    })
    } else {
      res.locals.guesses = [];
      res.locals.username = [];
      res.render('pages/weatherdle');
    }
});

app.post('/weatherdle', async (req, res) => {
  const username = req.session.user.username;
  const guess = req.body.city;

  try {
    // Find the first available Guess column for the given user
    let insertColumn = 'guess1';
    var results = []
    for (let i = 1; i <= 8; i++) {
      const checkQuery = `SELECT Guess${i} FROM guesses WHERE username='${username}'`;
      results[i-1] = await db.query(checkQuery);
    }
    if(results[0].length > 0) {
      for( let i = 1; i <= 8; i++) {
        insertColumn = `guess${i}`;
        if(results[i-1][0][`${insertColumn}`] == null) {
          i = 9;
          break;
        }
      }
    }
    // Insert the guess into the first available Guess column for the given user
    // if user is in the table, then update
    
    if (insertColumn !== '') {
      var insertquery;
      if(insertColumn === 'guess1') {
        const insertQuery = await db.query(`INSERT INTO guesses (username, ${insertColumn}) VALUES ($1, $2);`,[username, guess]);
        console.log('Guess inserted successfully!');
        const check = await db.query(`SELECT * FROM guesses WHERE username='${username}'`);
        console.log(check);
      } else {
        const updateQuery = `UPDATE guesses SET ${insertColumn}='${guess}' WHERE username='${username}'`;
        const updateResult = await db.query(updateQuery);
        console.log('Guess inserted successfully!');
        const check = await db.query(`SELECT * FROM guesses WHERE username='${username}'`);
        console.log(check);
      }
    }

    // Send the response
    res.redirect('/weatherdle');
  } catch (err) {
    // Handle the error
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

  // Register
  app.post('/register', async (req, res) => {
    //hash the password using bcrypt library

    // To-DO: Insert username and hashed password into 'users' table
    //hash the password using bcrypt library
    const hash = await bcrypt.hash(req.body.password, 10);
    // Insert username and hashed password into 'users' table
    let query = `INSERT INTO users (username, password) VALUES ($1, $2) returning *;`;
    let query2 =`INSERT INTO userdata (username, pfp, streak, longestStreak, avgGuess, totalGames, totalGuesses, correctGuesses) VALUES ($1, 1, 0, 0, 0, 0, 0, 0);`;
    const username = req.body.username;  
    // Redirect to GET /login route page after data has been inserted successfully.

      db.task('get-everything', task => {
        return task.batch([task.any(query,[username, hash]), task.any(query2,[username])]);
      })
      .then(query => {
        res.redirect('/login');
        res.render('pages/login')
      })
      .catch(error => {
        // If the insert fails, redirect to GET /register route.
        console.log(error);
        res.render('pages/register', { message: "Error: Registration Failed", error: true });
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
      res.redirect('/datafetching'); //this api helps the data to be inserted and then redirects to the weatherdle page if this is skipped the data will not be inserted into the table.
      //res.redirect('/weatherdle')
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

app.get("/datafetching",async(req,res)=>{


// FOR APPLICATION 

  // const stateCapitals = [
  //   { state: 'Colorado', city: 'Denver'},
  //   { state: 'Alaska', city: 'Juneau'},
  //   { state: 'Arizona', city: 'Phoenix'},
  //   { state: 'Texas', city: 'Austin'},
  //   { state: 'California', city:'San Fransisco'},
  //   { state: 'New York ', city:'New York City'},
  //   { state: 'Florida', city:'Maimi'},
  //   { state: 'Illinois', city:'Chicago'},
  //   {state: 'Massachusetts', city: 'Boston'}
  //   // Add more state capitals as necessary
  // ];


  //FOR TESTING

  const stateCapitals = [
    { state: 'Colorado', city: 'Denver'},
    { state: 'Alaska', city: 'Juneau'},
    { state: 'Arizona', city: 'Phoenix'},
    // Add more state capitals as necessary
  ];
  let date1= '2022-06-01';
  let date2= '2022-06-15'
for(let i=0; i< stateCapitals.length;i++){  
  const { state, city } = stateCapitals[i];

  let smaxx=-1000;  let sminn=1000;  var slongestday=0;

  let wmaxx=-1000; let wminn=1000; let wlongestday=0;

  //for summer data
  axios({
    url: `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${date1}/${date2}`,
    method: 'GET',
    dataType: 'json',
    headers: {
      'Accept-Encoding': 'application/json',
    },
    params: {
      unitGroup: 'us',
      include: 'obs',
      key: process.env.API_KEY
    }, 
  })
    .then(results => {
      const data = results.data;
      const { resolvedAddress, days } = data;
 
      const formattedData = days.map(day => [
         city,
         state, 
         day.datetime, 
         day.tempmax, 
         day.tempmin,
         day.sunrise,  
         day.sunset
        ]);
        // Insert data into database
        // console.log(formattedData);  //high_temp, low_temp, sunrise, sunset
        for(let j=0; j<formattedData.length; j++){
          const dateTimeString = formattedData[j][2]+'T'+formattedData[j][5];
              const dateTimeString2=  formattedData[j][2]+'T'+formattedData[j][6];
              let sunrise= new Date(dateTimeString);
              let sunset= new Date(dateTimeString2);
           daylength=sunset-sunrise

          if(formattedData[j][4]<sminn){
            sminn=formattedData[j][4];
          }
          if(formattedData[j][3]>smaxx){
            smaxx=formattedData[j][3];
          }
          if(slongestday<daylength){
            slongestday=daylength;
          }
        }
       
      //   if (error) throw error;
        
      
      // console.log(slongestday);
       date1= '2022-12-01';
       date2= '2022-12-15'
      // // for winter data
      axios({
        url: `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${date1}/${date2}`,
        method: 'GET',
        dataType: 'json',
        headers: {
          'Accept-Encoding': 'application/json',
        },
        params: {
          unitGroup: 'us',
          include: 'obs',
          key: process.env.API_KEY
        }, 
      })
        .then(results => {
          const data = results.data;
          const { resolvedAddress, days } = data;
     
          const formattedData = days.map(day => [
             city,
             state, 
             day.datetime, 
             day.tempmax, 
             day.tempmin,
             day.sunrise,  
             day.sunset
            ]);
      //       // Insert data into database
      //       // console.log(formattedData);  //high_temp, low_temp, sunrise, sunset
            let wmaxx=-1000;
            let wminn=1000;
            let wlongestday=0;
            for(let j=0; j<formattedData.length; j++){
              const dateTimeString = formattedData[j][2]+'T'+formattedData[j][5];
              const dateTimeString2=  formattedData[j][2]+'T'+formattedData[j][6];
              let wsunrise= new Date(dateTimeString);
              let wsunset= new Date(dateTimeString2);
              let wdaylength=wsunset-wsunrise
              if(formattedData[j][4]<wminn){
                wminn=formattedData[j][4];
              }
              if(formattedData[j][3]>wmaxx){
                wmaxx=formattedData[j][3];
              }
              if(wlongestday<wdaylength){
                wlongestday=wdaylength;
              }
            }
    
          //   if (error) throw error;
            
          });
          let sass= formattedData[0][0]+','+formattedData[0][1];
      const query = `INSERT INTO weather_data (location, summer_high, summer_low, summer_longest_day , winter_high, winter_low,  winter_longest_day) VALUES('${sass}', ${smaxx}, ${sminn}, ${slongestday}, ${wmaxx}, ${wminn}, ${wlongestday});`
      db.any(query)
      .then((data)=>{
        console.log(`Weather data for ${city}, ${state} inserted successfully!`);
      })
      .catch((err) => {

        console.log(err);
      });
    });
  }
  res.redirect('/weatherdle');
}); 


app.post('/logout', (req, res) => {
  req.session = null;
  res.json({ success: true });
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