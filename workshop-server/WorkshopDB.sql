\c postgres
\c parky
DROP DATABASE IF EXISTS project1;
CREATE DATABASE project1;
\c  project1

CREATE TABLE works (
	id SERIAL PRIMARY KEY,
	workshop TEXT NOT NULL,
	attendee TEXT NOT NULL
);

--INSERT INTO works (workshop, attendee) VALUES
 --('Sample Attendee', 'Sample Workshop');
