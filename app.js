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
  const { firstName, lastName, email } = req.body;

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
  const url = 'https://us10.api.mailchimp.com/3.0/lists/7755ae94f1';
  const options = {
    method: 'POST',
    auth: 'akhil1:eafafd873edd8df02ca5e6ff6e9ef72c-us10',
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + '/success.html');
    } else {
      res.sendFile(__dirname + '/failure.html');
    }
    response.on('data', function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post('/failure', function (req, res) {
  res.redirect('/');
});
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Server running on port ${port}...`);
});
