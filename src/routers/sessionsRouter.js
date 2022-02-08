const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:sessionsRouter');
const speakerService = require('../services/speakerService');

//bundle of code that helps us to work with a given
//router
const sessionsRouter = express.Router();

//secure the sessionsRouter from unauthorized users
sessionsRouter.use((req, res, next) => {
    //if passport has dropped a user on the session
    //proceed to the next operation
    if (req.user) {
        next();
    } else {
        res.redirect('/auth/signIn');
    }
});

//using sessionRouter to create functionality for the
//different /sessions routes
sessionsRouter.route('/')
    .get((req,res) => {
        //query the globomantics database hosted in the cloud to return
        //all the records/documents in our sessions collection

        //define a variable to store the url we will use to connect to 
        //the db
        const url = 'mongodb+srv://isnuwa:S9ti9S8iyLiXzgb@globomantics.7kvbj.mongodb.net?retryWrites=true&w=majority';
        
        //define a variable to store the name of the db we will be 
        //connecting to
        const dbName = 'globomantics';
        
        //CONNECT TO THE DB AND RETURN ALL THE RECORDS/DOCUMENTS IN THE 
        //SESSIONS COLLECTION: do this by creating an IIFE function that
        //will self execute every time the sessions route is requested
        //in our browser
        (async function mongo() {
            //define a variable that will hold our client connections to the 
            //MongoDB System
            let client;

            try {
                //connect to our MongoDB System using our client
                client = await MongoClient.connect(url, { useUnifiedTopology: true });

                //debug our application to check for a successful connection
                debug('Connect to the mongo DB');

                //connect to our globomantics database
                const db = client.db(dbName);

                //query our db to return an array with all the records/documents 
                //within the sessions collections
                const sessions = await db.collection('sessions').find().toArray();

                //render the returned data to our /sessions route
                res.render('sessions', {sessions});

            } catch (error) {
                debug(error.stack);
            }
        })();
     });

sessionsRouter.route('/:id')
    .get((req,res) => {
        const id = req.params.id;
        const url = 'mongodb+srv://isnuwa:S9ti9S8iyLiXzgb@globomantics.7kvbj.mongodb.net?retryWrites=true&w=majority';
        const dbName = 'globomantics';

        //connect to the db and return session with the given id
        (async function mango() {
            //create a client to connect to mongodb management system
            let client;

            //connect to the Mongo db system
            try {
                client = await MongoClient.connect(url, { useUnifiedTopology: true });
                debug('Connected to the mongo DB');

                //connect to globomantics db
                const db = client.db(dbName);

                //query for session with the given id
                const session = await db.collection('sessions').findOne({_id: new ObjectID(id)});

                //get the first speaker that is associated with the given session
                const speaker = await speakerService.getSpeakerById(session.speakers[0].id);

                //add the speaker id data from the returned speaker promise to our session
                session.speaker = speaker.data;
                
                res.render('session', {session});
            } catch (error) {
                debug(error.stack);
            }
        })();
     });

module.exports = sessionsRouter;