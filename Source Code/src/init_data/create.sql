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
    avgGuess real,
    totalGames INT,
    totalGuesses INT,
    correctGuesses INT
    );
INSERT INTO userdata (username, pfp, streak, avgGuess, totalGames, totalGuesses, correctGuesses) VALUES ('test0', 1, 3, 5, 4, 20, 4);

