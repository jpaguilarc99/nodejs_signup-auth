const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
//const mailchimp = require('@mailchimp/mailchimp_marketing');

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//Método GET inicial
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

//Método POST inicial
app.post("/", function(req, res) {
    const fName = req.body.firstName
    const lName = req.body.lastName
    const email = req.body.email

    var userData = {
    members: [{
        email_address: email,
        status: "subscribed",
        merge_fields: {
            FNAME: fName,
            LNAME: lName
        }
    }
    ]};

    const jsonData = JSON.stringify(userData);

    const url = "https://us14.api.mailchimp.com/3.0/lists/f43b0d559c";

    const options = {
        method: "POST",
        auth: "jpaguilarc99:bb270dd4dde91150531552ff74bf88a2-us14"
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));            
        })
    })

    request.write(jsonData);
    request.end();
});   

//Método POST Failure - redirección a sign up
app.post("/failure", function(req, res) {
    res.sendFile(__dirname + "/signup.html")
})


//Listener
app.listen(port, function() {
    console.log("Server working on port 3000");
});