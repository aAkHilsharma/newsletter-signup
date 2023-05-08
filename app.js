const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/signup.html');
});
app.post('/', function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  console.log(jsonData);
  const url = 'https://us10.api.mailchimp.com/3.0/lists/7755ae94f1';
  const options = {
    method: 'POST',
    auth: 'auth 3eb16b62a95975e4dbc8d06a5f93d099-us10',
  };

  const request = https.request(url, options, function (response) {
    response.on('data', function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.listen(3000, function () {
  console.log('Server running on port 3000...');
});
