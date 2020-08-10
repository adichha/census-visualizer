-- Below is a just a sample of the queries that we execute on the database


-- Feature 1 : Creating queries
-- This query shows a sample insertion
INSERT INTO saved_queries (uid, last_updated, query)
VALUES (1, NOW(), '{
  "key1": "value1"
}');


-- Feature 2 : Getting saved queries
-- This query shows a sample lookup for all the shared queries of a user
SELECT query
FROM saved_queries
WHERE uid in (
    SELECT uid
    FROM user_profiles
    WHERE username = 'johndoe@gmail.com6'
)
;

-- Feature 3 : Querying and filtering data from the datasets
-- Sample queries for filtering based on age, sex, and meta parameters
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


-- Feature 4 : Friends
-- This query shows searching for friends
SELECT *
FROM user_profiles
WHERE visibility = 'public'
    AND username LIKE '%johnny%'
   OR first_name LIKE '%john%'
   OR last_name LIKE 'doe'
ORDER BY username DESC
LIMIT 25;


-- Feature 5 : Update saved queries
UPDATE saved_queries
SET query = '{
  "key1": "value1"
}'
WHERE uid = 1 AND qid = 2;


-- Feature 6 : Deleting saved queries
DELETE FROM saved_queries
WHERE uid = 1 AND qid = 2;


-- Feature 7 : Login/logout and user-profiles

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
