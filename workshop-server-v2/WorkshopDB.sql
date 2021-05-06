

DROP DATABASE IF EXISTS project2;
CREATE DATABASE project2;
\c  project2 project2

CREATE TABLE userwk(
	firstname VARCHAR(50) NOT NULL,
	lastname VARCHAR(50),
	username VARCHAR(50) PRIMARY KEY,
	email VARCHAR(50)
);

CREATE TABLE workshop(
	wkid SERIAL PRIMARY KEY,
worktitle VARCHAR(50) NOT NULL,
workdate VARCHAR(50) NOT NULL,
worklocation VARCHAR(50) NOT NULL,
maxseats INT NOT NULL,
instructor VARCHAR(50)
);

CREATE TABLE enrolled(
username VARCHAR(50) NOT NULL,
wkid INTEGER NOT NULL,
PRIMARY KEY (username, wkid),
FOREIGN KEY (username) REFERENCES userwk(username),
FOREIGN KEY (wkid) REFERENCES workshop(wkid)
);

GRANT SELECT, INSERT ON userwk TO project2;
GRANT SELECT, INSERT ON workshop TO project2;
GRANT SELECT, INSERT ON enrolled TO project2;