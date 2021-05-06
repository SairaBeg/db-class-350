
require('dotenv').config()
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.set("port", 8080);

app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));

const Pool = require("pg").Pool;
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "project2"
};
const pool = new Pool(config);

//Delete user
app.delete("/delete-user", async (req, res) => {
const UN = req.body.username;
if(UN == undefined ){
  const data2 = { error: "parameters not given" };
      res.json(data2);
}
  try {
    const template = "SELECT * FROM userwk WHERE userwk.username = $1";
    const response = await pool.query(template, [UN]);

//if the username does not exist
    if (response.rowCount == 0) {
      const data1 = { status: "username does not exist" };
      res.json(data1);
    }
    else if (response.rowCount != 0) {
      //else if the username DOES exist
      //DELETE the entry
      const template1 = "DELETE FROM userwk WHERE userwk.username = $1";
      const response1 = await pool.query(template1, [UN]);
      const data2 = { status: "deleted" }
      res.json(data2);
    }
  } catch (err) {
    //if an error occured 
    const data3 = { status: "user not deleted" }
    res.json(data3);
    console.log(err);
  }
});

//Create user
app.post("/create-user", async (req, res) => {
  const UN = req.body.username;
  const FN = req.body.firstname;
  const LN = req.body.lastname;
  const EM = req.body.email;

  if(UN == undefined || FN == undefined  || LN == undefined  || EM == undefined){
    const data2 = { error: "parameters not given" };
        res.json(data2);
  }
    try {
      const template = "SELECT * FROM userwk WHERE userwk.username = $1";
      const response = await pool.query(template, [UN]);
  //if the entry already exists
      if (response.rowCount != 0) {
        const data1 = { status: "username taken" };
        res.json(data1);
      }
      else if (response.rowCount == 0) {
        //else if attendee and workshop doesn't exist
        //INSERT the entry
        const template1 = "INSERT INTO userwk(username, firstname, lastname, email) VALUES ($1, $2, $3, $4)";
        const response1 = await pool.query(template1, [UN, FN, LN, EM]);
        const data2 = { status: "user added" }
        res.json(data2);
      }
    } catch (err) {
      //if attendee and workshop already exists
      const data3 = { status: "user added" }
      res.json(data3);
      console.log(err);
    }
  });


//List Users
app.get("/list-users", async (req, res) => {
  const TY = req.query.type;
  try {
    if(TY != undefined){
if (TY == 'full'){
const query = "SELECT * FROM userwk";
const response1 = await pool.query(query);
if (response1.rowCount != 0) {
  const results = response1.rows.map(function(row){
    return {firstname: row.firstname, lastname: row.lastname, username: row.username, email: row.email}
    })
    res.json({users: results});
  //if the users are not found
} else if (response1.rowCount == 0) {
  const e = { error: "users not found" };
  res.json(e);
}
    } else if(TY == 'summary'){
      const query2 = "SELECT firstname, lastname FROM userwk";
     const response = await pool.query(query2);

const results = response.rows.map(function(row){
return {firstname: row.firstname, lastname: row.lastname}
})
     if (response.rowCount != 0) {
      res.json({users: results});
    }else if (response1.rowCount == 0) {
      const e = { error: "users not found" };
      res.json(e);
    }
  }
}
  }catch (err) {
    const e = { error: "users not retrieved" };
    res.json(e);
    console.log(err);
  }
});

//add a workshop
app.post("/add-workshop", async (req, res) => {
  const TT = req.body.title;
  const DT = req.body.date;
  const LC = req.body.location;
  const MX = req.body.maxseats;
  const IN = req.body.instructor;

  if(TT == undefined || DT == undefined  || LC == undefined  || MX == undefined){
    const data2 = { error: "parameters not given" };
        res.json(data2);
  }
  try {
    const template = "SELECT * FROM workshop WHERE workshop.worktitle = $1 AND workshop.worklocation = $2 AND workshop.workdate = $3";
    const response = await pool.query(template, [TT, LC, DT]);
//if the entry already exists
    if (response.rowCount != 0) {
      const data1 = { status: "workshop already in database" };
      res.json(data1);
    } else if (response.rowCount == 0) {

 //INSERT workshop
 const template1 = "INSERT INTO workshop(worktitle, workdate, worklocation, maxseats, instructor) VALUES ($1, $2, $3, $4, $5)";
 const response1 = await pool.query(template1, [TT, DT, LC, MX, IN]);
 const data2 = { status: "workshop added" }
 res.json(data2);
    }
  } catch (err) {
    const data3 = { status: "error, workshop not added" }
    res.json(data3);
    console.log(err);
  }
});

//Enroll a user in a workshop
app.post("/enroll", async (req, res) => {
  const TT = req.body.title;
  const DT = req.body.date;
  const LC = req.body.location;
  const MX = req.body.maxseats;
  const IN = req.body.instructor;
  const UN = req.body.username;

  if(TT == undefined || DT == undefined  || LC == undefined  || MX == undefined|| UN == undefined){
    const data2 = { error: "parameters not given" };
        res.json(data2);
  }
  try {
    const template = "SELECT * FROM workshop  WHERE workshop.worktitle = $1 AND workshop.worklocation = $2 AND workshop.workdate = $3";
    const response = await pool.query(template, [TT, LC, DT]);
    const template2 = "SELECT * FROM userwk  WHERE userwk.username = $1 ";
    const response2 = await pool.query(template2, [UN]);

//if the workshop does not exist
    if (response.rowCount == 0) {
      const data1 = { status: "workshop does not exist" };
      res.json(data1);
    } else if (response2.rowCount == 0) {
      const data1 = { status: "user not in database" };
      res.json(data1);
    } else{

//get wkid
const query = "SELECT wkid FROM workshop  WHERE workshop.worktitle = $1 AND workshop.worklocation = $2 AND workshop.workdate = $3";
const response = await pool.query(query, [TT, LC, DT]);
  const results = response.rows[0];

//get maxseats
  const query3 = "SELECT maxseats FROM workshop  WHERE workshop.worktitle = $1 AND workshop.worklocation = $2 AND workshop.workdate = $3";
const response3 = await pool.query(query3, [TT, LC, DT]);
  const results3 = response3.rows[0];

  //count how many users are enrolled in the workshop
  const query4 = "SELECT count(enrolled.wkid) FROM enrolled  WHERE enrolled.wkid = $1";
  const response4 = await pool.query(query4, [results.wkid]);
    const results4 = response4.rows[0];

//check to see if user is already enrolled
const template = "SELECT * FROM enrolled WHERE enrolled.wkid = $1 AND enrolled.username = $2";
const response2 = await pool.query(template, [results.wkid,UN]);

//if the entry already exists
if (response2.rowCount != 0) {
  const data1 = { status: "user already enrolled" };
  res.json(data1);

//if maxseats == number of people enrolled
} else if (results4.count == results3.maxseats){
  const data2 = { status: "no seats available" };
  res.json(data2);
}
else if (response2.rowCount == 0) {

//enroll user
      const template1 = "INSERT INTO enrolled (username, wkid) VALUES ($1, $2)";
      const response1 = await pool.query(template1, [UN, results.wkid]);
      const data2 = { status: "user added" }
      res.json(data2);
}
    }
  } catch (err) {
    const data3 = { status: "error, user not enrolled" }
    res.json(data3);
    console.log(err);
  }
});


//List Users
app.get("/list-workshops", async (req, res) => {

  try {
   
const query = "SELECT * FROM workshop";
const response1 = await pool.query(query);
if (response1.rowCount != 0) {
  const results = response1.rows.map(function(row){
    return {title: row.worktitle, date: row.workdate, location: row.worklocation}
    })
    res.json({workshops: results});
  //if the users are not found
} else if (response1.rowCount == 0) {
  const e = { status: "no workshops found" };
  res.json(e);
}

  }catch (err) {
    const e = { error: "workshops not found" };
    res.json(e);
    console.log(err);
  }
});

//List Attendees
app.get("/attendees", async (req, res) => {
  const TT = req.query.title;
  const DT = req.query.date;
  const LC = req.query.location;

  try {
   //select the desired workshop to see if it exists
   const template2 = "SELECT * FROM workshop  WHERE workshop.worktitle = $1 AND workshop.workdate = $2 AND workshop.worklocation = $3";
   const response2 = await pool.query(template2, [TT, DT, LC]);


    //select attendees that are enrolled
    const template = "SELECT userwk.firstname, userwk.lastname FROM userwk JOIN enrolled ON enrolled.username = userwk.username JOIN workshop ON workshop.wkid = enrolled.wkid  WHERE workshop.worktitle = $1 AND workshop.workdate = $2 AND workshop.worklocation = $3";
    const response = await pool.query(template, [TT, DT, LC]);

//if workshop doesn't exist
if(response2.rowCount == 0){
  const data1 = { error: "workshop does not exist" };
      res.json(data1);
}

    //if attendees are found
else if (response.rowCount != 0) {
  const results = response.rows.map(function(row){
    return {firstname: row.firstname, lastname: row.lastname}
    })
    res.json({attendees: results});

  //if no attendees found (nobody enrolled), returns an empty JSON object
} else if (response.rowCount == 0) {
  const results = response.rows.map(function(row){
    return {firstname: row.firstname, lastname: row.lastname}
    })
    res.json({attendees: results});
}
  }catch (err) {
    const e = { error: "workshops not found" };
    res.json(e);
    console.log(err);
  }
});

//server start
app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`);
  // eslint-disable-line no-console
});
