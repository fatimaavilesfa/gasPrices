//function to read xml files 
// const getXMLFile =  (path, callback) => {
//     let request = new XMLHttpRequest();
//     request.open("GET", path);
//     request.setRequestHeader("Content-Type", "text/xml");
//     request.onreadystatechange =  () => {
//       if(request.readyState === 4 && request.status === 200) {
//          callback(request.responseXML);
//       }
//     };
//     request.send();
//   };
 

//how to work with xml data from front side
  //xml call to get the location 
  // getXMLFile("/places.xml", (xml) => {
    // let locationData = [];
    // let lentth = xml.getElementsByTagName("place").length;
    // for(let i = 0; i < lentth; i++) {
    //   locationData.push({
    //     "id" : xml.getElementsByTagName("place")[i].getAttribute("place_id"),
    //     "name" : xml.getElementsByTagName("name")[i].innerHTML,
    //     "latlng" : xml.getElementsByTagName("location")[i].lastElementChild.innerHTML+","+xml.getElementsByTagName("location")[i].firstElementChild.innerHTML
    //   })
    // };
  //   return locationData;
  // });

  //xml call to get the prices 
  //let prices = [];
  // window.onload  = getXMLFile("/prices.xml", function(xml) {
    // let lentth = xml.getElementsByTagName("place").length;
    // for(let i = 0; i < lentth; i++) {
    //       prices[i] = {
    //         "id" : xml.getElementsByTagName("place")[i].getAttribute("place_id"),
    //         "leng" : xml.getElementsByTagName("place")[i].children.length
    //       }
    //       if(prices[i].leng > 0) {
    //         for(let j = 0; j < prices[i].leng; j++) {
    //           let priceType = xml.getElementsByTagName("place")[i].children[j].getAttribute("type");
    //           prices[i][priceType] = xml.getElementsByTagName("place")[i].children[j].innerHTML;
    //         }
    //       }
    //     }
    // return prices;
  // });


let gasData;
let mylocation;
//function to get users own location
function getCurrentLocation() {
  if("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition( async function(position){
      let lat = position.coords.latitude;
      let long = position.coords.longitude;
      let api_url = `/getMyAdress/${lat},${long}`;
      const res_json = await fetch(api_url);
      const json = await res_json.json();
      const geolocation = json.results[0].address_components.map(e => Object.values(e)[0]);
            console.log(geolocation);
            mylocation = geolocation.slice(2, 5);
           
    });
  } else  {
      console.log("not available")
  }
};

//fucntion to get data from local server
async function getData() {
  const response = await fetch("./data");
  const data = await response.json();
  gasData = data.flat();

  let itemsToDelete = new Set();
  for(let key in Object.values(gasData)) {
      for(let mkey in Object.values(gasData)[key]) {
          for(let lkey in Object.values(gasData)[key][mkey][1]) {
              if(lkey === "address" || lkey === "name") {
                  if(Object.values(gasData)[key][mkey][1][lkey] === "") {
                      itemsToDelete.add(Object.values(gasData)[key]._id);
                  }
              }
          }
      }
  }
  gasData = Object.values(gasData).filter(e => !itemsToDelete.has(e._id ));
}

window.onload = getData();
window.onload = getCurrentLocation();
