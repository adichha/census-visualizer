# Census-Visualizer-
census data visualizer for cs348

We are running MySQL through Amazon RDS running in an EC2 instance. To set it up, we followed the steps in the documentation here: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_GettingStarted.CreatingConnecting.MySQL.html.


We plan to export the publicly available census data on the Canadian and American government websites as .csv files. We will sanitize the input, wrangle it to conform to our schema, and then insert it into the database.

In order to create the sample database execute the create table script in the db folder. In order to populate 
the sample database run test-sample.sql in the queries folder. 
