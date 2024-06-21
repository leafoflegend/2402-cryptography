import pg from 'pg';
import express from 'express';
import bcrypt from 'bcrypt';

const app = express();

const { Client } = pg;

const db = new Client('postgres://localhost:5432/2402_cryptography');

const runApplication = async () => {
    try {
        await db.connect();

        await db.query(`
            DROP TABLE IF EXISTS users;

            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            );
        `);

        const encryptedPassword = await bcrypt.hash('password123', 5);

        await db.query(`
            INSERT INTO users (username, password) VALUES ('bob', $1);
        `, [encryptedPassword]);

        app.use(express.json());

        app.post('/api/login', async (req, res) => {
            const { username, password } = req.body;

            const { rows: users } = await db.query(`
                SELECT id, password FROM users WHERE username = $1;
            `, [username]);

            const selectedUser = users[0];

            const isAuthenticated = await bcrypt.compare(password, selectedUser.password);

            if (isAuthenticated) {
                res.status(200).send({
                    message: 'You logged in!',
                });
            } else {
                res.status(401).send({
                    message: 'Username and password do not match any records.',
                });
            }
        });

        app.listen(3000, () => {
            console.log('Server is now listening on PORT:3000');
        });
    } catch (e) {
        console.log(`Failed to run application.`);
        throw e;
    }
};

runApplication();
