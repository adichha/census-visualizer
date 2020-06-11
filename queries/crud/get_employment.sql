USE censusdat;

SELECT e.id, age, sex, year, region, value, meta, arl.display_name, sx.display_name, ccl.display_name, geoname
FROM employment e
JOIN age_range_lut arl ON e.age = arl.id
JOIN sex_lut sx ON e.sex = sx.id
JOIN country_codes_lut ccl on e.region = ccl.code
JOIN geocode_lut gl on e.geocode = gl.geocode
WHERE age_start > 1 AND age_end < 25
    AND sx.id = 1
    AND ccl.code = 'CAN'
    AND gl.geocode = e.geocode
;
