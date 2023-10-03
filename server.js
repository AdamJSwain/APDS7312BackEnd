//console.log('Shalom world');
//const express = require('express');
const http = require('https');
const app = require('./app');
const fs = require('fs');

const port = 3000

/*
app.get('/', (req, res) => {
    res.send('Molweni Nonke express')
})
*/

const server = http.createServer(
    {
        key:    fs.readFileSync('keys/privatekey.pem'),
        cert:   fs.readFileSync('keys/certificate.pem')
    },app);

server.listen(port)