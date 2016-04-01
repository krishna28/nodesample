var User = require('../models/user');

var Story = require('../models/story');

var config = require('../../config');

var secretKey = config.secretkey;

var jsonwebtoken = require('jsonwebtoken');

var createToken = function (user) {
    var token = jsonwebtoken.sign({
        id: user._id
        , name: user.name
        , username: user.username
    }, secretKey, {
        expiresInMinute: 1440
    });

    return token;
};

module.exports = function (app, express, io) {

    var api = express.Router();
    api.post('/signup', function (req, res) {

        var user = new User({
            name: req.body.name
            , username: req.body.username
            , password: req.body.password
        });

        var token = createToken(user);

        user.save(function (err) {
            if (err) {
                res.send(err);
                return;
            }
            res.json({
                success: true
                , message: "user created successfully"
                , token: token
            });
        });


    });

    api.get('/users', function (req, res) {

        User.find({}, function (err, users) {
            if (err) {
                res.send(err);
                return;
            }
            res.json(users);
        });

    });

    api.post('/login', function (req, res) {

        User.findOne({
            username: req.body.username
        }).select('name username password').exec(function (err, user) {
            if (err) throw err;

            if (!user) {
                res.json({
                    message: "user does not exist"
                });
            } else {
                validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    res.json({
                        message: "invalid password"
                    });
                } else {
                    // res.json({message:"successfully logged in"});
                    var token = createToken(user);
                    res.json({
                        success: true
                        , message: "user logged in "
                        , token: token
                    });
                }
            }

        });

    });


    api.use(function (req, res, next) {
        console.log("somebody jsu cae to our app");
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];
        if (token) {
            jsonwebtoken.verify(token, secretKey, function (err, decoded) {
                if (err) {
                    res.status(403).send({
                        success: false
                        , message: "failed to authenticate"
                    });
                } else {
                    req.decoded = decoded;
                    console.log(decoded);
                    next();
                }
            })
        } else {
            res.status(403).send({
                success: false
                , message: "no token provided"
            });
        }

    });


    //    app.get('/',function(req,res){
    //        res.json({message:"welcome to the home page"});
    //    });


    api.route('/')
        .post(function (req, res) {
            var story = new Story({
                creater: req.decoded.id
                , content: req.body.content
            });

            story.save(function (err, newStory) {
                console.log("inside data");
                if (err) {
                    res.send(err);
                    return;
                }
                io.emit('story', newStory);
                res.json({
                    story: newStory
                    , message: "user story created"
                });
            })
        })
        .get(function (req, res) {
            Story.find({
                creater: req.decoded.id
            }, function (err, stories) {
                if (err) {
                    res.send(err);
                    return;
                } else {
                    res.json({
                        stories: stories
                    });
                }
            })
        });

    api.get('/me', function (req, res) {

        res.json(req.decoded);

    });

    //destination next to middleware
    return api;
}