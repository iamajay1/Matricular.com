var express = require('express');
var app = express.Router();
var mongoose = require('mongoose');
var UserDetails = mongoose.model('UserDetails');
var resGenerator = require('./../../libs/resGenerator');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
//defining token...
var token;
// used to create, sign, and verify tokens
var jwt = require('jsonwebtoken');

//json secret key
var jsonSecret = "1993%^#QWERTY654321#90";


//defining Auth as middleware for accessing api's
//defining decoded tokens...
var decodedToken;
var auth = function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, "1993%^#QWERTY654321#90", function (err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });

            } else {
                // if everything is good, save to request for use in other routes
                req.decodedToken = decoded;


                //console.log("Decoded Token: "+decodedToken);
                next();
            }
        });
    }
}

//route to login
app.post('/login', function (req, res) {
    //search for entered email id in mongodb
    UserDetails.findOne({
        email: req.body.email
    }, function (error, user) {
        // console.log("user : "+user);
        if (error) {
            var err = resGenerator.generate(true, "Something is not working : " + error, 500, null);
            res.json(err);
        } else if (user === null || user === undefined || user.name === null || user.name === undefined) {
            var response = resGenerator.generate(true, "No user found !! Check email and try again... ", 400, null);
            res.json(response);
        } else if (!user.compareHash(req.body.password)) {
            var response = resGenerator.generate(true, "Wrong password!! Check password and try again...", 401, null);
            res.json(response);
        } else {

            //creating jwt token for user to authenticate other requests
            token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 60),
                id: user._id,
                email: user.email,
                name: user.name,
                mobileNumber: user.mobileNumber
            }, jsonSecret);

            var response = resGenerator.generate(false, "Logged in Successfully", 200, user);
            response.token = token;
            res.json(response);
        }

    });

});
// end login route

//route to signup
app.post('/signup', function (req, res) {


    //check if email id already exists and flag if exists
    UserDetails.findOne({
        email: req.body.email
    }, function (error, user) {

        if (error) {
            //console.log("error");
            var err = resGenerator.generate(true, "Something is not working, error  : " + error, 500, null);
            res.json(err);
        } else if (user) {
            //console.log("user");
            var err = resGenerator.generate(true, "email  already exists, please Login", 400, null);
            res.json(err);
        } else {

            //new user instance
            var newUserDetails = new UserDetails({

                name: req.body.name,
                email: req.body.email,
                mobileNumber: req.body.mobileNumber
            });
            newUserDetails.password = newUserDetails.generateHash(req.body.password);

            //saving user data in mongodb
            newUserDetails.save(function (error) {
                if (error) {
                    var response = resGenerator.generate(true, "Some error occured : " + error, 500, null);
                    res.json(response);
                } else {

                    token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        id: newUserDetails._id,
                        email: newUserDetails.email,
                        name: newUserDetails.name,
                        mobileNumber: newUserDetails.mobileNumber
                    }, jsonSecret);

                    var response = resGenerator.generate(false, "Successfully signed up", 200, newUserDetails);
                    response.token = token;
                    res.json(response);
                }
            });
        }
    });

});
//end signup route

//User Information
app.get('/getUserInfo', auth, function (req, res) {
    UserDetails.find(function (error, user) {
        if (error) {
            //console.log("error");
            var err = resGenerator.generate(true, "Something is not working, error  : " + error, 500, null);
            res.json(err);
        } else {
            var response = resGenerator.generate(false, "Successfully Got all user info", 200, user);
            response.token = token;
            res.json(response);
        }
    });
});


//route to get forpass data   
app.post('/forgotPass', function(req, res) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      UserDetails.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
           var err = resGenerator.generate(true, "email address, " + req.body.email + " is not associated with any account", 400, null);
            res.json(err);
        }
        else{
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      }
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
          user: 'Enter Your Email ID',
          pass: 'Your Email Password'//process.env.GMAILPW
        },
      tls: {
          rejectUnauthorized: false
      }
      });
      var mailOptions = {
        to: user.email,
        from: 'Ajay@Matricular.com',
        subject: 'Password Reset for account',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/#/change/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
            res.send({ msg: 'An email has been sent to ' + user.email + ' with further instructions.' });
            done(err);

      });
    }
  ]
  );
});
//route to reset data 
app.post('/reset/:token',function(req, res) {
  async.waterfall([
    function(done) {
      UserDetails.findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires').gt(Date.now())
        .exec(function(err, user) {
          if (!user) {
             var err = resGenerator.generate(true, "Password reset token is invalid or has expired.", 400, null);
            res.json(err);
          }
          if(req.body.password!=req.body.confirm){
             var err = resGenerator.generate(true, "Password dont match", 400, null);
            res.json(err);
          }
          else {
            user.password = user.generateHash(req.body.password);
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          user.save(function(err) {
            done(err, user);
          });
           }
        });
    },
    function(user, done) {
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "Enter Your Email ID",
          pass: "Enter Your Email Password"
        },
      tls: {
          rejectUnauthorized: false
      }
      });
      var mailOptions = {
        from: 'Ajay@Matricular.com',
        to: user.email,
        subject: 'Your account password has been changed',
        text: 'Hello,\n\n' +
        'This is a confirmation that the password for your account ' + user.email + ' has just been rreset.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        res.send({ msg: 'Your password has been changed successfully.' });
      });
    }
  ]);
});




//exporting Routes
module.exports = app;
