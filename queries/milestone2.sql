SQL scripts:

Looking up geographic data in a certain dataset by age, sex, and meta parameters:
SELECT lon, lat, SUM(value)
FROM $dataset
NATURAL JOIN geocode_lut
WHERE meta IN (@meta) AND age IN (@age) AND sex = @sex
GROUP BY geocode, lon, lat;
Parameters: $dataset = (education, employment, income, etc.)

Importing in a dataset from a csv file:
USE censusdat;
SHOW VARIABLES LIKE 'local_infile';
LOAD DATA LOCAL INFILE 'CA/AgeSex/98-400-X2016003_ENG_CSV/Geo_starting_row_CSV.csv'
INTO TABLE geocode_lut
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(geocode, geoname);

Creating new users:
INSERT INTO user_profiles VALUES (username, firstName, lastName, password_hash, salt);

Checking for logged in users:
SELECT * FROM login_tokens t INNER JOIN user_profiles u ON u.username = t.username WHERE t.token = $token;

Finding profiles by name:
SELECT * FROM user_profiles WHERE visibility = ‘public’ AND (username LIKE (‘%’ + @input ‘%’) OR firstName LIKE (‘%’ + @input ‘%’) OR lastName LIKE (‘%’ + @input ‘%’)) LIMIT 25 ORDER BY username DESC;


Rest of the queries are pretty trivial (inserting into relations, etc.)
