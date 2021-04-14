require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("port", 8080);

app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));

const Pool = require("pg").Pool;
const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "taskfour"
};

const pool = new Pool(config);

//HELLO WORLD
app.get("/hello", (req, res) => {
	res.json({msg: "Hello, World!"});
});

/*
   ///
  ///  SEARCH ATTRACTIONS
 ///   
///    find attractions in a particular town
//
*/
app.get("/searchAttractions",async (req, res) => {
    const town = req.query.town;
    console.log(town);
    try {
        const template = "SELECT name FROM attractions WHERE location = $1";
        const response = await pool.query(template, [town]);
        const results = response.rows.map((row) => {return (row.name)})
        res.json({result: results});
    } catch (err){
        console.log(err);
    }

});


   ///
  ///  ADD ATTRACTION
 ///   
///    Insert an attraction into the database
//
app.post("/addAttraction", async (req, res) => {
    const name = req.body.name;
    const town = req.body.location;
    const theurl = req.body.url;
    try {
        const template1 = "SELECT * FROM attractions WHERE name = $1 AND location = $2 AND url = $3";
        const check = await pool.query(template1, [name, town, theurl]);
        if (check.rowCount != 0){
            res.json({status: "attraction already in database"});
        }
        else {
            // else let's insert it
            const template2 = "INSERT INTO attractions (name, location, url) VALUES ($1, $2, $3)"
            const response = await pool.query(template2, [name, town, theurl]);
            res.json({status: "added"});
        }
    } catch (err){
        // whoops
        console.log(err);
    }

})


/* 

   ///
  ///  LIST ALL
 ///   
///    List all the campground names
//
    
*/

app.get("/listAll", async (req, res) => {
    try {
        
        const query = "SELECT name FROM campgrounds";
        const dbresponse = await pool.query(query);
        const results = dbresponse.rows.map((row) => {return row.name});
        res.json({campgrounds: results})

    } catch (err){
        console.log(err);
    }
});


/*

   SEARCH

   Search get request takes one parameter 
   
   * name: the name of the campground
    It returns the json object containing all the information for a campground

    SEE THE MAP FUNCTION IN SEARCH ATTRACTIONS
*/

app.get('/search', async (req, res) => {
    let searchTerm = req.query.name;
    console.log(`Search for ${searchTerm}`);
    
    // TODO
    try {
        const template = "SELECT name, location, maxlength FROM campgrounds WHERE name = $1";

        const response = await pool.query(template, [searchTerm]);

const results = response.rows.map(function(row) {
    return {campground: row.name,
    location: row.location,
    maxlength: row.maxlength
}
})

//if no results are returned
        if (response.rowCount == 0){
            res.json({status: "not found", searchTerm: req.query.name});
        }else{
         res.json({campgrounds: results});

        }
    } catch (err){
        console.log(err);
    }


})

/* Fit get request. One parameter called length which is the length of the RV.
   the request returns the campgrounds that can fit that length RV. 
   so, if the length parameter is 22 the method should return

   {
    "campgrounds": [
        {
            "campground": "Three Rivers Petroglyph Site",
            "location": "Lincoln, NM",
            "maxLength": "25"
        },
        {
            "campground": "Baca Campground",
            "location": "Lincoln, NM",
            "maxLength": "32"
        },
        {
            "campground": "Valley of Fires Recreation Area",
            "location": "Carrizozo, NM",
            "maxLength": "38"
        },
        {
            "campground": "Oak Grove Campground",
            "location": "Alto, NM",
            "maxLength": "25"
        },
        {
            "campground": "Three Rivers Campground",
            "location": null,
            "maxLength": "25"
        },
        {
            "campground": "Silver Campground",
            "location": "Cloudcroft, NM",
            "maxLength": "30"
        },
        {
            "campground": "Datil Well Campground",
            "location": "Datil, NM",
            "maxLength": "35"
        }
    ]
}

   The output needs to match this format. The response json object has a key called 'campgrounds' 
   whose value is an array of json objects each representing a campground. Each of those Json 
   objects in the array have the keys 'campground', 'location', and 'maxLength'.

*/
 
    // TODO
 app.get('/fit', async (req, res) => {
    let input = req.query.length;   

    try {
        const template = "SELECT name, location, maxlength FROM campgrounds WHERE maxlength > $1";

        const response = await pool.query(template, [input]);


const results = response.rows.map(function(row) {
    return {campground: row.name,
    location: row.location,
    maxLength: row.maxlength
}
})

//if no results are returned
        if (response.rowCount == 0){
            res.json({status: "not found", searchTerm: req.query.name});
        }else{
         res.json({campgrounds: results});

        }
    } catch (err){
        console.log(err);
    }


})

/*
    elevation get request. This request takes 2 parameters:

        altitude:  the elevation specified by the user
        direction: can be either the strings 'higher' or 'lower'

    The interpretation of this is as follows. If the request is

        /elevation?altitude=8000&direction=higher
    
    then the request should return all camggrounds higher than 8000 feet:

    {
    "campgrounds": [
        {
            "campground": "Oak Grove Campground",
            "elevation": 8464,
            "town": "Alto, NM"
        },
        {
            "campground": "Silver Campground",
            "elevation": 8956,
            "town": "Cloudcroft, NM"
        },
        {
            "campground": "Bear Trap Campground",
            "elevation": 8497,
            "town": "Magdalena, NM"
        }
    ]
}
*/

app.get('/elevation', async (req, res) => {
    
    let input = req.query.altitude;
    
    let query = '';
  try {   
    if (req.query.direction == 'lower'){
        query = "SELECT name, elevation, location FROM campgrounds WHERE elevation < $1";


    } else {
        query =  "SELECT name, elevation, location FROM campgrounds WHERE elevation > $1";
    }
   
        // TO DO
const response = await pool.query(query, [input]);
const results = response.rows.map(function(row) {
    return {campground: row.name,
    elevation: row.elevation,
    town: row.location
}
})
//if no results are returned
if (response.rowCount == 0){
    console.log(results);
    res.json({status: "not found", searchTerm: req.query.name});
}else{
 res.json({campgrounds: results});

}
    } catch (err){
         console.log(err);
    }
     
});




    /*
   ///
  ///  ADD CAMPGROUND /addCampground Post Request
 ///   
///    Insert a campground into the database
//     Each campground, location pair is unique
/      Meaning there can be two or more campgrounds
       with the same name as long as they are in
       different cities
      

*/

// TO DO
app.post("/addCampground", async (req, res) => {
    const n = req.body.name;

    const location = req.body.location;
    const leng = req.body.maxlength;
    const elev = req.body.elevation;
    const site = req.body.sites;
    const pad = req.body.pad;

try{
    
const template = "IF NOT EXISTS(SELECT name, location from campgrounds WHERE name =n AND location =location) VALUES($1, $2) BEGIN INSERT INTO campgrounds (name, location, maxlength, elevation, sites, padtype) VALUES ($1, $2, $3, $4, $5, $6) END";

const response = await pool.query(template, [n, location], [n, location, leng, elev, site, pad]);



res.json({status: "added"});
}catch (err){
    res.json({status: "campground already in database"});
}

})





//SERVER START
app.listen(app.get("port"), () => {
	console.log(`Find the server at http://localhost:${app.get("port")}`);
	 // eslint-disable-line no-console
});
//Finally we are going to run the code with
