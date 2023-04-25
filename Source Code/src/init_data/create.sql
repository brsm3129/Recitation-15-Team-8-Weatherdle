DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
    username VARCHAR(50) PRIMARY KEY,
    password CHAR(60) NOT NULL
);

DROP TABLE IF EXISTS guesses CASCADE;
CREATE TABLE guesses(
    username VARCHAR(50) PRIMARY KEY,
    puzzlenum INTEGER SECOND KEY,
	guess VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS userdata CASCADE;
CREATE TABLE userdata(
    username VARCHAR(50) PRIMARY KEY, 
    pfp INT,
    streak INT,
    avgGuess real,
    totalGames INT
    );
INSERT INTO userdata (username, pfp, streak, avgGuess, totalGames) VALUES ('test1', 1, 3, 5, 4);
