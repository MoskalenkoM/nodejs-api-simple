const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const app = express();

// Connection URL
const dbUrl = 'mongodb://localhost:27017/footballplayers';

// connection options
const connectOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

// Create a new MongoClient
const client = new MongoClient(dbUrl, connectOptions);

// Database Name
const collectionName = 'players';

// instance db
let db;

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.get('/', (req, res) => {
    res.send('Hello from API of Node.js!');
});

app.get('/players', (req, res) => {
    db.collection(collectionName)
        .find()
        .toArray((err, players) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }
            res.send(players);
        });
});

app.get('/player/:id', (req, res) => {
    db.collection(collectionName).findOne({
            _id: ObjectId(req.params.id)
        },
        (err, targetPlayer) => {
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.send(targetPlayer);
        }
    );
});

app.post('/player', (req, res) => {
    const newPlayer = {
        name: req.body.name || 'No name',
        surname: req.body.surname || 'No surname'
    };

    db.collection(collectionName).insertOne(newPlayer, err => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        res.send(newPlayer);
    });
});

app.put('/player/:id', (req, res) => {
    db.collection(collectionName).updateOne({
            _id: ObjectId(req.params.id)
        }, {
            $set: {
                name: req.body.name,
                surname: req.body.surname
            }
        },
        err => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }
            res.sendStatus(200);
        }
    );
});

app.delete('/player/:id', (req, res) => {
    db.collection(collectionName).deleteOne({
            _id: ObjectId(req.params.id)
        },
        err => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }
            res.sendStatus(200);
        }
    );
});

client.connect(err => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Connected to DB!');
    db = client.db(collectionName);
    app.listen(8080, () => {
        console.log('API is running!');
    });
});