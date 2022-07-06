CREATE DATABASE postgres;

-- connect to the newly created database
\c postgres;

CREATE TABLE IF NOT EXISTS pongs
(
    id        int UNIQUE  NOT NULL,
    val       int,
);