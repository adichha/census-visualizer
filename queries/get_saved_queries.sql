USE censusdat;
-- Get number of saved queries
SELECT num_queries
FROM user_profiles
WHERE uid=1;

-- Get the queries saved by the user
SELECT * from saved_queries
WHERE uid=1;
