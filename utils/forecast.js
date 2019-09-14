
const request = require('request');

const forecast = (longitude, latitude, callback) =>{
    
    let option = {
        url: 'https://api.darksky.net/forecast/2e497a4788dbf94715f2fa662c0f100e/' +  latitude + ',' + longitude + '?units=us&lang=en',
        json:true
    }

    request(option, (error, response) => {
        callback(error, response);
    });
}

module.exports.forecast = forecast;

