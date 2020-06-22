let current_page = 1;
let records_per_page = 20;

function prevPage() {
    if (current_page > 1) {
        current_page--;
        changePage(current_page);
    }
}
function nextPage() {
    if (current_page < numPages()) {
        current_page++;
        changePage(current_page);
    }
}

function filterData() {
    
  let estado = document.getElementById('estado').value;
  let ciudad = document.getElementById('ciudad').value;
  let colonia = document.getElementById('colonia').value;
  
  let estadosToFilter = new Set;
  let ciudadesToFilter = new Set;
  let coloniasToFilter = new Set;

  let filterByState;
  let filterByCity;
  let filterByCol;
  
  for(let key in Object.values(gasData)) {
    for(let mkey in Object.values(gasData)[key]) {
        for(let lkey in Object.values(gasData)[key][mkey][1]) {
            if(lkey === "address" ) {
                if(Object.values(gasData)[key][mkey][1][lkey][4] === estado) {
                    estadosToFilter.add(Object.values(gasData)[key]._id);
                }
                if(Object.values(gasData)[key][mkey][1][lkey][3] === ciudad) {
                    ciudadesToFilter.add(Object.values(gasData)[key]._id); 
                }
                if(Object.values(gasData)[key][mkey][1][lkey][2] === colonia) {
                    coloniasToFilter.add(Object.values(gasData)[key]._id);
                }
            }
        }
    }
 }
    filterByState = Object.values(gasData).filter(e => estadosToFilter.has(e._id));
    filterByCity = Object.values(filterByState).filter(e => ciudadesToFilter.has(e._id));
    filterByCol = Object.values(filterByCity).filter(e => coloniasToFilter.has(e._id));

    let result = [filterByState, filterByCity, filterByCol]
    let index =  Math.max(...result.map((e, i) => e.length ? i : 0));
   
    estado.innerHTML = "";
    ciudad.innerHTML = "";
    colonia.innerHTML = "";

   return result[index];
}
function nearMe() {
    let myAddress = document.getElementById('myLocation');
    myAddress.innerHTML = `${mylocation[0]}, ${mylocation[1]}, ${mylocation[2]}`;
    document.getElementById('estado').value = mylocation[2];
    document.getElementById('ciudad').value = mylocation[1];
    document.getElementById('colonia').value = mylocation[0];
    filterData();
    changePage(1)
   
}
function clearTitle() {
    document.getElementById('estado').value = "";
    document.getElementById('ciudad').value = "";
    document.getElementById('colonia').value = "";
    document.getElementById('myLocation').innerHTML = "";
    filterData();
}

function changePage(page) {
    let btn_next = document.getElementById("btn_next");
    let btn_prev = document.getElementById("btn_prev");
    let listing_table = document.getElementById("listingTable");
    let page_span = document.getElementById("page");
    let data = filterData().length > 0 ? filterData() : gasData.flat();

    
     listing_table.innerHTML = `
     <tr>
        <th>Nombre</th>
        <th>Direccion</th>
        <th>Regular</th>
        <th>Premium</th>
        <th>Diesel</th>
        </tr>
     `;

     for (let i = (page-1) * records_per_page; i < (page * records_per_page); i++) {
        let e = data[i];
        let address = Object.values(e)[0][1].address;
        let name = Object.values(e)[0][1].name;
        let price = Object.values(e)[0][1].gasInfo;
        let regular = "",
            premium = "",
            diesel = "";
        for(const key in price) {
            if(key === "regular") {
                regular = price[key];
            }
            if(key === "premium") {
                premium = price[key];
            }
            if(key === "diesel") {
                diesel = price[key];
            }
        }
         listing_table.innerHTML  +=  `
         <tr>
             <td>${name}</td>
             <td>${address}</td>
             <td>${regular}</td>
             <td>${premium}</td>
             <td>${diesel}</td>
         </tr>
 `;
     }
     page_span.innerHTML = page;
 
     if (page == 1) {
         btn_prev.style.visibility = "hidden";
     } else {
         btn_prev.style.visibility = "visible";
     }
 
     if (page == numPages()) {
         btn_next.style.visibility = "hidden";
     } else {
         btn_next.style.visibility = "visible";
        }
    
    }

    
    function numPages() {
        return Math.ceil(gasData.length / records_per_page);
    }