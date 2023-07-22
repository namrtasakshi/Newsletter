const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", async function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const password = req.body.password;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/bf6e7c5162";
  const apiKey = "4b544f2069990a5e5d351aa87b8709b4-us21";
  const base64Auth = Buffer.from(`namrta:${apiKey}`).toString("base64");

  const options = {
    method: "POST",
    auth: `:${base64Auth}`,
  };

  try {
    const response = await sendMailchimpRequest(url, options, jsonData);
    if (response.statusCode === 401 || response.statusCode===200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  } catch (error) {
    console.log(error);
    res.sendFile(__dirname + "/failure.html");
  }
});

// Function to send the Mailchimp API request and return a promise
function sendMailchimpRequest(url, options, jsonData) {
  return new Promise((resolve, reject) => {
    const request = https.request(url, options, function (response) {
      let responseData = "";

      response.on("data", function (data) {
        responseData += data;
      });

      response.on("end", () => {
    console.log("Mailchimp API Response:", responseData);
    // Process the response as needed
  });
    });

    request.on("error", function (error) {
      reject(error);
    });

    console.log(jsonData, "jsaon Data");
    request.write(jsonData);
    request.end();
  });
}

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
