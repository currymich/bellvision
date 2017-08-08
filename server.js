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
          type: 'text/plain',
          value: `Prefered Appointment Location: ${req.body.office}\n
          Patient Name: ${req.body.name}\n
          Patient DOB: ${req.body.dob}\n
          Patient Email: ${req.body.email}\n
          Patient Phone: ${req.body.phone}\n
          Insurance: ${req.body.insurance}`
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
