INSERT INTO users (username, password) VALUES ('test1','password123');

INSERT INTO userdata (username, pfp, streak, longestStreak, avgGuess, totalGames, totalGuesses, correctGuesses) VALUES ('test1', 1, 3, 3, 5, 4, 1, 3);
INSERT INTO userdata (username, pfp, streak, longestStreak, avgGuess, totalGames, totalGuesses, correctGuesses) VALUES ('test2', 2, 4, 6, 4, 12, 1, 10);
INSERT INTO userdata (username, pfp, streak, longestStreak, avgGuess, totalGames, totalGuesses, correctGuesses) VALUES ('test3', 1, 1, 1, 2, 5, 1, 2);
INSERT INTO userdata (username, pfp, streak, longestStreak, avgGuess, totalGames, totalGuesses, correctGuesses) VALUES ('test4', 3, 6, 32, 3, 133, 1, 88);
INSERT INTO userdata (username, pfp, streak, longestStreak, avgGuess, totalGames, totalGuesses, correctGuesses) VALUES ('test5', 2, 2, 30, 4, 45, 1, 38);
INSERT INTO userdata (username, pfp, streak, longestStreak, avgGuess, totalGames, totalGuesses, correctGuesses) VALUES ('test6', 1, 6, 20, 1.5, 65, 1, 57);
INSERT INTO userdata (username, pfp, streak, longestStreak, avgGuess, totalGames, totalGuesses, correctGuesses) VALUES ('test7', 1, 7, 15, 3, 75, 1, 38);

INSERT INTO guesses (username, Guess1, Guess2, Guess3, Guess4, Guess5, Guess6, Guess7, Guess8) VALUES ('targetcity', 'Austin, Texas', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO guesses (username, Guess1, Guess2, Guess3, Guess4, Guess5, Guess6, Guess7, Guess8) VALUES ('brsm', 'Denver, Colorado', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

INSERT INTO weather_data (location, summer_high, summer_low, summer_longest_day, winter_high, winter_low, winter_longest_day )
    VALUES ('Austin, Texas', 96, 75, 14.1, 62, 43, 10.2);
INSERT INTO weather_data (location, summer_high, summer_low, summer_longest_day, winter_high, winter_low, winter_longest_day )
    VALUES ('Denver, Colorado', 88, 62, 15.0, 46, 23, 9.3);
INSERT INTO weather_data (location, summer_high, summer_low, summer_longest_day, winter_high, winter_low, winter_longest_day )
    VALUES ('San Fransisco, California', 72, 58, 14.8, 57, 46, 9.5);
INSERT INTO weather_data (location, summer_high, summer_low, summer_longest_day, winter_high, winter_low, winter_longest_day )
    VALUES ('Los Angeles, California', 80, 48, 14.2, 51, 39, 7.5);
INSERT INTO weather_data (location, summer_high, summer_low, summer_longest_day, winter_high, winter_low, winter_longest_day )
    VALUES ('Chicago, Illinois', 85, 55, 12.6, 52, 41, 8.7);
INSERT INTO weather_data (location, summer_high, summer_low, summer_longest_day, winter_high, winter_low, winter_longest_day )
    VALUES ('Miami, Florida', 70, 45, 14.8, 59, 43, 8.5);
INSERT INTO weather_data (location, summer_high, summer_low, summer_longest_day, winter_high, winter_low, winter_longest_day )
    VALUES ('Atlanta, Georgia', 72, 58, 13.2, 57, 46, 9.8);
INSERT INTO weather_data (location, summer_high, summer_low, summer_longest_day, winter_high, winter_low, winter_longest_day )
    VALUES ('Boston, Massachusetts', 66, 50, 15.8, 37, 36, 10.5);
INSERT INTO weather_data (location, summer_high, summer_low, summer_longest_day, winter_high, winter_low, winter_longest_day )
    VALUES ('Phoenix, Arizona', 77, 52, 14.4, 52, 44, 9.7);
INSERT INTO weather_data (location, summer_high, summer_low, summer_longest_day, winter_high, winter_low, winter_longest_day )
    VALUES ('New York City, New York', 67, 54, 13.6, 53, 48, 10.5);