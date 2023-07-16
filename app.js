const express= require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app= express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
const firstName = req.body.fName;
const lastName = req.body.lName;
const email = req.body.email;
const password = req.body.password;

const data={
   members: [
    {
email_address: email,
status: "subscribed",
merge_fields: {
    FNAME: firstName,
    LNAME: lastName,
}
    }
   ] 
};

const jsonData = JSON.stringify(data);
// console.log(firstName, lastName, email, password);

const url= "https://us21.api.mailchimp.com/3.0/lists/bf6e7c5162";
const options = {
    method : "POST",
    auth : "namrta:bdf10acf60d8927817e22b7bc23c2912-us21"
}

const request = https.request(url, options, function(response){
  
    if (response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
    }
    else {
        res.sendFile(__dirname + "/failure.html");
    }
    
response.on("data", function(data){
    console.log(JSON.parse(data));
})
})
request.write(jsonData);
request.end();
});

// app.post("/failure", function(req, res){
//     res.redirect("/");
// });


app.listen(3000, function(){
    console.log("Server is running on port 3000");
})

//
//https://us21.api.mailchimp.com/3.0/

//API KEY 
//bdf10acf60d8927817e22b7bc23c2912-us21

//Audience ID/
//bf6e7c5162