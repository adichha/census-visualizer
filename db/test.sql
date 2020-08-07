SELECT lon, lat, SUM(value)
FROM employment
NATURAL JOIN geocode_lut
WHERE age IN (2, 5) AND sex = 1 AND meta IN (2)
GROUP BY geocode, lon, lat;