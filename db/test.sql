SELECT lon, lat, SUM(value)
FROM education
NATURAL JOIN geocode_lut
WHERE meta IN (2) AND age IN (2) AND sex = 1
GROUP BY geocode, lon, lat;