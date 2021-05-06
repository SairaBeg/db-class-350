\c postgres
DROP DATABASE IF EXISTS bookboot;
CREATE DATABASE bookboot;
\c bookboot 

CREATE TABLE book(
	bookid INT PRIMARY KEY,
	isbn VARCHAR(20) NOT NULL,
	title VARCHAR(70) NOT NULL,
	format VARCHAR(70) NOT NULL,
	price VARCHAR(10) NOT NULL,
	pages INT NOT NULL,
	publicationDate VARCHAR(50) NOT NULL
);

CREATE TABLE author(
	authorid INT PRIMARY KEY,
	authorname VARCHAR(50) NOT NULL,
	authorResidence VARCHAR(50),
	authorBday VARCHAR(50)
);

CREATE TABLE pub(
pubid INT  PRIMARY KEY,
pubname VARCHAR(50) NOT NULL,
hq VARCHAR(50) NOT NULL
);

CREATE TABLE deal(
	FOREIGN KEY (bookid) REFERENCES Book(bookid),
	FOREIGN KEY (authorid) REFERENCES Author(authorid),
	FOREIGN KEY (pubid) REFERENCES Pub(pubid),
	PRIMARY KEY (bookid, authorid, pubid)
);

INSERT INTO book (bookid, isbn, title, format, price, pages, publicationDate) VALUES
(1, '030788743X', 'Ready Player One', 'hardcover', '18.69', 384, '8/16/2011'),
(2, '1524761338', 'Ready Player Two', 'hardcover', '13.18', 384, '11/24/2020'),
(3, '0062409166', 'The Rise and Fall of D.O.D.O.: A Novel', 'hardcover', '4.28', 768, '6/13/2017'),
(4, '0062409158', 'The Rise and Fall of D.O.D.O.: A Novel', 'paperback', '11.99', 768, '6/13/2017'),
(5, '0553380958', 'Snow Crash', 'paperback', '9.99', 440, '1/1/2000');

INSERT INTO author (authorid, authorname, authorResidence, authorBday) VALUES
(1, 'Ernest Cline', 'Austin TX','3/29/1972'),
(2, 'Neal Stephenson / Nicole Galland','Seattle WA / Martha''s Vineyard, MA','October 31, 1959 / 1965'),
(3,'Neal Stephenson', 'Seattle WA','10/31/1959');

INSERT INTO pub (pubid, pubname, hq) VALUES 
(1, 'Ballantine', 'New York, NY'),
(2, 'William Morrow','New York, NY'),
(3, 'Del Ray', 'New York, NY');

INSERT INTO deal (bookid, authorid, pubid) VALUES
(1, 1, 1),
(2, 1, 1),
(3, 2, 2),
(4, 2, 2),
(5, 3, 3);