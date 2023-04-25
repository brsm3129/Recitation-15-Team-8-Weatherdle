DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
    username VARCHAR(50) PRIMARY KEY,
    password CHAR(60) NOT NULL
);
CREATE TABLE guesses(
    username VARCHAR(50) PRIMARY KEY,
    puzzlenum INTEGER SECOND KEY,
	guess VARCHAR(50) NOT NULL
);