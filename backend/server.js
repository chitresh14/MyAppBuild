const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
var cookieParser = require('cookie-parser');

const fs = require('fs')


//connnection to mongoDB
const db = require('./db/db.js');
//Custom imports
const userRouter = require('./routers/all_routes.js');
const PORT = process.env.PORT;
const app = express();

//Body Parser Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(userRouter);


//Listeniong to Port
const server = app.listen(PORT, () => {
    console.log(`app is running on port: ${PORT}`);
});
// server timeout
server.timeout = 50000;

process.on('exit', (code) => {
    mongoose.connection.close();
    console.log(`About to exit with code: ${code}`);
});


process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    process.exit();
});

process.on('uncaughtException', function(err) {
    mongoose.connection.close();
    console.log('Uncaught exception has been handled. Exception caught is ');
    console.log(err.toString());
    console.log(err.stack);
    process.exit();
});