import fs from 'fs';
import csvParser from 'csv-parser';
import db from '../model/db.js'; 

export const uploadCsvFiles = async (req, res) => {
    if (!req.files || req.files.length < 4) {
        return res.status(400).json({ error: 'Please upload at least 4 CSV files.' });
    }

    const results = [];

    for (let file of req.files) {
        const fileResults = await processCsvFile(file.path, file.originalname);
        results.push(...fileResults);
    }

    res.json({ message: 'NICs validated and saved successfully', data: results });
};

const processCsvFile = (filePath, fileName) => {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
                const nic = row['NIC'];
                const nicData = validateNic(nic);
                if (nicData) {
                    nicData.file_name = fileName; 
                    saveNicDataToDatabase(nicData);
                    results.push(nicData);
                }
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

const validateNic = (nic) => {
    if (!nic) return null;

    let birthYear, birthMonth, birthDay, gender;

    if (nic.length === 10) {
        birthYear = parseInt(`19${nic.substring(0, 2)}`);
        const days = parseInt(nic.substring(2, 5));
        gender = days > 500 ? 'Female' : 'Male';
        const adjustedDays = gender === 'Female' ? days - 500 : days;

        const birthDate = getDateFromDays(adjustedDays, birthYear);
        birthMonth = birthDate.month;
        birthDay = birthDate.day;
    } else if (nic.length === 12) {
        birthYear = parseInt(nic.substring(0, 4));
        const days = parseInt(nic.substring(4, 7));
        gender = days > 500 ? 'Female' : 'Male';
        const adjustedDays = gender === 'Female' ? days - 500 : days;

        const birthDate = getDateFromDays(adjustedDays, birthYear);
        birthMonth = birthDate.month;
        birthDay = birthDate.day;
    } else {
        return null; 
    }

    const age = new Date().getFullYear() - birthYear;

    return {
        NIC: nic,
        Birthday: `${birthYear}-${birthMonth}-${birthDay}`,
        Age: age,
        Gender: gender,
    };
};

const getDateFromDays = (days, year) => {
    const months = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let month = 0;

    while (days > months[month]) {
        days -= months[month];
        month++;
    }

    return { day: days, month: month + 1 };
};

const saveNicDataToDatabase = (nicData) => {
    const { NIC, Birthday, Age, Gender, file_name } = nicData;

    const query = `
        INSERT INTO nic_data (nic, birthday, age, gender, file_name)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [NIC, Birthday, Age, Gender, file_name], (err, result) => {
        if (err) {
            console.error('Error saving NIC data to the database:', err);
        } else {
            console.log('NIC data saved to the database:', result.insertId);
        }
    });
};
