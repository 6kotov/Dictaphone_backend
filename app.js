if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require("express")
const app = express()
const mongoose = require('mongoose')
const User = require('./models/users')
const multer  = require('multer')
const upload = multer({ dest: 'tmp/csv/' })
const csv = require('fast-csv');
const fs = require('fs');
const Json2csvParser = require('json2csv').Parser;

app.set("view engine", "ejs");
app.set('views',__dirname+'/views')
app.use('/public', express.static('public'));

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true,  useUnifiedTopology: true  })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open',async () => {
    console.log('Connected to Mongoose')
})
mongoose.set('useFindAndModify', false);

app.get('/', (req, res) =>{
    res.render('index')
})

app.get('/users_list', async (req, res) =>{
    let users =  await User.find()
    res.render('users_list',{users:users})
})

app.post('/upload', upload.single('csv_upload'), async (req, res) =>{
    let fileRows = [];

  await  csv.parseFile(req.file.path)
        .on("data", function (data) {
            fileRows = data;
        })
        .on("end", async function () {
            fs.unlinkSync(req.file.path);

            const user = new User({
                userName: fileRows[0],
                firstName: fileRows[1],
                lastName: fileRows[2],
                age:fileRows[3],
                married:fileRows[4]
            })
            try {
                await user.save()
            } catch (e){
                console.log({message: e.message})
            }
            res.render('index')
        })

});

app.get('/load_users', async (req,res)=>{
    const fields = ['userName', 'firstName', 'lastName', 'age' , 'married'];
    const users =  await User.find()
    const json2csvParser = new Json2csvParser({ fields: fields, quote: ''});
    const csv = await json2csvParser.parse(users);
    fs.writeFileSync('./users.csv', csv, function (err) {
        if (err) throw err;
    });
    res.download(__dirname+'/users.csv')
})

app.listen(process.env.PORT ||3000, console.log('Server started'))