SELECT lon, lat, SUM(value)
FROM population
NATURAL JOIN geocode_lut
WHERE age IN (1) AND sex = 1
GROUP BY geocode, lon, lat;