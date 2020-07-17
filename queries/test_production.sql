SELECT lon, lat, SUM(value)
FROM education
NATURAL JOIN geocode_lut
WHERE meta IN (2, 3) AND age IN (4, 5) AND sex = (2)
GROUP BY geocode, lon, lat
LIMIT 10;