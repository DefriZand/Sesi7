const db = require('./conn');
var schemaName = 'sesi6';

const add = async (data) => {
    try {
        const insertData = `INSERT INTO ${schemaName}.students (
            student_name, math, indonesian, natural_sciences, score, grade
        ) values (
            $1, $2, $3, $4, $5, $6
        ) returning *`;

        const values = [
            data.nama, data.matematika, data.bahasa_indonesia, data.ipa, data.score, data.grade
        ];

        const { rows } = await db.query(insertData, values);
        return rows[0];
    } catch (error) {
        throw error;
    }
}

const getAllStudents = async () => {
    try {
        const query = `SELECT * FROM ${schemaName}.students ORDER BY created_date`;
        const { rows } = await db.query(query);
        return rows;
    } catch (error) {
        throw error;
    }
}

const getStudentById = async (studentId) => {
    try {
        const query = `SELECT * FROM ${schemaName}.students WHERE student_id = $1`;
        const values = [studentId];
        const { rows } = await db.query(query, values);
        return rows[0];
    } catch (error) {
        throw error;
    }
}

const getStudentsByName = async (studentName) => {
    try {
        const query = `SELECT * FROM ${schemaName}.students WHERE student_name ILIKE $1`;
        const values = [`%${studentName}%`];
        const { rows } = await db.query(query, values);
        return rows;
    } catch (error) {
        throw error;
    }
}

const updateStudentScores = async (studentId, math, indonesian, naturalSciences) => {
    try {
        const query = `UPDATE ${schemaName}.students 
                       SET math = $1, indonesian = $2, natural_sciences = $3 
                       WHERE student_id = $4 
                       RETURNING *`;
        const values = [math, indonesian, naturalSciences, studentId];
        const { rows } = await db.query(query, values);
        return rows[0];
    } catch (error) {
        throw error;
    }
}

const deleteStudentById = async (studentId) => {
    try {
        const query = `DELETE FROM ${schemaName}.students WHERE student_id = $1 RETURNING *`;
        const values = [studentId];
        const { rows } = await db.query(query, values);
        return rows[0];
    } catch (error) {
        throw error;
    }
}

module.exports = {
    add,
    getAllStudents,
    getStudentById,
    getStudentsByName,
    updateStudentScores,
    deleteStudentById,
};
