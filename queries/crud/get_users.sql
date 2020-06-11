USE censusdat;
-- Get hash
SELECT salt
FROM user_profiles
WHERE username = 'johndoe@gmail.com';

-- Get first_name, last_name of user
SELECT first_name, last_name, uid
FROM user_profiles
WHERE username = 'johndoe@gmail.com' AND password_hash='uw';
