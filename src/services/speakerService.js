const axios = require('axios'); //this helps us work with api's

function speakerService() {
    function getSpeakerById(id) {
        //we are performing an async operation in accessing some
        //external api so we use promises
        return new Promise((resolve,reject) => {
            //axios returns a promise of it's own
            axios.get('http://localhost:3000/speakers/' + id)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            })
        });
    }

    return {getSpeakerById};
}

module.exports = speakerService();