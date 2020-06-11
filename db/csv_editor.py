import csv

valid_entries = []
valid_age = {'15 to 24 years': 0, '25 to 34 years': 1, '35 to 44 years': 2, '45 to 54 years': 3, '55 to 64 years': 4, '65 years and over': 5}
count = 0
with open('employment.csv') as csv_file:
    reader = csv.reader(csv_file)
    for row in reader:
        if row[2] in valid_age and row[3] != 'Total - Sex':
            valid_entries.append([count, valid_age[row[2]], 0 if row[3] == 'Male' else 1, 2016,'ca', row[1], row[4], 0])
            count += 1
            valid_entries.append([count, valid_age[row[2]], 0 if row[3] == 'Male' else 1, 2016, 'ca', row[1], row[5], 1])
            count += 1
            valid_entries.append([count, valid_age[row[2]], 0 if row[3] == 'Male' else 1, 2016, 'ca', row[1], row[6], 2])
            count+=1

with open('o.csv', 'w', newline='') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=["id", "age", "sex", "year", "region","geocode", "value", "meta"])
    writer.writeheader()
    for i in valid_entries:
        writer.writerow({'id': i[0], 'age': i[1], 'sex': i[2], 'year': i[3] , 'region': i[4],'geocode': i[5], 'value': i[6], 'meta': i[7]})

