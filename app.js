//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
//to serve images and CSS filesin a directory named public
app.use(express.static("public"));
//to use body parser
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

 app.post("/", function(req, res){
   const firstName = req.body.fName;
   const lastName = req.body.lName;
   const email = req.body.email;

   const data = {
     members: [{
       email_address: email,
       status: "subscribed",
       merge_fields: {
         FNAME: firstName,
         LNAME: lastName
       }
     }
     ]
   };

   const jsonData = JSON.stringify(data);

   //url = https://<dc>.api.mailchimp.com/3.0/ + /lists/ + audiaence Id --- <dc> = end of API key (us5)
   const url = "https://us5.api.mailchimp.com/3.0/lists/487eb93695";
   options = {
     method: "POST",
     auth: "Nizar:4de78fa521507f7adb60a222a9cb994b-us5"
   };

   const request = https.request(url, options, function(response) {

//test if the response is 200 or not to chargethe html correspondant page
     if (response.statusCode === 200) {
       res.sendFile(__dirname + "/success.html");
     } else {
       res.sendFile(__dirname + "/failure.html");
     }

     response.on("data", function(data) {
       console.log(JSON.parse(data));
     });
   });

   request.write(jsonData);
   request.end();

 });

 app.post("/failure", function(req, res) {
   res.redirect("/");
 });

//replace the port 3000 by "process.env.PORT" to let heroku use the port they want
//
app.listen(process.env.PORT || 3000, function() {
  console.log("server is running on port 3000");
});

//API KEY
// 4de78fa521507f7adb60a222a9cb994b-us5

//Audience id
//487eb93695
