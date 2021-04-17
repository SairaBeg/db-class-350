
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
  database: "project1"
};

const pool = new Pool(config);


//Add an attendee to workshop
app.post("/api", async (req, res) => {
  const ws = req.body.workshop;
  const att = req.body.attendee;
  
 //if parameters are missing 
if(ws == undefined || att == undefined){
  const data2 = { error: "parameters not given" };
      res.json(data2);
}

  try {
    const template = "SELECT * from works WHERE workshop = $1 AND attendee = $2";

    const response = await pool.query(template, [ws, att]);
//if the entry already exists
    if (response.rowCount != 0) {
      const data1 = { error: "attendee already enrolled" };
      res.json(data1);
    }

    else if (response.rowCount == 0) {
      //else if attendee and workshop doesn't exist
      //INSERT the entry
      const template1 = "INSERT INTO works(workshop, attendee) VALUES ($1, $2)";
      const response1 = await pool.query(template1, [ws, att]);

      //SELECT the inserted entries
      const template2 = "SELECT * from works WHERE workshop = $1 AND attendee = $2";

      const response2 = await pool.query(template2, [ws, att]);
      const results = response2.rows[0].attendee;
      const results2 = response2.rows[0].workshop;
      const data = { attendee: results, workshop: results2 };

      //send the inserted entries back    
      res.json(data);
    }

  } catch (err) {
    //if attendee and workshop already exists
    res.json("attendee already enrolled");
    console.log(err);

  }

})

//Get all workshops
app.get("/api", async (req, res) => {
  const ws = req.query.workshop;

  try {
    //if a parameter (a workshop) is specified
    //select all the attendees from that workshop
    if (ws != undefined) {
      const query = "SELECT attendee FROM works WHERE workshop = $1";
      const response1 = await pool.query(query, [ws]);

      //if that workshop exists, return the attendees
      if (response1.rowCount != 0) {
        const attendees = response1.rows.map(function (item) {
          return item.attendee;
        });
        res.json({ attendees: attendees });

        //if the workshop does not exist
      } else if (response1.rowCount == 0) {
        const e = { error: "workshop not found" };
        res.json(e);
      }
    }

    //if no parameter was given, return all workshops
    else if (ws == undefined) {
      const query = "SELECT workshop FROM works";
      const response = await pool.query(query);

      const shops = response.rows.map(function (item) {
        return item.workshop;
      });

      res.json({ workshops: shops });

    }
  } catch (err) {
    const e = { error: "workshop not found" };
    res.json(e);
    console.log(err);
  }

});




//server start
app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`);
  // eslint-disable-line no-console
});
