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

function changePage(page) {
    let btn_next = document.getElementById("btn_next");
    let btn_prev = document.getElementById("btn_prev");
    let listing_table = document.getElementById("listingTable");
    let page_span = document.getElementById("page");
    let data = gasData.flat();
    
     listing_table.innerHTML = `
     <tr>
        <th>Razon Social</th>
        <th>C.P</th>
        <th>Regular</th>
        <th>Premium</th>
    </tr>
     `;

     for (let i = (page-1) * records_per_page; i < (page * records_per_page); i++) {
        let e = data[i];
         listing_table.innerHTML  +=  `
         <tr>
             <td>${e.razonsocial}</td>
             <td>${e.codigopostal}</td>
             <td>${e.regular}</td>
             <td>${e.premium}</td>
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
        return Math.ceil(10000 / records_per_page);
    }