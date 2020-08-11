# Census-Visualizer
census data visualizer for cs348

We are running MySQL through Amazon RDS running in an EC2 instance. To set it up, we followed the steps in the documentation here: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_GettingStarted.CreatingConnecting.MySQL.html.


We plan to export the publicly available census data on the Canadian government website as .csv files. We will sanitize the input, wrangle it to conform to our schema, and then insert it into the database.

## Obtaining the dataset

The following are the links for obtaining the production dataset from the Canadian census website. Make sure to download the csv file for the entire table under the right subsection.

Income Data:

https://www12.statcan.gc.ca/census-recensement/2016/dp-pd/dt-td/Rp-eng.cfm?TABID=4&LANG=E&A=R&APATH=3&DETAIL=0&DIM=0&FL=A&FREE=0&GC=01&GL=-1&GID=1341679&GK=1&GRP=1&O=D&PID=110587&PRID=10&PTYPE=109445&S=0&SHOWALL=0&SUB=0&Temporal=2017&THEME=131&VID=0&VNAMEE=&VNAMEF=&D1=0&D2=0&D3=0&D4=0&D5=0&D6=0

Employment Data:

https://www12.statcan.gc.ca/census-recensement/2016/dp-pd/dt-td/Rp-eng.cfm?TABID=4&LANG=E&A=R&APATH=3&DETAIL=0&DIM=0&FL=A&FREE=0&GC=01&GL=-1&GID=1257309&GK=1&GRP=1&O=D&PID=111848&PRID=10&PTYPE=109445&S=0&SHOWALL=0&SUB=0&Temporal=2017&THEME=124&VID=0&VNAMEE=&VNAMEF=&D1=0&D2=0&D3=0&D4=0&D5=0&D6=0

Education Data:

https://www12.statcan.gc.ca/census-recensement/2016/dp-pd/dt-td/Rp-eng.cfm?TABID=4&LANG=E&A=R&APATH=3&DETAIL=0&DIM=0&FL=A&FREE=0&GC=01&GL=-1&GID=1257309&GK=1&GRP=1&O=D&PID=110634&PRID=10&PTYPE=109445&S=0&SHOWALL=0&SUB=0&Temporal=2017&THEME=123&VID=0&VNAMEE=&VNAMEF=&D1=0&D2=0&D3=0&D4=0&D5=0&D6=0

Population Data:

https://www12.statcan.gc.ca/census-recensement/2016/dp-pd/dt-td/Rp-eng.cfm?TABID=4&LANG=E&A=R&APATH=3&DETAIL=0&DIM=0&FL=A&FREE=0&GC=01&GL=-1&GID=1234506&GK=1&GRP=1&O=D&PID=109524&PRID=10&PTYPE=109445&S=0&SHOWALL=0&SUB=0&Temporal=2016&THEME=115&VID=0&VNAMEE=&VNAMEF=&D1=0&D2=0&D3=0&D4=0&D5=0&D6=0

In order to sanitize the data, first change the name of the file to be the name of the dataset (e.g income.csv), then run the appropriate function (e.g sanitize_income) in /db/csv_editor.py. Make sure that the csv downloaded from the website is in the same directory as the python script. The outputted file (e.g income_out.csv) will contain the data in a format which can be uploaded into the table.

In order to create the sample database execute the create table script in the db folder. In order to populate 
the sample database run test-sample.sql in the queries folder.

## Populating the DB
Once the sanitized *_out.csv's have been produced by executing the python script on the raw census dataset, run /db/import_data.sql. This will populate each DB table with the appropriate data. 
To populate the meta lut's, such as age_range_lut and income_meta_lut, execute the following sql scripts.
- db/import_geocode_lut.sql
- db/import_education_lut.sql
- db/import_labour_lut.sql
- db/import_income_meta_lut.sql
- db/import_sex_lut.sql

## Implemented Features

1. __Creating queries__
Whenever a user creates a new “query” on the frontend and saves it, the backend runs an insert query to persist it in the user_queries table. Immediately following this, a DB trigger runs to update the query count in the user_profiles table. __Optimization:__ Triggers were added to automatically update certain database fields, including last modified time, and number of queries. When a query is initially created or edited by the user, the last updated column for the query table is updated to be the current time. When the user creates/deletes the query, we increment/decrement the field that tracks the number of queries owned by the user.

2. __Getting saved queries__ 
The user can see all the queries that they have saved. This is done by selecting all entries in the saved_table relation with the same uid as the uid associated with the current user’s username. This query will reflect a user’s current saved queries after creating/editing/deleting queries is done.

3. __Querying and filtering data for education, employment, population, and individual income data__
Give users the ability to query for and filter the census data for the categories listed above. Based on the specific parameters selected by the user, we run a custom SQL query on the backend, and return the data. Generally, each query generally performs a selection operation to filter by parameters like age, and sex, then does a join with the geocode_lut table to determine the geographic location of each record. These are then grouped by common parameters, and aggregated with a function (SUM, AVERAGE, etc) and the final result is returned. Sample Query that fetches data by geocode for education Sample Query to return a normalized response by geocode for employment __Optimization__: We were struggling with query performance when we started using our production dataset given that it was around ~4GB in size. We created indices that reflected the nature of our queries - on sex, age, and meta - to reduce query time to ~10 seconds.
The following is a sample index created for the income table:

4. __Friends__
Get all users from the database as well as search for a specific user. We support fuzzy searching on the frontend by using wildcards on the username, user first name, and user last name parameters in the executed SQL query. As well, only users who have their visibility set as public will appear in these searches. View the queries of a friend and copy them to be your own. To view the friend’s queries, we get the friend’s username from the frontend. With this, we find the uid of the friend and find all of the queries they own in the saved_queries table. These are returned to you. This query follows the same format as getting a user’s saved queries from feature 2. To perform a copy operation, you select a specific query on the frontend. Based on the uid of your friend and the qid of the selected query, we locate it in the shared_queries table, duplicate it, and insert it as a new record, this time as a query owned by you. This query will cause a series of insertions with the same format as the insert operation from feature 1a.  Adding friends This operation is made possible by the search operation of friends described above. Once the user has selected a list of people they would like to be friends with, we insert a record in the user_friends relation for each intended friendship.

5. __Updating saved queries__
This allows users to edit the saved queries they have previously created. Upon clicking “save” on the frontend, we execute an update statement on the saved_queries table in the DB. The query to modify is located based on qid, and then the new parameters (age, sex, bezier, meta) are stored.
Data is visualized using a linear curve for normalization purposes. However, this can lead to query results that simply do not have enough contrast to be visible. Therefore, queries can also be modified with a custom bezier to accentuate features of interest - like making the brighter spots areas more intense, or brightening the areas that are currently shaded lightly. Once the user is satisfied with the color/shading property of a query and hits save, these features are persisted via an update query on the database by finding the entry based on qid.
The SQL query for updating saved queries follows the same logic as creating saved queries. 

6. __Deleting saved queries__
This allows users to delete queries that they own. The user can select the queries they wish to delete and a list of the query ids is sent to the backend to be deleted. 
Queries are located in the saved_queries table based on the uid of the user and qid of the query. We then perform a transactional delete operation.

7. __Login/logout authentication and user profiles__
In order to use our application, users must register providing the username, first name, last name, and their password. This inserts a record into the user_profiles relationship. On a successful login, a user is issued a token that authenticates them to perform actions on our application. This token is persisted for the duration of the user’s session in the login_tokens table, and cleared on a logout. Furthermore, this token serves as the identification of a user. On every request to the backend, we lookup the uid associated with this token, which is then used to facilitate the requested operation. When a user wants to log into the application, their credentials are verified by querying the profile in the user_profiles relationship. Users have the ability to set certain preferences on their profile. This includes whether or not they would like to view the map visualization in light mode/dark mode, as well as set a profile avatar. These settings are stored on the user_profile, with provided functionality implemented by update queries to adjust these settings. These are fetched whenever the user logs in for a new session, and the UI renders with these custom settings.

The features we implemented:
We implemented all the features listed above in our project. Below are the files containing the core business logic and database interaction required for the implementation of each delivered feature. The database DDL (containing table definitions, indices, and triggers) is “db/create_tables.sql”.


__Feature #1__
CreateSearchQueryModal.js
UserQueryController.kt
SavedQueriesRepo.kt

__Feature #2__
Map.js
UserQueryController.kt
SavedQueriesRepo.kt

__Feature #3__
Map.js
UserQueryController.kt
DatasetPopulationRepo.kt
DatasetEducationRepo.kt
DatasetEmploymentRepo.kt
DatasetIncomesRepo.kt

__Feature #4__
FriendsPage.js 
SharedQueriesRepo.kt
FriendProfileRepo.kt
UserQueryController.kt

__Feature #5__
CreateSearchQueryModal.js 
UserQueryController.kt
SavedQueriesRepo.kt

__Feature #6__
Map.js
UserQueryController.kt
SavedQueriesRepo.kt

__Feature #7__
LoginPage.js, RegisterPage.js
UserProfileController.kt
UserQueryController.kt
UserProfile.kt
LoginTokenRepo.kt

## Features To Do
- Add the ability for users to mark their saved queries as private or public to enable visibility for other users.
- Friends features:
 - Find other users by username (lookups)
 - Add the ability to follow and unfollow profiles (modifies DB tables)
