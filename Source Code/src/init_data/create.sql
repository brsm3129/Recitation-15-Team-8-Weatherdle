DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
    username VARCHAR(50) PRIMARY KEY,
    password CHAR(60) NOT NULL
);

DROP TABLE IF EXISTS weather_data CASCADE;
CREATE TABLE weather_data(
    city VARCHAR(50),
    sta CHAR(60),
    dat VARCHAR(50),
    high_temp  FLOAT,
    low_temp FLOAT, 
    sunrise VARCHAR(50), 
    sunset VARCHAR(50)
);

DROP TABLE IF EXISTS userdata CASCADE;
CREATE TABLE userdata(
    username VARCHAR(50) PRIMARY KEY, 
    pfp INT,
    streak INT,
    longestStreak INT,
    avgGuess real,
    totalGames INT,
    totalGuesses INT,
    correctGuesses INT
    );

DROP TABLE IF EXISTS guesses CASCADE;
CREATE TABLE guesses(
    username VARCHAR(50) PRIMARY KEY,
    Guess1 VARCHAR(50),
    Guess2 VARCHAR(50),
    Guess3 VARCHAR(50),
    Guess4 VARCHAR(50),
    Guess5 VARCHAR(50),
    Guess6 VARCHAR(50),
    Guess7 VARCHAR(50),
    Guess8 VARCHAR(50)
);