import csv

valid_entries = []
valid_age = {'Total - Age': 1, '15 to 24 years': 2, '25 to 34 years': 5, '35 to 44 years': 6, '45 to 54 years': 7, '55 to 64 years': 8, '65 years and over': 9}
all_sex = {'Total - Sex': 1, 'Male': 2, 'Female': 3}
count = 0
cma = {}


def sanitize_income():
    count = 0
    with open('income.csv') as csv_file:
        reader = csv.reader(csv_file)
        for row in reader:

            if (len(row[0]) == 3) and row[1] in valid_age:
                valid_entries.append([count, valid_age[row[1]], all_sex[row[2]], 2016,'ca','9999' + row[0], row[5], row[4]])
                count+=1

    with open('income_out.csv', 'w', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=["id", "age", "sex", "year", "region","geocode", "value", "meta"])
        writer.writeheader()
        for i in valid_entries:
            writer.writerow({'id': i[0], 'age': i[1], 'sex': i[2], 'year': i[3] , 'region': i[4],'geocode': i[5], 'value': i[6], 'meta': i[7]})

def sanitize_employment():
    count = 0
    with open('employment.csv') as csv_file:
        reader = csv.reader(csv_file)
        for row in reader:
            if row[1] == '01' and row[9] == '1' and row[12] == '1':
                print(row)
            if len(row[1]) == 7 and row[11] in valid_age and row[9] == '1' and row[18] == '1':
                valid_entries.append([count, row[12], row[15], 2016,'can',row[1], row[22], 1])
                count+=1
                valid_entries.append([count, row[12], row[15], 2016,'can',row[1], row[23], 2])
                count+=1

    with open('employment_out.csv', 'w', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=["id", "age", "sex", "year", "region","geocode", "value", "meta"])
        writer.writeheader()
        for i in valid_entries:
            writer.writerow({'id': i[0], 'age': i[1], 'sex': i[2], 'year': i[3] , 'region': i[4],'geocode': i[5], 'value': i[6], 'meta': i[7]})

# with open('CMAs.csv') as csv_file:
#     reader = csv.reader(csv_file)
#     for row in reader:
#         if row[0] not in cmaCheck:
#             cmaCheck[row[0]] = 1

# for i in cma.keys():
#     if i not in cmaCheck:
#         print(cmaCheck[i])
