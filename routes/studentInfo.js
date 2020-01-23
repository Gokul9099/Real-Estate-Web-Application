var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var router = express.Router();
const {check,validationResult } = require('express-validator/check');
var count = 0;
var parser = bodyParser.urlencoded({extended:false});


router.use(session({secret : 'Session_ID_1'}));
var StudentModel = require('../models/student');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Student');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
  console.log("Connected to MongoDB");
});

var schema = mongoose.Schema;
var studentSchema = new schema({
    firstName : {type : String, required : true },
    lastName : {type : String, required : true },
    degree : String,
    program : String,
    graduation: Number,
    email: String
});

var Student = mongoose.model('Student',studentSchema);
var student1 = {
    firstName : "Frank",
    lastName : "Harding",
    degree : "BS",
    program : "Anthropology"
};
var student2 = {
    firstName : "Frank",
    lastName : "Kerr",
    degree : "BA",
    program : "Aesthetics"
};
var student3 = {
    firstName : "Helena",
    lastName : "Cardenas",
    degree : "BS",
    program : "Human History"
};
var student4 = {
    firstName : "Raymond",
    lastName : "Austin",
    degree : "MA",
    program : "Public Administration"
};
var student5 = {
    firstName : "Lilia",
    lastName : "Ford",
    degree : "MS",
    program : "Architecture"
};
var student6 = {
    firstName : "Jovancy",
    lastName : "Hicks",
    degree : "BS",
    program : "Mathematics"
};
var s1 = new Student(student1);
var s2 = new Student(student2);
var s3 = new Student(student3);
var s4 = new Student(student4);
var s5 = new Student(student5);
var s6 = new Student(student6);
Student.insertMany([s1,s2,s3,s4,s5,s6]);
var parser = bodyParser.urlencoded({extended:false});

router.get('/', function (req, res) {
  var data=req.query;
  if(req.session.theStudent )
    {
        res.render('main',{student: req.session.theStudent});
    }
    else
    {
        var path = process.cwd();
        console.log(req.session.count);
        res.render("index",{count:req.session.count});
    }
});

var counter = function(req,res,next){
    count += 1;
    req.session.count = count;
    console.log("Form was submitted " + count + " times");
    next();
}

router.post('/',counter, parser,[check('firstName').isAlpha().withMessage('Must be a String'),
check('lastName').isAlpha().withMessage('Must be a String'),
check('degree').isAlpha().withMessage('Must be only String'),
check('program').isAlpha().withMessage('Must be a String'),
check('graduation').isNumeric().isLength({ max: 4 }).withMessage('Must be a valid Year'),
check('email').isEmail().withMessage('Must be a valid email')
], function(req,res)
{
    var body = req.body;
    req.session.theStudent = StudentModel.student(body.firstName,body.lastName,body.degree,body.program,body.graduation,body.email);
    console.log(req.session.theStudent);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors:errors.array()});
    }
    Student.find({firstName:req.body.firstName, lastName: req.body.lastName},function(err, documents){
        if(documents.length === 0)
        {
            var documents ={
                firstName :req.body.firstName,
                lastName : req.body.lastName,
                degree : req.body.degree,
                program : req.body.program,
                graduation: req.body.graduation,
                email: req.body.email
            };
            var save_document = new Student(documents);
            save_document.save();
            res.render('main',{student:[documents]});
        }
        // If there are more than one studnt with same first and last names
        else {
              for(var i=0;i<documents.length; i++){
                documents[i].firstName = req.body.firstName;
                documents[i].lastName = req.body.lastName;
                documents[i].degree = req.body.degree;
                documents[i].program = req.body.program;
                documents[i].graduation = req.body.graduation,
                documents[i].email = req.body.email
                documents[i].save();
              }

             res.render('main',{student:documents});
        }
});
//res.redirect('/studentInfo');
});
// router.get('/:firstName/:lastName/:degree/:program', function (req, res) {
//     var param = req.params;
//     StudentModel = StudentModel.student(param.firstName, param.lastName,param.degree,param.program);
//     res.render('main',{student:StudentModel});
// });


router.get('/displayAll',function(req,res)
{
    Student.find().then(function(documents){
        console.log("Total number of documents: " + documents.length);
        res.render('main',{student : documents});
   });
});


router.post('/displayOne',parser, function(req,res)
{
    var firstName = req.body.firstName;
    Student.find({firstName : firstName}).then(function(documents){
        console.log("Number of documents for " +firstName + ": " +  documents.length);
        res.render('main',{student : documents});
   });
});

router.get('/*',function(req,res){
    res.send("No information available");
});

module.exports = router;
