\c postgres
DROP DATABASE IF EXISTS boot;
CREATE DATABASE boot;
\c boot 

CREATE TABLE course(
	courseid INT PRIMARY KEY,
	courseNum VARCHAR(20) NOT NULL,
	courseName VARCHAR(70) NOT NULL,
	descr VARCHAR(500) NOT NULL
);

CREATE TABLE instructor(
	instid INT PRIMARY KEY,
	instname VARCHAR(50) NOT NULL,
	instemail VARCHAR(70) NOT NULL
);

CREATE TABLE building(
	buildid INT PRIMARY KEY,
	buildname VARCHAR(50) NOT NULL,
	room VARCHAR(20) NOT NULL
);

CREATE TABLE classtime(
	classtimeid INT PRIMARY KEY,
	section INT NOT NULL,
	day VARCHAR(5) NOT NULL,
	mornafter VARCHAR(20) NOT NULL
);

CREATE TABLE sched(
	courseid integer REFERENCES course(courseid),
	instid integer REFERENCES instructor(instid),
    buildid integer REFERENCES building(buildid),
	classtimeid integer REFERENCES classtime(classtimeid),
	PRIMARY KEY (courseid, instid, buildid, classtimeid)
);

INSERT INTO course (courseid, courseNum, courseName, descr) VALUES
(1, 'CS120', 'Javascript Fundamentals', 'This course is designed to provide a solid introduction to the JavaScript language. We will explore the more unique and tricky JavaScript features such as closures, higher-order functions,'),
(2, 'CS220', 'PostgreSQL', 'This course will teach you how to explore, modify, and export data from a database. You’ll be introduced to foundational concepts like tables, data types, and queries.'),
(3, 'CS340', 'DevOps', 'We examine the definition and concepts around the ideas of DevOps. How do they relate to working in the cloud?');

INSERT INTO instructor (instid, instname, instemail) VALUES
(1, 'Becca Elenzil', 'elenzil@ada.org'),
(2, 'Claire Elliot', 'elliot@ada.org'),
(3, 'Kaida Masaki', 'kmas@ada.org');

INSERT INTO building (buildid, buildname, room) VALUES 
(1, 'downtown', 'c12'),
(2, 'downtown', 'c8'),
(3, 'Nob Hill', 'nh1'),
(4, 'downtown', 'c10');

INSERT INTO classtime (classtimeid, section, day, mornafter) VALUES
(1, 1, 'MW', 'morning'),
(2, 2, 'MW', 'afternoon'),
(3, 1, 'MW', 'morning'),
(4, 1, 'TT', 'afternoon'),
(5, 2, 'MW', 'afternoon');

INSERT INTO sched(courseid, instid, buildid, classtimeid) VALUES 
(1, 1, 1, 1),
(1, 2, 2, 2),
(2, 1, 1, 1),
(3, 3, 3, 4),
(3, 3, 4, 5);