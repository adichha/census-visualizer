USE censusdat;
-- Create saved query
INSERT INTO saved_queries (uid, last_updated, query) VALUES (1, NOW(), '{"key1": "value1", "key2": "value2"}');

-- Update the user_profiles table accordingly
UPDATE user_profiles
SET num_queries = num_queries + 1
WHERE uid = 1
;
