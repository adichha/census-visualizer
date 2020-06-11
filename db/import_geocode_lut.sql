USE censusdat;

SHOW VARIABLES LIKE 'local_infile';

LOAD DATA LOCAL INFILE 'CA/AgeSex/98-400-X2016003_ENG_CSV/Geo_starting_row_CSV.csv'
INTO TABLE geocode_lut
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(geocode, geoname);