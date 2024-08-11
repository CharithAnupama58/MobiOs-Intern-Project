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

export const getNicDetails = async (req, res) => {
    console.log('meka wada');
    try {
        const [items] = await db.query('SELECT * FROM nic_data');
        
        if (items.length > 0) {
            return res.status(200).json({ items });
        } else {
            return res.status(404).json({ error: 'No items found' });
        }
    } catch (error) {
        console.log('Error fetching items:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
export const getNicChartDetails = async (req, res) => {
    try {
        const [totalRecordsResult] = await db.query('SELECT COUNT(*) as totalRecords FROM nic_data');
        const totalRecords = totalRecordsResult[0].totalRecords;
        const [maleCountResult] = await db.query('SELECT COUNT(*) as maleCount FROM nic_data WHERE gender = "Male"');
        const maleCount = maleCountResult[0].maleCount;
        const [femaleCountResult] = await db.query('SELECT COUNT(*) as femaleCount FROM nic_data WHERE gender = "Female"');
        const femaleCount = femaleCountResult[0].femaleCount;
        res.json({
            totalRecords,
            maleCount,
            femaleCount,
        });
    } catch (error) {
        console.error('Error fetching NIC data stats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getReportsDetails = async (req, res) => {
    console.log('meka wada');
    console.log(req.query.filter);
    const {filter} =req.query;
    if(filter === 'all'){
        try {
            const [items] = await db.query('SELECT * FROM nic_data');
            if (items.length > 0) {
                return res.status(200).json({ items });
            } else {
                return res.status(404).json({ error: 'No items found' });
            }
        } catch (error) {
            console.log('Error fetching items:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }else if(filter === 'male'){
        try {
            const [items] = await db.query('SELECT * FROM nic_data WHERE gender = "Male"' );
            if (items.length > 0) {
                return res.status(200).json({ items });
            } else {
                return res.status(404).json({ error: 'No items found' });
            }
        } catch (error) {
            console.log('Error fetching items:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }else if(filter === 'female'){
        try {
            const [items] = await db.query('SELECT * FROM nic_data WHERE gender = "Female"' );
            if (items.length > 0) {
                return res.status(200).json({ items });
            } else {
                return res.status(404).json({ error: 'No items found' });
            }
        } catch (error) {
            console.log('Error fetching items:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};