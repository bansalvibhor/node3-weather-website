console.log('Client side javascript file is loaded!');

fetch('http://puzzle.mead.io/puzzle').then((response) => {
    response.json().then((data) => {
        console.log(data);
    });
});

fetch('http://localhost:3000/weather?address=India').then((response)=>{
    response.json().then((data)=>{
        console.log(data);
    });
});

const search_input = document.querySelector('#input_search');
const message1 = document.querySelector('#message1');
const message2 = document.querySelector('#message2');

document.querySelector("form").addEventListener('submit', (e) => {
    e.preventDefault();//prevent refresh the browser
    let value = search_input.value;
    let url = `http://localhost:3000/weather?address=${ encodeURIComponent(value)}`;
    fetch(url).then((response) => {
        response.json().then((data) => {
            console.log(data);
            if(data.error){
                message1.textContent = data.error;
            }
            else{
                message1.textContent = 'Location: ' + data.Location + 'Forecast: ' + data.forecast;
            }
        });
    });
});