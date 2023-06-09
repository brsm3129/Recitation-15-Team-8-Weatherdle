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
    //get both the user's guesses and the target city data
    const dataquery = `SELECT * FROM weather_data`;
    const numEntries = `SELECT count(*) FROM weather_data`;

    db.task('get-everything', task => {
      return task.batch([task.any(dataquery),task.any(userQuery),task.any(numEntries)]);
    })
    .then(function (data) {
            res.render('pages/weatherdle', {
              login,
              length: 3,
              user: data[1][0],
              weather: data[0],
              answer: data[0][1]
            })
          });
});
app.post('/complete',  (req, res) =>{

  var username;
  const isWinner = req.body.win;
  const score = req.body.score;
  if(req.session.user) {
    username = req.session.user.username;
    login = true;
  } 
  else{
    res.redirect('/login');
  }
  var userQuery = `select * from userdata WHERE username = '${username}';`
  db.any(userQuery).then(results => {

    var streak = results[0].streak;
    console.log(score);
    var totalGuesses = results[0].totalguesses;
    totalGuesses = totalGuesses + score;
    var longestStreak = results[0].longeststreak;
    var correctGuesses = results[0].correctguesses;

    if(isWinner){
      correctGuesses = correctGuesses + 1;
      streak = streak+1;
    }else{
      streak = 0;
    }
    if(streak>longestStreak){
      longestStreak = streak;
    }
    var totalGames = results[0].totalgames;
    totalGames = totalGames + 1;
    var avgGuess = totalGuesses;
    if(totalGames){
      avgGuess = totalGuesses/totalGames;
    }

    console.log(`Score: ${score}`);
    let query = `UPDATE userdata SET streak = ${streak}, longestStreak =${longestStreak}, avgGuess=${avgGuess}, totalGames=${totalGames}, totalGuesses=${totalGuesses}, correctGuesses=${correctGuesses} WHERE username = '${username}';`;
    db.any(query);
    res.json({ success: true });
});


  

 
 

});

app.post('/weatherdle', async (req, res) => {
  
    res.redirect('/weatherdle');

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
  //   { state: 'Georgia', city: 'Atlanta'},
  //   { state: 'Arizona', city: 'Phoenix'},
  //   { state: 'Texas', city: 'Austin'},
  //   { state: 'California', city:'San Fransisco'},
  //   { state: 'California', city: 'Los Angles'},
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

  let smaxx= -Infinity;  let sminn=Infinity;  var slongestday=0;

  let wmaxx=-Infinity; let wminn=Infinity; let wlongestday=0;

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
    .then(async(results) => {
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
           daylength=sunset-sunrise;
           daylength=(daylength*(0.000000278)).toFixed(2);

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
       date2= '2022-12-15';
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
        .then(async(results) => {
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
              wdaylength= (wdaylength*(0.000000278)).toFixed(2);
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
            
          
          let sass= formattedData[0][0]+','+formattedData[0][1];
          if(wmaxx==-Infinity){
            wmaxx=30; wminn=10;wlongestday=8;
          }
      const query = `INSERT INTO weather_data (location, summer_high, summer_low, summer_longest_day , winter_high, winter_low,  winter_longest_day) VALUES('${sass}', ${smaxx}, ${sminn}, ${slongestday}, ${wmaxx}, ${wminn}, ${wlongestday});`
      db.any(query)
      .then((data)=>{
        console.log(`Weather data for ${city}, ${state} inserted successfully!`);
      })
      .catch((err) => {

        console.log(err);
      });
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