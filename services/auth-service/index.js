const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sql = require('mssql');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors()); 

// Configurações de conexão ao banco de dados
const config = {
    user: 'sa',
    password: '#zyZ6GO5PgudiBxt',
    server: 'sqlserver',
    database: 'ProjetoTopicos',
    options: {
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true
    }
};

const initializeDatabase = async () => {
    try {
        const pool = await sql.connect(config);

        // Verificar se o banco de dados existe
        const result = await pool.request().query(`
            IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ProjetoTopicos')
            BEGIN
                CREATE DATABASE ProjetoTopicos;
            END
        `);
        console.log('Banco de dados verificado/criado com sucesso.');

        // Conectar ao banco de dados recém-criado e criar tabelas
        await sql.connect({ ...config, database: 'ProjetoTopicos' });
        
        // Caminho para o script de criação das tabelas
        const scriptPath = path.join(__dirname, 'setup.sql');
        const script = fs.readFileSync(scriptPath, 'utf8');

        // Executar o script de criação das tabelas
        await pool.request().query(script);
        console.log('Tabelas criadas com sucesso.');
        
    } catch (err) {
        console.error('Erro ao inicializar o banco de dados:', err);
    }
};

// Middleware para autenticação de token JWT
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

app.get('/test-db', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT 1 AS test`;
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Erro de conexao:', err);
        res.status(500).send('Erro de conexão');
    }
});

// Rota de registro de usuário
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await sql.connect(config);
        const result = await sql.query`INSERT INTO Users (username, password) VALUES (${username}, ${hashedPassword})`;
        res.status(201).send('Usuário registrado');
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Erro ao cadastrar');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM Users WHERE username = ${username}`;
        const user = result.recordset[0];

        console.log('Validando senha');
        if (!user || !(await bcrypt.compare(password, user.password))) {
            console.log('Senha incorreta');
            return res.status(400).send('Invalid Credentials');
        }

        const token = jwt.sign({ id: user.id }, 'your_jwt_secret');
        res.header('Authorization', token).send('Logado');
        console.log('Logado');
    } catch (err) {
        console.log('Erro' + err);
        console.error('Erro base de dados:', err);
        res.status(500).send('Server Error');
    }
});

initializeDatabase();

const PORTA = process.env.PORT || 5000;
app.listen(PORTA, () => console.log(`Auth service rodando na porta ${PORTA}`));
