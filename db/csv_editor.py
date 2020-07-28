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

def sanitize_education():
    count = 0
    with open('education.csv') as csv_file:
        reader = csv.reader(csv_file)
        for row in reader:
            if len(str(row[1])) >= 7 and (str(row[21]) != '0' or str(row[22]) != '0'):
                if row[14] in 'Total - Age':
                    valid_entries.append(
                        [count, valid_age['Total - Age'], 2, 2016, 'can', row[1], row[21], row[18]])
                    count += 1
                    valid_entries.append(
                        [count, valid_age['Total - Age'], 3, 2016, 'can', row[1], row[22], row[18]])
                    count += 1
                    valid_entries.append(
                        [count, valid_age['Total - Age'], 1, 2016, 'can', row[1], row[20], row[18]])
                    count += 1
                else:
                    if row[14] in valid_age:
                        # male data
                        valid_entries.append(
                            [count, valid_age[row[14]], 2, 2016, 'can', row[1], row[21], row[18]])
                        count += 1
                        # female data
                        valid_entries.append(
                            [count, valid_age[row[14]], 3, 2016, 'can', row[1], row[22], row[18]])
                        count += 1
                        
                        #sum the data for each gender
                        valid_entries.append(
                            [count, valid_age[row[14]], 1, 2016, 'can', row[1], row[20], row[18]])
                        count += 1
        
        with open('education_out.csv', 'w', newline='') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=[
                                    "id", "age", "sex", "year", "region", "geocode", "value", "meta"])
            writer.writeheader()
            for i in valid_entries:
                writer.writerow({'id': i[0], 'age': i[1], 'sex': i[2], 'year': i[3], 'region': i[4], 'geocode': i[5], 'value': i[6], 'meta': i[7]})
  

def santize_population():
    count = 0

    def age_to_range_key(age):
        key = ''
        if age >= 15 and age <= 24:
            key = '15 to 24 years'
        elif age >= 25 and age <= 34:
            key = '25 to 34 years'
        elif age >= 35 and age <= 44:
            key = '35 to 44 years'
        elif age >= 45 and age <= 54:
            key = '45 to 54 years'
        elif age >= 55 and age <= 64:
            key = '55 to 64 years'
        else:
            key = '65 years and over'
        return key

    with open('population.csv') as csv_file:
        reader = csv.reader(csv_file)
        for row in reader:
            # 7 digit geocode
            if len(str(row[1])) == 7:
                age = row[11]
                try:
                    age = int(age)
                    key = age_to_range_key(age)
                    if key:
                        valid_entries.append([count, valid_age[key], 1, 2016, 'can', row[1], row[14], 0])
                        count += 1
                        
                        #only male
                        valid_entries.append([count, valid_age[key], 2, 2016, 'can', row[1], row[15], 0])
                        count += 1
                        
                        #only female
                        valid_entries.append([count, valid_age[key], 3, 2016, 'can', row[1], row[16], 0])
                        count += 1
                except:
                    if age in 'Total - Age':
                        valid_entries.append([count, 1, 1, 2016, 'can', row[1], row[14], 0])
                        count += 1
                        
                        #only male
                        valid_entries.append([count, 1, 2, 2016, 'can', row[1], row[15], 0])
                        count += 1
                        
                        #only female
                        valid_entries.append([count, 1, 3, 2016, 'can', row[1], row[16], 0])
                        count += 1
            

    with open('population_out.csv', 'w', newline='') as csvfile:
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
