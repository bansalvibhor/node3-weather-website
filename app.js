const express = require('express');
const request = require('request');
const path = require('path');
const hbs = require('hbs');
const geoCode = require('./utils/geocode');
const forecast = require('./utils/forecast').forecast;

const app = express();

let options = {
    url : 'https://api.darksky.net/forecast/2e497a4788dbf94715f2fa662c0f100e/37.8267,-122.4233?units=us&lang=en',
    json: true
}

let strDirPath = path.join(__dirname, '/public');
console.log(strDirPath);

let viewsPath = path.join(__dirname, './templates/views');
console.log(viewsPath);

let partialsPath = path.join(__dirname, './templates/partials');
console.log(partialsPath);

//set up handlebar engine and views location
app.set('views', viewsPath);
app.set('view engine', 'hbs');

hbs.registerPartials(partialsPath);

//setup static directory to serve
app.use(express.static(strDirPath));


app.get('', (req, res)=>{
    res.render('index', {
        title: 'Weather App', 
        name: 'Andrew Mead',
        footer_text: 'ABCD'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Page', 
        name: 'Andrew Mead',
        footer_text: 'DEFG'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page', 
        message: 'This is my help page',
        footer_text: 'PQRS'
    });
});

// app.get('', (req, res)=>{
//     res.send('<html><h1>Hello Express</h1></html>');
// });

// app.get('/help', (req, res) => {
//     res.send([{
//         name: 'Andrew',
//         age: 21
//     },
//     {
//         name: 'Sarah',
//         age:23
//     }
//     ]);
// });

// app.get('/about', (req, res) => {
//     res.send('<html><head><title>About Page</title></head><h1 style="color:green">About Page</h1></html>');
// });

app.get('/weather', (req, res)=>{
    if(!req.query.address){
        res.send({
            error: 'donot contain address'
        });
        return;
    }
    /*let options = {
        url: req.query.address,
        json:true
    }

    request(options, (error, response, body)=>{
        const data = body;
        res.send({
            weather: data.daily.data[0].summary,
            address: req.query.address,
        });
    })*/
    let address = req.query.address;
    geoCode(address, (error, response) => {
        if (error) {
            res.send({
                error: 'Unable to connect to network'
            });
            return;
        }

        let data = response.body;

        if(data.hasOwnProperty("message")){
            res.send({
                error : 'Unable to Get Data'
            });
            return;
        }
        else{
            let longitude = data.features[0].center[0];
            let latitude = data.features[0].center[1]; 
           // console.log(`Latitude: ${data.features[0].center[1]}`);
           forecast(longitude, latitude, (error, forecastResponse)=>{
                if(error){
                    res.send({
                        error: 'Unable to Connect to network'
                    });
                    return;
                }

                let forecastData = forecastResponse.body;
                
                if(forecastData.hasOwnProperty('error')){
                    res.send({
                        error : 'Unable to Get Forecast Data'
                    });
                }
                else{
                    res.send({
                        Location: address,
                        forecast: `${forecastData.daily.data[0].summary} It is currently ${forecastData.currently.temperature} degrees out. There is a ${forecastData.currently.precipIntensity}% chance of rain.`
                    });
                    
        
                }
           });  
        }
    });
});

app.get('/weather', (req, res) => {

    request(options, (error, response, body) => {
        const data = body;
        res.send({
            summary: data.daily.data[0].summary,
            temperature: data.currently.temperature,
            precipIntensity: data.currently.precipIntensity
        });
    });   
});

app.get('/products', (req, res)=>{
    if(!req.query.hasOwnProperty('search')){
        res.send({
            error: 'You must provide a search term'
        });
        return;
    }
    console.log(req.query.search);
    res.send({
        products: []
    });
});

app.get('/help/*', (req,res)=>{
    //res.send('Help article not found');
    res.render('404', {
        title: '404 Error',
        footer_test: 'Created By Adrew Mead',
        message: 'Help Article Not Found'
    });
});

app.get('*', (req, res)=>{
    //res.send('404 Error');
    res.render('404', {
        title: '404 Error',
        footer_test: 'Created By Adrew Mead',
        message: 'Page Not Found'
    });
});

app.listen(3000, ()=>{
    console.log('Server is up on port 3000');
});