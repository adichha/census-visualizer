-- Hard-coded SQL queries that fetch data from the different data categories
-- Filtering by age, sex, and meta parameters
SELECT lon, lat, SUM(value)
FROM education
         NATURAL JOIN geocode_lut
WHERE meta IN (2, 3)
  AND age IN (4, 5)
  AND sex = (2)
GROUP BY geocode, lon, lat
LIMIT 10;

SELECT lon, lat, SUM(value)
FROM population
         NATURAL JOIN geocode_lut
WHERE age IN (4, 5)
  AND sex = (2)
GROUP BY geocode, lon, lat
LIMIT 10;

SELECT lon, lat, SUM(value)
FROM employment
         NATURAL JOIN geocode_lut
WHERE meta IN (2, 3)
  AND age IN (4, 5)
  AND sex = (2)
GROUP BY geocode, lon, lat
LIMIT 10;

SELECT lon, lat, SUM(value)
FROM individual_incomes
 NATURAL JOIN geocode_lut
WHERE meta IN (2, 3)
  AND age IN (4, 5)
  AND sex = (2)
GROUP BY geocode, lon, lat
LIMIT 10;

SELECT SUM(e.value) / SUM(p.value) as count, g.lat, g.lon
FROM employment e
NATURAL JOIN geocode_lut g,
     population p
WHERE e.meta IN :metas
  AND e.age IN :ages
  AND e.sex = :sex
  AND e.geocode = g.geocode
  AND p.geocode = g.geocode
GROUP BY g.geocode, g.lon, g.lat;

-- Get a user profile
SELECT *
FROM user_profiles
WHERE username = 'johndoe@gmail.com6';

-- Create a user profile
INSERT INTO user_profiles (username, first_name, last_name, password_hash, salt, num_queries)
VALUES ('johndoe@gmail.com', 'John2', 'Doe2', 'uw', 'cs247', 5);

-- Query to verify that the user token is valid for authentication purposes
SELECT token
FROM login_tokens
WHERE username = 'johnny';

-- Search for users
-- For final demo, the visibility of profiles will be enabled
SELECT *
FROM user_profiles
WHERE visibility = 'public'
    AND username LIKE '%johnny%'
   OR first_name LIKE '%john%'
   OR last_name LIKE 'doe'
ORDER BY username DESC
LIMIT 25;

-- Get the saved queries for the user
SELECT query
FROM saved_queries
WHERE uid in (
    SELECT uid
    FROM user_profiles
    WHERE username = 'johndoe@gmail.com6'
)
;

-- Create a saved query
INSERT INTO saved_queries (uid, last_updated, query)
VALUES (1, NOW(), '{
  "key1": "value1"
}');

