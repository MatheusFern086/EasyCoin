IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'ProjetoTopicos')
BEGIN
    CREATE DATABASE ProjetoTopicos;
END

USE ProjetoTopicos;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        id INT PRIMARY KEY IDENTITY(1,1),
        username NVARCHAR(255) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL
    );
END
