const express = require('express');
const app = express();
const port = 3000;
//database sub set of MongoDB
const DataStore = require('nedb');
//require fetch to be able to make api calls 
const fetch = require('node-fetch');
// fs, parser and he are used to parse xml data to json from express
const fs = require('fs');
const parser = require('fast-xml-parser');
const he = require('he');

//creating file to store the data
const database = new DataStore('database.db');
database.loadDatabase(e=>console.log(e));



//this are to get the files available in my local server
let fileLocationContent = fs.readFileSync('./places.xml', {encoding:'utf8', flag:'r'});
let filePriceContent = fs.readFileSync('./prices.xml', {encoding:'utf8', flag:'r'});

//options to parse the xml file to json here I change ignoreAttributes to false to get place_id
let options = {
    attributeNamePrefix : "@_",
    attrNodeName: "attr", //default is 'false'
    textNodeName : "#text",
    ignoreAttributes : false,
    ignoreNameSpace : false,
    allowBooleanAttributes : false,
    parseNodeValue : true,
    parseAttributeValue : true,
    trimValues: true,
    cdataTagName: "__cdata", //default is 'false'
    cdataPositionChar: "\\c",
    localeRange: "", //To support non english character in tag/attribute values.
    parseTrueNumberOnly: false,
    attrValueProcessor: a => he.decode(a, {isAttributeValue: true}),//default is a=>a
    tagValueProcessor : a => he.decode(a) //default is a=>a
};


//to get the location data from the xml file and use it to make the google api call to get the address
let locationData = {};
async function getAddresses() {
    if(parser.validate(fileLocationContent)) { 
        let  jsonObj = parser.parse(fileLocationContent,options);
        
        for (let i = 0; i < jsonObj.places.place.length; i++) {
            let e = jsonObj.places.place[i];
            locationData[Object.values(e.attr)] = {
                address: "",
                name: "",
                gasInfo: []
            }
            var rawAddress = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${e.location.y+","+e.location.x}&location_type=ROOFTOP&key=AIzaSyAFAk-2AVZIMAchSRQf_g1kzi8coR6Vq0w`);
            var addresses = await rawAddress.json();
            try {
                locationData[Object.values(e.attr)].address = addresses.results[0].address_components.map(e => Object.values(e)[0]);
                locationData[Object.values(e.attr)].name = jsonObj.places.place[i].name;
              }
              catch(error) {
                 //console.error(error);
                 console.log("Cordinates not found", i);
              }
        }   
    }
    return locationData;
}
//parse the xml file with price info to json and store it in a global obj
let pricesData = {};
function getPrices() {
    if(parser.validate(filePriceContent)) {
        let jsonObj = parser.parse(filePriceContent, options);
        for(let i = 0; i < jsonObj.places.place.length; i++) {
            pricesData[Object.values(jsonObj.places.place[i].attr)] = [];
            if(jsonObj.places.place[i].gas_price.length) {
                for(let j = 0; j < jsonObj.places.place[i].gas_price.length; j++) {
                    let type = Object.values(Object.values(jsonObj.places.place[i].gas_price[j])[1])[0];
                    pricesData[Object.values(jsonObj.places.place[i].attr)][type] = Object.values(jsonObj.places.place[i].gas_price[j])[0];
                }
            } else {
                let type = Object.values(Object.values(jsonObj.places.place[i].gas_price)[1])[0];
                pricesData[Object.values(jsonObj.places.place[i].attr)][type] = Object.values(jsonObj.places.place[i].gas_price)[0];
            }
        }
    }
    return pricesData;
}



//here is where I conbine the price and location data to send to the client side 
async function completeData() {
    let data = await getAddresses();
    let obj = await getPrices();
    let objArray = Object.entries(obj);
    const finalData = Object.entries(data);

    for(let i = 0; i < finalData.length; i++) {
        for(let j = 0; j < objArray.length; j++ ) {
             if(finalData[i][0] === objArray[j][0] ) {
                let info = objArray[j][1];
                let unCopulated = {};

                Object.keys(info).forEach(key => {
                    unCopulated[key] = info[key]
                })
                finalData[i][1].gasInfo = unCopulated;
                //database.insert({gasInfo : finalData[i]});
                //console.log({gasInfo : finalData[i]});
            }
        }
    };
    return finalData;
};
//completeData();

app.use(express.static('public'));

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname +'/index.html');
});

//call to api to get users own addres using their own cordinates :)
app.get('/getMyAdress/:latlon', async (req, res) => {
    const latlong = req.params.latlon.split(",");
    const lat = latlong[0];
    const lon = latlong[1];
    const api_url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&location_type=ROOFTOP&key=`
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    res.json(json);
});

//conection to client to send the data with all the info ready 
app.get('/data', async ( req, res) => {
    database.find({}, (err, data) => {
       if(err) {
           res.end();
           console.log(err);
           return;
       }
        res.json(data);
    })
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
