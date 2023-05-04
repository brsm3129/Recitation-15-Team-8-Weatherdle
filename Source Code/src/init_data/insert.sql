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
    VALUES ('Jeuno, Alaska', 64, 51, 18.3, 1, -3, 6.4);
INSERT INTO weather_data (location, summer_high, summer_low, summer_longest_day, winter_high, winter_low, winter_longest_day )
    VALUES ('Phoenix, Arizona', 104, 79, 14.3, 67, 38, 10);
INSERT INTO weather_data (location, summer_high, summer_low, summer_longest_day, winter_high, winter_low, winter_longest_day )
    VALUES ('New York, New York', 79, 64, 15.1, 44, 28, 9.3);
INSERT INTO weather_data (location, summer_high, summer_low, summer_longest_day, winter_high, winter_low, winter_longest_day )
    VALUES ('Honolulu, Hawaii', 87, 74, 13.4, 81, 67, 10.8);
INSERT INTO weather_data (location, summer_high, summer_low, summer_longest_day, winter_high, winter_low, winter_longest_day )
   VALUES ('Portland, Oregon', 74, 53, 15.7, 46, 37, 8.7);
INSERT INTO weather_data (location, summer_high, summer_low, summer_longest_day, winter_high, winter_low, winter_longest_day )
    VALUES ('Atlanta, Georgia', 90, 72, 14.4, 54, 36, 9.9);
INSERT INTO weather_data (location, summer_high, summer_low, summer_longest_day, winter_high, winter_low, winter_longest_day )
    VALUES ('Miami, Florida', 91, 78, 14.7, 76, 61, 10.5);
INSERT INTO weather_data (location, summer_high, summer_low, summer_longest_day, winter_high, winter_low, winter_longest_day )
    VALUES ('Albuquerque, New Mexico', 90, 62, 14.5, 48, 26, 9.8);
INSERT INTO weather_data (location, summer_high, summer_low, summer_longest_day, winter_high, winter_low, winter_longest_day )
    VALUES ('Cheyenne, Wyoming', 77, 49, 15.1, 40, 18, 9.2);
INSERT INTO weather_data (location, summer_high, summer_low, summer_longest_day, winter_high, winter_low, winter_longest_day )
    VALUES ('Las Vegas, Nevada', 105, 82, 14.6, 59, 41, 9.7);
