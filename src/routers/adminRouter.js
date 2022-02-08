const express = require('express');
const debug = require('debug')('app:adminRouter');
//The MongoClient object helps us interact with our Mongodb database
const { MongoClient} = require('mongodb');
const sessions = require('../data/sessions.json');

const adminRouter = express.Router();

adminRouter.route('/').get((req, res) => {
    const url = 'mongodb+srv://isnuwa:S9ti9S8iyLiXzgb@globomantics.7kvbj.mongodb.net?retryWrites=true&w=majority';
    const dbName = 'globomantics';

    //create an IIFE (Immediately Invoked Function) function to
    //1. connect to the server that hosts our db
    //2. create the 'globomantics' database inside our cloud hosted MongoDB cluster
    //3. create a sessions collection and insert data from our sessions.json file
    //   into that collection

    (async function mongo() {
        let client;
        try {
            //our new Mongo Client connects to our hosted MongoDB Management System
            //using the specified url
            client = await MongoClient.connect(url, { useUnifiedTopology: true });
            
            //debug our application to check for a successful connection
            debug('Connect to the mongo DB');

            //create a new database using our current client connection
            //MongoDB has the ability to create a new specified db if none already exists
            const db = client.db(dbName);

            //create a new collection named 'sessions' and insert our data from the
            //sessions.json file
            const response = await db.collection('sessions').insertMany(sessions);
            
            //send as a response to our browser the json equivalent of the result of the
            //insertion that was made into our database
            res.json(response);

        } catch (error) {
            debug(error.stack);
        }
    })()

});

module.exports = adminRouter;