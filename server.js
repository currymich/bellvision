// REQUIREMENTS
var express     = require('express');
var app         = express();
var router      = express.Router();
require('dotenv').config();

var bodyParser  = require('body-parser');
var logger      = require('morgan');
var path        = require('path')
var port        = process.env.PORT || 4000;

var sg = require('sendgrid')(process.env.API_KEY);

// MIDDLEWARE
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('dev'));

app.use('/sitemap', express.static('sitemap.txt'))

app.get('/', function(req, res){
  res.sendFile('index.html', {root: __dirname});
});

app.post('/appointment', function(req,res) {
  console.log(req.body);
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      personalizations: [
        {
          to: [
            {
              email: 'belldentalcenter@gmail.com'
            }
          ],
          subject: 'New Appointment Request from Bell Dental Site'
        }
      ],
      from: {
        email: req.body.email
      },
      content: [
        {
          type: 'text/html',
          value: `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="Content-Style-Type" content="text/css">
  <style type="text/css">
    p.p1 {margin: 0.0px 0.0px 0.0px 0.0px; line-height: 43.0px; font: 24.0px Arial; color: #555555; -webkit-text-stroke: #555555}
    p.p2 {margin: 0.0px 0.0px 0.0px 0.0px; line-height: 21.0px; font: 18.0px Arial; color: #555555; -webkit-text-stroke: #555555}
    span.s1 {font-kerning: none; background-color: #ffffff}
    span.s2 {font: 12.0px Arial; font-kerning: none}
    table.t1 {border-collapse: collapse}
    td.td1 {width: 500.0px; min-width: 320.0px; max-width: 500.0px}
  </style>
</head>
<body>
<table cellspacing="0" cellpadding="0" class="t1">
  <tbody>
    <tr>
      <td valign="top" class="td1">
        <p class="p1"><span class="s1"><b>﻿New Patient Application</b></span><span class="s2"><br><br>
</span></p>
        <p class="p2"><span class="s1">Prefered Office Location: ${req.body.office}</span></p>
        <p class="p2"><span class="s1">Patient Name: ${req.body.name}</span></p>
        <p class="p2"><span class="s1">Patient Phone Number: ${req.body.phone}</span></p>
        <p class="p2"><span class="s1">Patient Email: ${req.body.email}</span></p>
        <p class="p2"><span class="s1">Patient Date of Birth: ${req.body.dob}</span></p>
        <p class="p2"><span class="s1">Patient Insurance Provider: ${req.body.insurance}</span></p>
      </td>
    </tr>
  </tbody>
</table>
</body>
</html>
`
        }
      ]
    }
  });
  sg.API(request)
  .then(function (response) {
    console.log(response.body);

    setTimeout(function(){res.redirect('/')}, 3000);
  })
  .catch(function (error) {
    // error is an instance of SendGridError
    // The full response is attached to error.response
    console.log(error.response.statusCode);
    setTimeout(function(){res.redirect('/')}, 3000);
  });

})

// LISTENERS
app.listen(port, function() {
  console.log("Server Initialized");
  console.log("Listening on " + port);
})
