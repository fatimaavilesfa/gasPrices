function topFive(value) {
    value = value.split(",");
    let order;
    let top5 = document.getElementById("top5R");
    let completeList = "completeList";
    let length = 5;
    let data = gasData.flat();



    document.getElementById("estadoOutput").innerHTML = "";
    top5.innerHTML = `
    <tr>
       <th>Razon Social</th>
       <th>C.P</th>
       <th>${value[1]}</th>
   </tr>
    `;
    //to display top five  gas stations for regular gasoline
    if(value[1] == "regular") {
        //cheapest
        if(value[0] == "barato") {
            order = data.sort(function (a, b) {
                return a.regular - b.regular;
            });
        }
        //most expensive
        if(value[0] == "caro") {
            order = data.sort(function (a, b) {
                return  b.regular - a.regular;
            });
        }
       
        for (let i = 0; i < length; i++) {
            let e = order[i];
            if(e.regular === "" || e.regular === "0") {
                length++;
            } else {
                top5.innerHTML  +=  `
             <tr>
                 <td>${e.razonsocial}</td>
                 <td>${e.codigopostal}</td>
                 <td>${e.regular}</td>
             </tr>`;
            } 
        }
    
        changePage(0);
    };
    //to display top five  gas stations for premium gasoline
    if(value[1] == "premium") {
        //cheapest
        if(value[0] == "barato") {
            order = data.sort(function (a, b) {
                return a.premium - b.premium;
            });
        }
        //most expensive
       if(value[0] == "caro") {
            order = data.sort(function (a, b) {
                return  b.premium - a.premium;
            });
       }
        for (let i = 0; i < length; i++) {
            let e = order[i];
            
            if(e.premium === "" || e.premium === "0") {
                length++;
            } else {
                top5.innerHTML  +=  `
             <tr>
                 <td>${e.razonsocial}</td>
                 <td>${e.codigopostal}</td>
                 <td>${e.premium}</td>
             </tr>`;
            } 
        }
    
        changePage(0);
    };
    //to display complete list
    if(value == completeList) {
        top5.innerHTML = "";
        changePage(1);
    }
};