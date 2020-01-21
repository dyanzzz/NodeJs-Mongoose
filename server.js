//npm install express mongoose body-parser --save

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();

mongoose.connect('mongodb+srv://admin:adminqwerty@cluster0-bky5t.mongodb.net/db-mongoose?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDb connected'))
.catch(err => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
    extended: true
}));

var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    }
});

UserSchema.methods.addLastName = function(lastName){
    this.name = this.name + ' ' + lastName;
    return this.name;
}

var User = mongoose.model('User', UserSchema);

app.get('/', (req, res)=>{
    User.find()
    .then(users =>res.send(users))
    .catch(err => res.send(err));
});

app.get('/search-user/:id', function(req, res, next){
    //user.find = menampilkan seluruh yg ada di mongoDB ,jika tidak ada hanya display empty array
    //user.findOne = mongoDB hanya mencari spesifik user/object
    //user.findById = mencari user erdasarkan ID
    User.findById({
        //name atau _id = disesuaikan dengan field di mongoDB/database
        _id: req.params.id
    }, function(err, foundUser){
        if(foundUser){
            //res.json(foundUser);
        
            foundUser.addLastName("ando");
            foundUser.save(function(err){
                res.json(foundUser)
            });
        }else{
            res.json("User Not found");
        }
    });
});

app.get('/create-user', function(req, res, next){
    var user = new User();
    user.name = "Brandon2";
    user.email = "brandon2@gmail.com";
    user.age = 17;
    user.save(function(err){
        if(err) next(err);
        res.json(user);
    });
});

app.post('/create-user-post', function(req, res, next){
    var user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.age = req.body.age;
    user.save(function(err){
        if(err) console.log(err);
        res.json(user);
    });
});

app.listen(3000, function(err){
    if(err){
        console.log(err);
    }else{
        console.log("Server running in port 3000");
    }
});
