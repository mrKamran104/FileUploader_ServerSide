const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var fs = require('fs');
const cors = require('cors');
const bModule = require('./bModel')
const pModule = require('./pModel')
var multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

var upload = multer({ storage: storage });

const app = express();

app.use('/uploads',express.static('uploads'))

app.set('port', process.env.PORT || 3001);
app.use(cors())
app.use(bodyParser.json());
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect('mongodb+srv://admin:admin104@cluster0.n3fx8.mongodb.net/FileUploadDb?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection
    .once('open', () => {
        console.log('Yahooo! Connection is Established.');
        // addUser();
    })
    .on('error', (err) => {
        console.log('Err: ', err);
    })


app.get('/', (req, res)=>{
res.send('Yahooo!, API is Working...')
})    

app.post('/add_dataB', upload.single('file'), (req, res) => {
    console.log(req)
    const addUser = new bModule({
        name: req.body.name, email: req.body.email,
        fileData: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: req.file.mimetype
        },
        fileName: req.file.filename
    })

    addUser.save()
        .then((data) => {
            console.log('saved user', data)
            res.send(data)
        })
        .catch((err) => {
            console.log('Err ', err)
            res.send(err)
        });
})

app.post('/add_dataP', upload.single('file'), (req, res) => {
    console.log(req)
    const addUser = new pModule({
        name: req.body.name, email: req.body.email,
        filePath: {
            path: path.join(__dirname + '/uploads/' + req.file.filename),
            contentType: req.file.mimetype
        },
        fileName: req.file.filename
    })

    addUser.save()
        .then((data) => {
            console.log('saved user', data)
            res.send(data)
        })
        .catch((err) => {
            console.log('Err ', err)
            res.send(err)
        });

    // res.send('okay, ' + req.body.name + ' your file is successfully uploaded, ' + req.file.filename)
})

app.get('/b', (req, res) => {
    bModule.find({})
        .then((data) => {
            console.log('show user', data)
            res.send(data)
        })
        .catch((err) => {
            console.log('Err ', err)
            res.send(err)
        });
})

app.get('/p', (req, res) => {
    pModule.find({})
        .then((data) => {
            console.log('show user', data)
            res.send(data)
        })
        .catch((err) => {
            console.log('Err ', err)
            res.send(err)
        });
})

app.get('/del_upload', (req, res) => {
    // fs.rmdir(`${__dirname}/uploads/`, { recursive: true })
    //     .then(() => res.send('directory removed!'));
    const bool = rmDir(`${__dirname}/uploads/`, false);
    // console.log(bool)
    if (bool) {
        res.send('directory removed!')
    } else {
        res.send('Error!')
    }
})
app.get('/del_download', (req, res) => {
    // fs.rmdir(`${__dirname}/uploads/`, { recursive: true })
    //     .then(() => res.send('directory removed!'));
    const bool = rmDir(`${__dirname}/downloads/`, false);
    // console.log(bool)
    if (bool) {
        res.send('directory removed!')
    } else {
        res.send('Error!')
    }
})

const rmDir = (dirPath, removeSelf) => {
    if (removeSelf === undefined)
        removeSelf = true;
    if (removeSelf) {
        fs.rmdirSync(dirPath, { recursive: true })
    }
    else
        fs.readdir(dirPath, (err, files) => {
            if (err) return false;

            for (const file of files) {
                fs.unlink(path.join(dirPath, file), err => {
                    if (err) return false;
                });
            }
        });

    return true
}

app.get('/downloadB/:file', (req, res) => {
    // res.download(__dirname+'/uploads/Screenshot (34).png', 'mk.png')
    bModule.findOne({ fileName: req.params.file })
        .then((data) => {
            console.log('show user', data)
            var buf = Buffer.from(data.fileData.data, 'base64');
            fs.writeFileSync(__dirname + '/downloads/' + req.params.file, buf, (err) => {
                // console.log(err) 
            });
            res.download(`${__dirname}/downloads/${req.params.file}`)
            console.log('file sent')
        })
        .catch((err) => {
            console.log('Err ', err)
            res.send(err)
        });
})

app.get('/downloadP/:file', (req, res) => {
    // res.download(__dirname+'/uploads/Screenshot (34).png', 'mk.png')
    bModule.findOne({ fileName: req.params.file })
        .then((data) => {
            console.log('show user', data)
            // var buf = Buffer.from(data.fileData.data, 'base64');
            // fs.writeFileSync(__dirname + '/downloads/' + req.params.file, buf, (err) => {
            //     // console.log(err) 
            // });
            res.download(data.filePath.path)
            console.log('file sent')
        })
        .catch((err) => {
            console.log('Err ', err)
            res.send(err)
        });
})

app.listen(app.get('port'), function () {
    console.log(`MongoDb Started on: http://localhost:${app.get('port')}`);
});


    // rmDir = function (dirPath, removeSelf) {
    //     if (removeSelf === undefined)
    //         removeSelf = true;
    //     try { var files = fs.readdirSync(dirPath); }
    //     catch (e) { return; }
    //     if (files.length > 0)
    //         for (var i = 0; i < files.length; i++) {
    //             var filePath = dirPath + '/' + files[i];
    //             if (fs.statSync(filePath).isFile())
    //                 fs.unlinkSync(filePath);
    //             else
    //                 rmDir(filePath);
    //         }
    //     if (removeSelf)
    //         fs.rmdirSync(dirPath);
    // };