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

- Add triggers to automatically update certain database fields, including last modified time, and number of queries.
- Create indexes on data tables to speed up query performance. Reduced average query time from > 1 minute to ~ 2 seconds. 
- DB Modification - Implement functionality for users to save queries of interest. Users can mark queries as private or public to enable visibility for other users.
- DB design - Easy database extensibility with lookup tables for quickly adding additional datasets
- DB design - First class support for spatial data in the database for geographic visualizations (crucial part of our application)
- DB design - native JSON support within the database to retrieve JSON objects directly from the DB through SQL
- DB modification - Friends features:
- Finding profiles by username - lookups
- Following and unfollowing profiles - modifiable relations
- View and saving their queries as your own
- Database security - added authentication between backend and DBMS (as they run on seperate machines) to provide secure access

The triggers and indexs are in the create_table.sql. The CRUD freatures can be found in the code for the backend in the folder backend/source/main/kotlin/com/beanz/censusviz/repos.
