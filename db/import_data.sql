USE censusdat;

SHOW VARIABLES LIKE 'local_infile';

-- Load education, employment, population, individual_incomes
LOAD DATA LOCAL INFILE 'income_out.csv'
INTO TABLE individual_incomes
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

LOAD DATA LOCAL INFILE 'employment_out.csv'
INTO TABLE employment
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

LOAD DATA LOCAL INFILE 'education_out.csv'
INTO TABLE education
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(geocode, geoname);

LOAD DATA LOCAL INFILE 'population_out.csv'
INTO TABLE population
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(geocode, geoname);
