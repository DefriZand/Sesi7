const Fastify = require('fastify');
const { add, getAllStudents, getStudentById, getStudentsByName, updateStudentScores, deleteStudentById } = require('./db');

const fastify = Fastify({
    logger: true,
    requestTimeout: 30000, // 30 seconds
});

const getRateSiswa = (nilaiMatematika, nilaiBahasaIndonesia, nilaiIPA) => {
    return (nilaiMatematika + nilaiBahasaIndonesia + nilaiIPA) / 3;
};

const checkRateSiswa = (rataRataNilai) => {
    if (rataRataNilai >= 80 && rataRataNilai <= 100) {
        return 'A';
    } else if (rataRataNilai >= 60 && rataRataNilai < 80) {
        return 'B';
    } else {
        return 'E';
    }
};

fastify.route({
    method: 'POST',
    url: '/students',
    handler: async (request, reply) => {
        const dataSiswa = request.body.data;
        try {
            for (let index = 0; index < dataSiswa.length; index++) {
                const score = getRateSiswa(dataSiswa[index].matematika, dataSiswa[index].bahasa_indonesia, dataSiswa[index].ipa);
                const grade = checkRateSiswa(score);
                dataSiswa[index].score = score;
                dataSiswa[index].grade = grade;
                const addStudent = await add(dataSiswa[index]);
                console.log('create student: ', addStudent);
            }
            reply.send({
                status: 'ok',
                data: []
            });
        } catch (error) {
            console.log('error create: ', error);
            reply.code(500).send({
                status: 'error',
                message: ''
            });
        }
    }
});

fastify.route({
    method: 'GET',
    url: '/students',
    handler: async (request, reply) => {
        try {
            const students = await getAllStudents();
            reply.send({
                status: 'ok',
                data: students
            });
        } catch (error) {
            console.log('error fetching students: ', error);
            reply.code(500).send({
                status: 'error',
                message: 'Could not fetch students'
            });
        }
    }
});

fastify.route({
    method: 'GET',
    url: '/students/:student_id',
    handler: async (request, reply) => {
        const { student_id } = request.params;
        try {
            const student = await getStudentById(student_id);
            if (student) {
                reply.send({
                    status: 'ok',
                    data: student
                });
            } else {
                reply.code(404).send({
                    status: 'error',
                    message: 'Student not found'
                });
            }
        } catch (error) {
            console.log('error fetching student: ', error);
            reply.code(500).send({
                status: 'error',
                message: 'Could not fetch student'
            });
        }
    }
});

fastify.route({
    method: 'GET',
    url: '/searchStudents',
    handler: async (request, reply) => {
        const { name } = request.query;
        try {
            const students = await getStudentsByName(name);
            reply.send({
                status: 'ok',
                data: students
            });
        } catch (error) {
            console.log('error fetching students by name: ', error);
            reply.code(500).send({
                status: 'error',
                message: 'Could not fetch students by name'
            });
        }
    }
});

fastify.route({
    method: 'PUT',
    url: '/students/:student_id',
    handler: async (request, reply) => {
        const { student_id } = request.params;
        const { matematika, bahasa_indonesia, ipa } = request.body;
        try {
            const updatedStudent = await updateStudentScores(student_id, matematika, bahasa_indonesia, ipa);
            if (updatedStudent) {
                reply.send({
                    status: 'ok',
                    data: updatedStudent
                });
            } else {
                reply.code(404).send({
                    status: 'error',
                    message: 'Student not found'
                });
            }
        } catch (error) {
            console.log('error updating student scores: ', error);
            reply.code(500).send({
                status: 'error',
                message: 'Could not update student scores'
            });
        }
    }
});

fastify.route({
    method: 'DELETE',
    url: '/students/:student_id',
    handler: async (request, reply) => {
        const { student_id } = request.params;
        try {
            const deletedStudent = await deleteStudentById(student_id);
            if (deletedStudent) {
                reply.send({
                    status: 'ok',
                    data: deletedStudent
                });
            } else {
                reply.code(404).send({
                    status: 'error',
                    message: 'Student not found'
                });
            }
        } catch (error) {
            console.log('error deleting student: ', error);
            reply.code(500).send({
                status: 'error',
                message: 'Could not delete student'
            });
        }
    }
});

const start = async () => {
    try {
        await fastify.listen(3000);
        console.log(`Server is running on http://localhost:3000`);
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};

start();
