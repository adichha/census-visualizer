SELECT lon, lat, SUM(e.value) / SUM(e2.value)
FROM employment e
NATURAL JOIN geocode_lut g, employment e2
WHERE e.age IN (2, 5) AND e.sex = 1 AND e.meta IN (1, 2) AND e2.age IN (2, 5) AND e2.sex = 1 AND e2.meta IN (1, 2) AND e.geocode = g.geocode AND e2.geocode = g.geocode
GROUP BY g.geocode, g.lon, g.lat;

SELECT lon, lat, e.value, SUM(e2.value)
FROM education e
INNER JOIN geocode_lut g ON e.geocode = g.geocode
INNER JOIN education e2 ON e2.geocode = g.geocode AND e.sex = e2.sex AND e.age = e2.age
WHERE e.sex = 1 AND e.age IN (1) AND e.meta = (2)
    AND e2.meta = 1
GROUP BY g.geocode, g.lon, g.lat, e.value;


SELECT e.value / SUM(e2.value), g.lon, g.lat
FROM employment e
INNER JOIN employment e2 ON e.geocode = e2.geocode AND e.sex = e2.sex AND e.age = e2.age
INNER JOIN geocode_lut g ON g.geocode = e.geocode
WHERE e.sex = 1 AND e.age = 1 AND e.meta = 2
GROUP BY g.lon, g.lat, e.value;