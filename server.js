const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let data = [];
let sharedKey;

// Set Shared Key
sharedKey = process.env.SHARED_KEY || 'wAMrS7HaoNoYPUT6KDEjnWAMdqe5XpFv';
console.log(`Shared Key: ${sharedKey}`);

app.use(function (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json({
            error: 'No credentials sent!'
        });
    }
    if (req.headers.authorization != sharedKey) {
        return res.status(401).json({
            error: 'Wrong credentials'
        });
    }
    next();
});

// Gives Location Data
app.get('/', (req, res) => {
    let timestamp = Date.now();

    checkData(timestamp);

    res.send(data);
});

// Receives Location Data
app.post('/post', (req, res) => {
    let newObj = req.body;
    let timestamp = Date.now();

    updateData(newObj, timestamp);
    checkData(timestamp);
    res.send(data);
});

// Updates Location Data
function updateData(newObj, timestamp) {
    let objectAlreadyExisted = false;
    data.forEach(d => {
        if (d.name == newObj.name) {
            objectAlreadyExisted = true;
            d.name = newObj.name;
            d.x = newObj.waypoint.x;
            d.y = newObj.waypoint.y;
            d.plane = newObj.waypoint.plane;
            d.type = newObj.type;
            d.title = newObj.title;
            d.world = newObj.world;
            d.timestamp = timestamp;
        }
    });

    if (!objectAlreadyExisted) data.push({
        "name": newObj.name,
        "x": newObj.waypoint.x,
        "y": newObj.waypoint.y,
        "plane": newObj.waypoint.plane,
        "type": newObj.type,
        "title": newObj.title,
        "world": newObj.world,
        "timestamp": timestamp,
    });
}

// Checks if it has received data from a user for the last 5 seconds
function checkData(timestamp) {
    for (let i = data.length - 1; i >= 0; i--) {
        if (timestamp - data[i].timestamp > 5000) {
            data.splice(i, 1);
        }
    }
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
