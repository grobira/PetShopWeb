const dbname = "dbpetshop";

//Users
const usersData = [
	{iduser: "000001", name: "Pedro Cardoso Stefanelli", login: "admin", password: "admin", phone: "(11)91111-4444", email: "kentucky@gmail.com", photo: "", type: "0"}, 
	{iduser: "000002", name: "Rafael Silva", login: "elidio", password: "elidio", address: "R. Jacinto 1234 São Carlos - SP", phone: "(35)98765-1234", email: "elidio@gmail.com", photo: "", type: "1"} 
];

//Pets
const petsData = [
    {idpet: "100000", name: "Mell", breed: "Poodle", age: 3, photo: "", iduser: "000002"},
    {idpet: "100001", name: "Bob", breed: "Rottweiler", age: 2, photo: "", iduser: "000002"}
];

//Servs
const servicesData = [
    {idserv: "200000", name: "Vacinação", description: "Vacina para pulgas", price: 11.00,  photo: ""},
    {idserv: "200001", name: "Banho e Tosa", description: "Banho e tosa completo", price: 12.00, photo: ""}
];

//Products
const productsData = [
    {idprod: "300000", name: "Ração Golden Adulto Special - 15kg", description: "Ração deliciosa cheia de nutrientes para o seu cão.", price: 104.90, stock: 10,  photo: ""},
    {idprod: "300001", name: "Ração Royal Canin Club Performance Adulto", description: "Nutritiva e macia.", price: 37.99, stock: 5, photo: ""},
    {idprod: "300002", name: "Alimento Úmido Pedigree Sachê Adulto Raças Pequenas Cordeiro ao Molho - 100g", description: "Feito com deliciosos pedaços de carne cozidos a vapor!", price: 1.99, stock: 12, photo: ""},
	{idprod: "300003", name: "Shampoo Antipulgas Sanol - 500ml", description: "Esse funciona!", price: 12.50, stock: 20, photo: ""},
	{idprod: "300004", name: "Cama Azul Jully Bichinho Chic", description: "A mais confortavel!", price: 88.00, stock: 3, photo: ""},
	{idprod: "300005", name: "Gaiola 2 Andares Chinchila", description: "A nova geração de processadores da AMD Bulldozer já chegou!", price: 266.00, stock: 3, photo: ""}
];

//Sales
const salesData = [
	{ idsale: "400000", iduser: 7, items: "[['300000', 'Ração Golden Adulto Special - 15kg', '104.90', '1']]", servs: "[['200001', 'Banho e Tosa', '12.00', '500000']]", total: 139.90 }
];

//Scheduling
const schedulingData = [
    { idsche: "500000", iduser: "000002", idpet: 8931, idService: 1, total: 11.00, totalPortions: 1, dateAppointment: new Date(2017, 6, 3, 8)}
];

let db;

// -----------------------------------------------------------------------------------------------------------------------------------------------
// Inicializando IndexedDB

if("indexedDB" in window) {
    console.log("IndexedDB is supported!!");
	let openRequest = indexedDB.open(dbname,1);

	openRequest.onupgradeneeded = e => {
		console.log("Upgrading...");
		db = e.target.result;

		//Upgrading users
        let objectStore = db.createObjectStore("users", {keyPath: "iduser"});
		objectStore.createIndex("login", "login", { unique: true });
        for (let i in usersData) {
           objectStore.add(usersData[i]);
        }
		//Upgrading pets
        objectStore = db.createObjectStore("pets", {keyPath: "idpet"});
        for (i in petsData) {
           objectStore.add(petsData[i]);
        }
		//Upgrading services
        objectStore = db.createObjectStore("servs", {keyPath: "idserv"});
        for (i in servicesData) {
           objectStore.add(servicesData[i]);
        }
		//Upgrading products
        objectStore = db.createObjectStore("products", {keyPath: "idprod"});
        for (i in productsData) {
           objectStore.add(productsData[i]);
        }
		//Upgrading sales
        objectStore = db.createObjectStore("sales", {keyPath: "idsale"});
        for (i in salesData) {
           objectStore.add(salesData[i]);
        }
		//Upgrading scheduling
        objectStore = db.createObjectStore("scheduling", {keyPath: "idsche"});
        for (i in schedulingData) {
           objectStore.add(schedulingData[i]);
        }		
	}
	openRequest.onsuccess = e => {
		db = openRequest.result;
    	console.log("success: "+ db);
	}
	openRequest.onerror = e => {
		console.log("Error");
		console.dir(e);
	}
} else {
    window.alert("PetShop requires IndexedDB and it isn't available in your browser :( ");
}

//-------------------------------------------------------------------------------------------------------------------------------------------------
//Manutenção IndexedDB
function add(table) {
   var request = db.transaction(["employee"], "readwrite")
   .objectStore("employee")
   .add({ id: "01", name: "prasad", age: 24, email: "prasad@tutorialspoint.com" });
   
   request.onsuccess = e => {
      alert("This "+table+" has been added to your database.");
   };
   
   request.onerror  = e => {
      alert("Unable to add data\r\nThis "+table+" is already exist in your database! ");
   }
}

function readAll(table,callback) {   
    let req = db.transaction(table).objectStore(table).openCursor();
	let list = [];

    req.onsuccess = e => {
        let cursor = e.target.result;
        if (cursor) {
            list.push(cursor.value);
            cursor.continue();
        }
    };
    
    req.transaction.oncomplete = e => callback(list);
}

function read(table,id,callback) {
   var transaction = db.transaction(table);
   var objectStore = transaction.objectStore(table);
   var request = objectStore.get(id);
   
   request.onerror = e => {
      alert("Unable to retrieve daa from database!");
   };
   
   request.onsuccess = e => {      
		if(e.target.result) {
			alert(e.target.result);
			callback(e.target.result);
		}
      else {
         alert("'"+id+"' couldn't be found in your database!");  
      }
   };
}

function remove() {
   var request = db.transaction(["employee"], "readwrite")
   .objectStore("employee")
   .delete("02");
   
   request.onsuccess = function(event) {
      alert("prasad entry has been removed from your database.");
   };
}



//-------------------------------------------------------------------------------------------------------------------------------------------------
//Outras funções
function login(){
	readAll("users", function(resp) {  
		for (let i in resp) {
			if ((resp[i].login == $("#uname").val()) && (resp[i].password == $("#psw").val())) {
				if(resp[i].type == "0")
					window.location.href="indexadmin.html"; 
				else
					window.location.href="indexclient.html";	
			}		
		}
	});
}

$(document).ready(() => {
	if ($("#form_cadClient").is(':visible')){
		readAll("users", function(resp) {  
			for (let i in resp) {
				if(resp[i].type == "0"){ //Se é adm, removo
					resp.splice(i,1);				
				}
			}
			alert(resp.toString());	
			//carrego os campos
	});
	}
	if ($("#form_cadAdmin").is(':visible')){
		alert("oi");
	}
});

