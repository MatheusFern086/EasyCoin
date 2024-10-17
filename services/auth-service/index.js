const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sql = require('mssql');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const app = express();
app.use(bodyParser.json());
app.use(cors()); 
const secretKey = process.env.JWT_SECRET;

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true
    }
};

/*const initializeDatabase = async () => {
    try {
        const pool = await sql.connect(config);

        const result = await pool.request().query(`
            IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ProjetoTopicos')
            BEGIN
                CREATE DATABASE ProjetoTopicos;
            END
        `);
        console.log('Banco de dados verificado/criado com sucesso.');

        await sql.connect({ ...config, database: 'ProjetoTopicos' });
        
        const scriptPath = path.join(__dirname, 'setup.sql');
        const script = fs.readFileSync(scriptPath, 'utf8');

        await pool.request().query(script);
        console.log('Tabelas criadas com sucesso.');
        
    } catch (err) {
        console.error('Erro ao inicializar o banco de dados:', err);
    }
};*/

// Middleware para autenticação de token JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Alterado para minúsculas
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Rota de registro de usuário
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await sql.connect(config);
        const result = await sql.query`INSERT INTO Users (username, password) VALUES (${username}, ${hashedPassword})`;
        res.status(201).send('Usuário registrado');
    } catch (err) {
        console.error('Erro ao registrar usuário:', err);
        res.status(500).send('Erro ao registrar usuário');
    }
});

//Rota de exclusão de usuário
app.post('/delete', async (req, res) => {
    const { id } = req.body; 

    try {
        await sql.connect(config);
        const result = await sql.query`DELETE FROM Users WHERE id = ${id}`;
        res.status(201).send('Usuário excluído com sucesso');
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Erro ao excluir usuário');
    }
});

//Rota de alteração de usuário
app.post('/updateplan', async (req, res) => {
    const { id, plan } = req.body;
    try {
        await sql.connect(config);
        const result = await sql.query`UPDATE Users SET fk_plano = ${plan} WHERE id = ${id}`;
        res.status(201).send('Plano alterado com sucesso');
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Erro ao alterar usuário');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .query(`
                SELECT * FROM Users WHERE username = @username
            `);

        const user = result.recordset[0];
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }

        const token = jwt.sign({ id: user.id }, secretKey, {
            expiresIn: '1h'
        });
        
        res.json({ token, userId: user.id });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro ao fazer login.' });
    }
});

app.post('/create-plan', async (req, res) => {
    const { nome_plano } = req.body;

    try {
        await sql.connect(config);
        const result = await sql.query`INSERT INTO Planos (nome_plano) VALUES (${nome_plano})`;
        res.status(201).send('Plano criado com sucesso');
    } catch (err) {
        console.error('Erro ao criar plano:', err);
        res.status(500).send('Erro ao criar plano');
    }
});

app.get('/plan', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT p.nome_plano FROM Users u
                JOIN Planos p ON u.fk_plano = p.id_plano
                WHERE u.id = @userId
            `);

        if (result.recordset.length > 0) {
            res.json({ plan: result.recordset[0].nome_plano });
        } else {
            res.status(404).json({ message: 'Plano não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao buscar o plano do usuário:', error);
        res.status(500).json({ message: 'Erro ao buscar o plano do usuário.' });
    }
});

//initializeDatabase();

const PORTA = process.env.PORT;
app.listen(PORTA, () => console.log(`Auth service rodando na porta ${PORTA}`));