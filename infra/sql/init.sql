CREATE TABLE
    IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
    );

INSERT INTO
    users (username, email)
VALUES
    ('wravel', 'wravel', 'wravel@gmail.com',);

INSERT INTO
    users (username, email)
VALUES
    ('admin', 'admin', 'admin@example.com');