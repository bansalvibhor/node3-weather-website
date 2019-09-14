
const request = require('request');

let option_requset = {
    json: true
}

const geoCode = (address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/ ' + encodeURIComponent(address) + '.json?access_token=pk.eyJ1IjoidmliaG9yMTIzIiwiYSI6ImNqenA4N2VseDA5azIzY21zbTZ3cDBuNW8ifQ.3WCLvzNeqPp2HM_MiBMhpg';

        request({
            url: url,
            json: true
        }, (error, response) => {
            callback(error, response);
        });
}

module.exports = geoCode;