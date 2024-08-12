const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sql = require('mssql');

const app = express();
app.use(bodyParser.json());

const config = {
    server: 'DESKTOP-AAELJNG',
    database: 'ProjetoTopicos',
    options: {
        trustedConnection: true, // Ativa a autenticação do Windows
        encrypt: true,
        enableArithAbort: true
    }
};

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, 'your_jwt_secret');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await sql.connect(config);
        const result = await sql.query`INSERT INTO Users (username, password) VALUES (${username}, ${hashedPassword})`;
        res.status(201).send('User registered');
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM Users WHERE username = ${username}`;
        const user = result.recordset[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).send('Invalid Credentials');
        }

        const token = jwt.sign({ id: user.id }, 'your_jwt_secret');
        res.header('Authorization', token).send('Logged in');
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`));