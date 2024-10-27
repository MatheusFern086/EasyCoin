IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'ProjetoTopicos')
BEGIN
    CREATE DATABASE ProjetoTopicos;
END

USE ProjetoTopicos;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Planos')
BEGIN
    CREATE TABLE Planos (
        id_plano INT PRIMARY KEY IDENTITY(1,1),
        nome_plano NVARCHAR(50) NOT NULL
    );

    INSERT INTO Planos (nome_plano) VALUES ('Free');
	INSERT INTO Planos (nome_plano) VALUES ('Pro');
END

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        id INT PRIMARY KEY IDENTITY(1,1),
        username NVARCHAR(255) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        fk_plano INT DEFAULT 1,
        dt_inclusao DATETIME NOT NULL DEFAULT GETDATE(),
        dt_alteracao DATETIME NOT NULL DEFAULT GETDATE(),
        qtd_conversao INT DEFAULT 3
    );

    ALTER TABLE Users ADD CONSTRAINT FK_Users_Planos
    FOREIGN KEY (fk_plano) REFERENCES Planos(id_plano);

END
