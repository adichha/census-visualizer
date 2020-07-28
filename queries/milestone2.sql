-- SQL scripts:

-- This query facilitates the lookup of geographic data in a certain dataset
-- filtering on age, sex, and meta parameters
-- Params: $dataset = (education, employment, income, etc.), $age = (from age_range_lut), $meta = (from meta lut)
SELECT lon, lat, SUM(value)
FROM $dataset
NATURAL JOIN geocode_lut
WHERE meta IN (@meta) AND age IN (@age) AND sex = @sex
GROUP BY geocode, lon, lat;

-- SQL script to populate the sanitized data into the database
-- This sample below shows how we populated the geocode_lut
-- but is trivially modified to support insertion into the other tables
USE censusdat;
SHOW VARIABLES LIKE 'local_infile';
LOAD DATA LOCAL INFILE 'CA/AgeSex/98-400-X2016003_ENG_CSV/Geo_starting_row_CSV.csv'
INTO TABLE geocode_lut
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(geocode, geoname);

-- Query to create a new user
INSERT INTO user_profiles VALUES (username, first_name, last_name, password_hash, salt);

-- Query to check where users that are logged in
-- Enables authentication check for security purposes
SELECT t.username, t.token FROM login_tokens t INNER JOIN user_profiles u ON u.username = t.username WHERE t.token = $token;

-- Query to find profiles by name
-- Params: a name string
SELECT username, first_name, last_name FROM user_profiles WHERE visibility = ‘public’ AND (username LIKE (‘%’ + @input ‘%’) OR first_name LIKE (‘%’ + @input ‘%’) OR last_name LIKE (‘%’ + @input ‘%’)) LIMIT 25 ORDER BY username DESC;

-- Rest of the queries are pretty trivial (inserting into relations, etc.)
