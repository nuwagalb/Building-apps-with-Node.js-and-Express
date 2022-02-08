const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:localStrategy');

module.exports = function localStrategy() {
    passport.use(
        //use passport's local strategy to check if our
        //user is in the db
        new Strategy(
            {
                usernameField: 'username',
                passwordField: 'password'
            },
            (username, password, done) => {
                //perform all database related connections
                const url = 'mongodb+srv://isnuwa:S9ti9S8iyLiXzgb@globomantics.7kvbj.mongodb.net?retryWrites=true&w=majority';
                const dbName = 'globomantics';
                
                //define an IIFE to use for handling db operations
                (async function validateUser() {
                    let client;

                    try {
                        client = await MongoClient.connect(url, {useUnifiedTopology: true});
                        debug('Connect to db');
                        const db = client.db(dbName);
                        const user = await db.collection('users').findOne({username});

                        //if the query returns a user and the password's match
                        //then no error was raised and we return the user
                        if (user && user.password === password) {
                            done(null, user);
                        } else {
                            //no error was raised but we did not return the user
                            done(null, false);
                        }

                    } catch (error) {
                        //an error was encountered and no user was returned
                        done(error, false);
                    }
                })();

            }
        )
    )
}