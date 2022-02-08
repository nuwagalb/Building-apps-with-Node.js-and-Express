const express = require('express');
const debug = require('debug')('app:authRouter');
const { MongoClient, ObjectID } = require('mongodb');
const passport = require('passport');

const authRouter = express.Router();

authRouter.route('/signUp').post((req, res) => {
    //creating a user
    //get the username and password from the request body
    const { username, password } = req.body;
    const url = 'mongodb+srv://isnuwa:S9ti9S8iyLiXzgb@globomantics.7kvbj.mongodb.net?retryWrites=true&w=majority';
    const dbName = 'globomantics';

    //connect to our db to add the user
    (async function addUser() {
        let client;
        try {
            client = await MongoClient.connect(url, { useUnifiedTopology: true });
            const db = client.db(dbName);
            const user = {username, password};
            const results = await db.collection('users').insertOne(user);
            debug(results);

            //login our user after they have been created
            //passport places our user returned from the local strategy onto
            //our request
            //login our user and redirect them to the profiles route
            req.login(results.ops[0], () => {
                res.redirect('/auth/profile');
            });
            client.close();
        } catch (error) {
            debug(error.stack);
        }
    })(); 
});

authRouter
    .route('/signIn')
    .get((req, res) => {
        res.render('signin');
    })
    .post(
        //use passport to authenticate our user
        passport.authenticate('local', 
            {
                successRedirect: '/auth/profile',
                failureRedirect: '/'
            }
        )
    );

//return the following response on the /profile route
authRouter.route('/profile').get((req, res) => {
    res.json(req.user);
});

module.exports = authRouter;