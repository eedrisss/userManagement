//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const { response } = require("express");
const https = require("https")


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res) {

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    const password = req.body.password;

    const data = {
        members: [{
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }

        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us10.api.mailchimp.com/3.0/lists/e635d1e36";

    const options = {
        method: "POST",
        auth: "eedrisss:b20bb2f54f853fbe9454bfee48ff59b4-us10"
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000.");
})

//API KEY b20bb2f54f853fbe9454bfee48ff59b4-us10
//unique ID e635d1e364