const dbname = "dbpetshop";

//Users
const usersData = [
	{iduser: "000001", name: "Pedro Cardoso Stefanelli", login: "admin", password: "admin", phone: "(11)91111-4444", email: "kentucky@gmail.com", photo: "", type: "0"}, 
	{iduser: "000002", name: "Rafael Silva", login: "elidio", password: "elidio", address: "R. Jacinto 1234 São Carlos - SP", phone: "(35)98765-1234", email: "elidio@gmail.com", photo: "", type: "1"}, 
	{iduser: "000003", name: "Julia", login: "julia", password: "julia", address: "R. Lele 1234 São Carlos - SP", phone: "(35)98765-1234", email: "julia@gmail.com", photo: "", type: "1"},
	{iduser: "000004", name: "Robira", login: "admin2", password: "admin2", phone: "(11)91111-4444", email: "vambira@gmail.com", photo: "", type: "0"} 
];

//Pets
const petsData = [
    {idpet: "100000", name: "Duzas", breed: "Vira-Lata", age: 3, sex: "M", img: "img/duzas.jpg", iduser: "000002"},
    {idpet: "100001", name: "Bob", breed: "Rottweiler", age: 2, sex: "M", img: "img/Pug.jpg", iduser: "000002"},
	{idpet: "100002", name: "Mell", breed: "Poodle", age: 3, sex: "F",img: "img/Golden-Retriever.jpg", iduser: "000002"}
];

//Servs
const servicesData = [
    {idserv: "200000", name: "Vacinação", description: "Vacina para pulgas", price: 11.00,  photo: "img/vacina.jpg"},
    {idserv: "200001", name: "Banho e Tosa", description: "Banho e tosa completo", price: 12.00, photo: "img/banho.jpg"}
];

//Products
const productsData = [
    {idprod: "300000", name: "Ração Golden Adulto Special - 15kg", description: "Ração deliciosa cheia de nutrientes para o seu cão.", price: 104.90, stock: 10, sells: 20, photo: "img/golden.jpg"},
    {idprod: "300001", name: "Ração Royal Canin Club Performance Adulto", description: "Nutritiva e macia.", price: 37.99, stock: 5, sells: 2, photo: "img/royal.jpg"},
    {idprod: "300002", name: "Alimento Úmido Pedigree Sachê Adulto Raças Pequenas Cordeiro ao Molho - 100g", description: "Feito com deliciosos pedaços de carne cozidos a vapor!", price: 1.99, stock: 12, sells: 2, photo: "img/sache.jpg"},
	{idprod: "300003", name: "Shampoo Antipulgas Sanol - 500ml", description: "Esse funciona!", price: 12.50, stock: 20, sells: 2, photo: "img/shampoo.jpg"},
	{idprod: "300004", name: "Cama Azul Jully Bichinho Chic", description: "A mais confortavel!", price: 88.00, stock: 3, sells: 2, photo: "img/cama.jpg"},
	{idprod: "300005", name: "Gaiola 2 Andares Chinchila", description: "A nova geração de processadores da AMD Bulldozer já chegou!", price: 266.00, stock: 3, sells: 2, photo: "img/gaiola.jpg"}
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
let useri;
var list = [];
let index = 1;

//===========================================================================================================================
// Inicializando IndexedDB
//===========================================================================================================================
function LoadDB(callback) {
	if("indexedDB" in window) {
		console.log("IndexedDB is supported!!");
		//indexedDB.deleteDatabase(dbname);
		let openRequest = indexedDB.open(dbname);

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
			objectStore.createIndex("idserv", "idserv", { unique: true });
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
			callback(db);
		}
		openRequest.onerror = e => {
			console.log("Error");
			console.dir(e);
		}
	} else {
		window.alert("PetShop requires IndexedDB and it isn't available in your browser :( ");
	}
}

//===========================================================================================================================
//Manutenção IndexedDB
//===========================================================================================================================
function add(table,field) {
	let request = db.transaction([table], "readwrite")
	.objectStore(table)
	.add(field);

   request.onsuccess = e => {
      alert("This "+table+" has been added to your database.");
   };
   
   request.onerror  = e => {
      alert("Unable to add data\r\nThis "+table+" is already exist in your database! ");
   }
}

function updating(table,data){
	let request = db.transaction([table], "readwrite").objectStore(table).put(data);
	request.onerror = () => {
 		alert("Erro updating ");
	};
	request.onsuccess = () => {
	 alert("Fields updated!");
	};
}

function readAll(table,callback) {   
    let req = db.transaction(table)
	.objectStore(table).openCursor();
	let auxList = [];

    req.onsuccess = e => {
        let cursor = e.target.result;
        if (cursor) {
            auxList.push(cursor.value);
            cursor.continue();
        }
    };
    
    req.transaction.oncomplete = e => callback(auxList);
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

function remove(table,id) {
	let request = db.transaction([table], "readwrite")
   .objectStore(table)
   .delete(id);
   
   request.onsuccess = () => {
      alert("This data has been removed from your database.");
   };
}

//===========================================================================================================================
//Funções de tela
//===========================================================================================================================
function login(){
	readAll("users", function(resp) { 
		let found=false;
		for (let i in resp) {
			if ((resp[i].login == $("#uname").val()) && (resp[i].password == $("#psw").val())) {
				found=true;
				useri = resp[i].iduser;
				if(resp[i].type == "0")
					window.location.href="indexadmin.html"; 
				else
					window.location.href="indexclient.html";	
			}		
		}
		if(!found) alert("Invalid login or password. Please try again.");	
	});
}

function loadClient(data){
	$("#add_pets").empty();
	//Carrego campos da pagina cadastro do cliente
	$("#tid").val(data.iduser);
	$("#tnome").val(data.name);
	$("#tendereco").val(data.address);
	$("#ttelefone").val(data.phone);
	$("#temail").val(data.email);	
	$("#tlogin").val(data.login);
	$("#tpass").val(data.password);

	$("#tid").prop("disabled", true);
	$("#tnome").prop("disabled", true);
	$("#tendereco").prop("disabled", true);
	$("#ttelefone").prop("disabled", true);
	$("#temail").prop("disabled", true);
	$("#tlogin").prop("disabled", true);
	$("#tpass").prop("disabled", true);

	$("#btn_back").prop("disabled", false);
	$("#btn_next").prop("disabled", false);
	$("#btn_edit").prop("disabled", false);
	$("#btn_del").prop("disabled", false);
	$("#btn_new").prop("disabled", false);
	$("#btn_cancel").prop("disabled", true);
	$("#btn_save").prop("disabled", true);
	
	//Mostra pets na tela
	readAll("pets", function(resp1){
		if (resp1 != null){
			$("#add_pets").append("<ul id=\"nav_pets\" class=\"nav nav-tabs\"> </ul>  <div id=\"tab_pets\" class=\"tab-content\"> </div>");

			let num_pets = 1;			
			for (let j in resp1) {
				str = "";
				if (resp1[j].iduser == data.iduser){ //Se for um pet desse usuario
					if (num_pets == 1){ //Se for o primeiro pet, vai estar ativado					
						$("#nav_pets").append("<li class=\"active\"> <a data-toggle=\"tab\" href=\"#pet"+num_pets+"\">Pet"+num_pets+"</a></li>");
						str = "<div id=\"pet"+num_pets+"\" class=\"tab-pane fade in active\">";
					}
					else{
						$("#nav_pets").append("<li> <a data-toggle=\"tab\" href=\"#pet"+num_pets+"\">Pet"+num_pets+"</a></li>");
						str = "<div id=\"pet"+num_pets+"\" class=\"tab-pane fade\">";						
					}
					str = str + "<div class=\"content\">"+
										"<div class=\"container1\">"+			
												"<p class=\"line\">ID:</p> <br>"+
												"<p class=\"line\">Nome:</p> <br>"+
												"<p class=\"line\">Raça:</p> <br>"+
												"<p class=\"line\">Idade:</p> <br>"+
											"</div>"+
											"<div class=\"container21\">"+
												"<input type=\"text\" name=\"tidpet"+num_pets+"\" value=\""+resp1[j].idpet+"\"><br>"+
												"<input type=\"text\" name=\"tnomepet"+num_pets+"\" value=\""+resp1[j].name+"\"><br>"+
												"<input type=\"text\" name=\"traca"+num_pets+"\" value=\""+resp1[j].breed+"\"><br>"+
												"<input type=\"number\" name=\"tidade"+num_pets+"\" value=\""+resp1[j].age+"\"><br>"+
											"</div>	"+
											"<div class=\"container22\">"+
												"<img src=\""+ resp1[j].img +"\" alt=\"Photo\">	"+		
											"</div><br>"+
									   "</div></div></div>";
					$("#tab_pets").append(str);
					num_pets = num_pets+1; 
				}//if	
			}//for
		}//if
	});
}

function loadAdmin(data){
	//Carrego campos da pagina cadastro do admin
	$("#tid").val(data.iduser);
	$("#tnome").val(data.name);
	$("#ttelefone").val(data.phone);
	$("#temail").val(data.email);	
	$("#tlogin").val(data.login);	
	$("#tpass").val(data.password);	

	$("#tid").prop("disabled", true);
	$("#tnome").prop("disabled", true);
	$("#ttelefone").prop("disabled", true);
	$("#temail").prop("disabled", true);
	$("#tlogin").prop("disabled", true);
	$("#tpass").prop("disabled", true);

	$("#btn_back").prop("disabled", false);
	$("#btn_next").prop("disabled", false);
	$("#btn_edit").prop("disabled", false);
	$("#btn_del").prop("disabled", false);
	$("#btn_new").prop("disabled", false);
	$("#btn_cancel").prop("disabled", true);
	$("#btn_save").prop("disabled", true);
}

function loadServs(data){
	$("#tid").val(data.idserv);
	$("#tnome").val(data.name);
	$("#tdescricao").val(data.description);
	$("#tpreco").val(data.price);
	$("#tphoto").html("<img src="+data.photo +">");

	$("#tid").prop("disabled", true);
	$("#tnome").prop("disabled", true);
	$("#tdescricao").prop("disabled", true);
	$("#tpreco").prop("disabled", true);

	$("#btn_back").prop("disabled", false);
	$("#btn_next").prop("disabled", false);
	$("#btn_edit").prop("disabled", false);
	$("#btn_del").prop("disabled", false);
	$("#btn_new").prop("disabled", false);
	$("#btn_cancel").prop("disabled", true);
	$("#btn_save").prop("disabled", true);
}

function loadServsCB(data){
	alert("ta aqui");
	for(let i in data){
		$("#cbServicos").append("<li role=\"presentation\"><a role=\"menuitem\" tabindex=\"-1\" href=\"#\">" + data[i].name+"</a></li>");
	}
}

function loadProducts(data){
	$("#tid").val(data.idprod);
	$("#tnome").val(data.name);
	$("#tdescricao").val(data.description);
	$("#tpreco").val(data.price);	
	$("#tqtde").val(data.stock);
	$("#tqtdv").val(data.sells);
	$("#tphoto").html("<img src="+data.photo +">");


	$("#tid").prop("disabled", true);
	$("#tnome").prop("disabled", true);
	$("#tdescricao").prop("disabled", true);
	$("#tpreco").prop("disabled", true);
	$("#tqtde").prop("disabled", true);
	$("#tqtdv").prop("disabled", true);

	$("#btn_back").prop("disabled", false);
	$("#btn_next").prop("disabled", false);
	$("#btn_edit").prop("disabled", false);
	$("#btn_del").prop("disabled", false);
	$("#btn_new").prop("disabled", false);
	$("#btn_cancel").prop("disabled", true);
	$("#btn_save").prop("disabled", true);
}

function loadProductsStore(data, n){
	$("#prod1").html("");
	$("#prod1").append("<img src="+data[n].photo +">");
	$("#prod1").append("<h1>"+ data[n].name +"</h1>");
	$("#prod1").append("<p>"+ data[n].description +"</p>");
	$("#prod1").append("<h2>R$: "+ data[n].price +"</h2>");
	$("#prod1").append("<p>Qtd:<input type=\"number\" name=\"tqtde\" value=\"0\" width=\"20px\"></p>");
	$("#prod1").append("<button type=\"button\" class=\"btn btn-success\" style=\"position: absolute;right: 0; bottom: 0;\">Comprar</button>");
	n++;
	$("#prod2").html("");
	$("#prod2").append("<img src="+ data[n].photo +">");
	$("#prod2").append("<h1>"+ data[n].name +"</h1>");
	$("#prod2").append("<p>"+ data[n].description +"</p>");
	$("#prod2").append("<h2>R$: "+ data[n].price +"</h2>");
	$("#prod2").append("<p>Qtd:<input type=\"number\" name=\"tqtde\" value=\"0\" width=\"20px\"></p>");
	$("#prod2").append("<button type=\"button\" class=\"btn btn-success\" style=\"position: absolute;right: 0; bottom: 0;\">Comprar</button>");
	n++;
	$("#prod3").html("");
	$("#prod3").append("<img src="+ data[n].photo +">");
	$("#prod3").append("<h1>"+ data[n].name +"</h1>");
	$("#prod3").append("<p>"+ data[n].description +"</p>");
	$("#prod3").append("<h2>R$: "+ data[n].price +"</h2>");
	$("#prod3").append("<p>Qtd:<input type=\"number\" name=\"tqtde\" value=\"0\" width=\"20px\"></p>");
	$("#prod3").append("<button type=\"button\" class=\"btn btn-success\" style=\"position: absolute;right: 0; bottom: 0;\">Comprar</button>");
	n++;
	$("#prod4").html("");
	$("#prod4").append("<img src="+ data[n].photo +">");
	$("#prod4").append("<h1>"+ data[n].name +"</h1>");
	$("#prod4").append("<p>"+ data[n].description +"</p>");
	$("#prod4").append("<h2>R$: "+ data[n].price +"</h2>");
	$("#prod4").append("<p>Qtd:<input type=\"number\" name=\"tqtde\" value=\"0\" width=\"20px\"></p>");
	$("#prod4").append("<button type=\"button\" class=\"btn btn-success\" style=\"position: absolute;right: 0; bottom: 0;\">Comprar</button>");
	n++;
	$("#prod5").html("");
	$("#prod5").append("<img src="+ data[n].photo +">");
	$("#prod5").append("<h1>"+ data[n].name +"</h1>");
	$("#prod5").append("<p>"+ data[n].description +"</p>");
	$("#prod5").append("<h2>R$: "+ data[n].price +"</h2>");
	$("#prod5").append("<p>Qtd:<input type=\"number\" name=\"tqtde\" value=\"0\" width=\"20px\"></p>");
	$("#prod5").append("<button type=\"button\" class=\"btn btn-success\" style=\"position: absolute;right: 0; bottom: 0;\">Comprar</button>");
	n++;
	$("#prod6").html("");
	$("#prod6").append("<img src="+ data[n].photo +">");
	$("#prod6").append("<h1>"+ data[n].name +"</h1>");
	$("#prod6").append("<p>"+ data[n].description +"</p>");
	$("#prod6").append("<h2>R$: "+ data[n].price +"</h2>");
	$("#prod6").append("<p>Qtd:<input type=\"number\" name=\"tqtde\" value=\"0\" width=\"20px\"></p>");
	$("#prod6").append("<button type=\"button\" class=\"btn btn-success\" style=\"position: absolute;right: 0; bottom: 0;\">Comprar</button>");
}

function loadPetsUser(data){
		if (data != null){
			$("#add_pets").append("<ul id=\"nav_pets\" class=\"nav nav-tabs\"> </ul>  <div id=\"tab_pets\" class=\"tab-content\"> </div>");

			let num_pets = 1;			
			for (let j in data) {
				str = "";
				if (000002 == data[j].iduser){ //Se for um pet desse usuario
					if (num_pets == 1){ //Se for o primeiro pet, vai estar ativado					
						$("#nav_pets").append("<li class=\"active\"> <a data-toggle=\"tab\" href=\"#pet"+num_pets+"\">Pet"+num_pets+"</a></li>");
						str = "<div id=\"pet"+num_pets+"\" class=\"tab-pane fade in active\">";
					}
					else{
						$("#nav_pets").append("<li> <a data-toggle=\"tab\" href=\"#pet"+num_pets+"\">Pet"+num_pets+"</a></li>");
						str = "<div id=\"pet"+num_pets+"\" class=\"tab-pane fade\">";						
					}
					str = str + "<div class=\"content\">"+
										"<div class=\"container1\">"+			
												"<p class=\"line\">ID:</p> <br>"+
												"<p class=\"line\">Nome:</p> <br>"+
												"<p class=\"line\">Raça:</p> <br>"+
												"<p class=\"line\">Idade:</p> <br>"+
											"</div>"+
											"<div class=\"container21\">"+
												"<input type=\"text\" name=\"tidpet"+num_pets+"\" value=\""+data[j].idpet+"\"><br>"+
												"<input type=\"text\" name=\"tnomepet"+num_pets+"\" value=\""+data[j].name+"\"><br>"+
												"<input type=\"text\" name=\"traca"+num_pets+"\" value=\""+data[j].breed+"\"><br>"+
												"<input type=\"number\" name=\"tidade"+num_pets+"\" value=\""+data[j].age+"\"><br>"+
											"</div>	"+
											"<div class=\"container22\">"+
												"<img src=\""+ data[j].img+"\" alt=\"Photo\">	"+		
											"</div><br>"+
									   "</div></div></div>";
					$("#tab_pets").append(str);
					num_pets = num_pets+1; 
				}//if	
			}//for
		}//if
}

//===========================================================================================================================
// Funções botão gerenciamento (novo,edit,salvar,etc...)
//===========================================================================================================================
$(document).on("click", "#btn_back", ()=>{
	if ($("#form_cadClient").is(':visible')){
		let i=index;		
		do { //Enquanto não for cliente
			i = i-1;
			if (i<0) i=list.length-1;
		} while(list[i].type != "1");
		index=i;
		loadClient(list[i]);		
	}
	if ($("#form_cadAdmin").is(':visible')){
		let i=index;			
		do { //Enquanto não for adm
			i = i-1;
			if (i<0) i=list.length-1;
		} while(list[i].type != "0");
		index=i;
		loadAdmin(list[i]);
	}	
	if ($("#form_CadServicos").is(':visible')){
		index = index -1;
		if (index < 0) index = list.length-1;
		loadServs(list[index]);
	}
	if ($("#form_CadProdutos").is(':visible')){
		index = index -1;
		if (index < 0) index = list.length-1;
		loadProducts(list[index]);
	}
});

$(document).on("click", "#btn_prod_next", ()=>{
	let i=index;
	if(index < 0)
		index=list.length-1;
	loadProductsStore(list, index+1);
});

$(document).on("click", "#btn_prod_back", ()=>{
	let i=index;
	if(index < 0)
		index=list.length-1;
	loadProductsStore(list, index-1);
});



$(document).on("click", "#btn_next", ()=>{
	if ($("#form_cadClient").is(':visible')){
		let i=index;				
		do { //Enquanto não for cliente
			i = i+1;
			if(i>list.length-1) i=0;
		} while(list[i].type != "1");
		index=i;
		loadClient(list[i]);	
	}
	if ($("#form_cadAdmin").is(':visible')){
		let i=index;			
		do { //Enquanto não for adm
			i = i+1;
			if(i>list.length-1) i=0;
		} while(list[i].type != "0");
		index=i;
		loadAdmin(list[i]);
	}
	if ($("#form_CadServicos").is(':visible')){
		index = index +1;
		if (index >= list.length) index = 0;
		loadServs(list[index]);
	}
	if ($("#form_CadProdutos").is(':visible')){
		index = index +1;
		if (index >= list.length) index = 0;
		loadProducts(list[index]);
	}
});
$(document).on("click", "#btn_edit", ()=>{
	if ($("#form_cadClient").is(':visible')){
		$("#tid").prop("disabled", true);
		$("#tnome").prop("disabled", false);
		$("#tendereco").prop("disabled", false);
		$("#ttelefone").prop("disabled", false);
		$("#temail").prop("disabled", false);
		$("#tlogin").prop("disabled", false);
		$("#tpass").prop("disabled", false);
	}
	if ($("#form_cadAdmin").is(':visible')){
		$("#tid").prop("disabled", true);
		$("#tnome").prop("disabled", false);
		$("#ttelefone").prop("disabled", false);
		$("#temail").prop("disabled", false);
		$("#tlogin").prop("disabled", false);
		$("#tpass").prop("disabled", false);
	}
	if ($("#form_CadServicos").is(':visible')){
		$("#tid").prop("disabled", true);
		$("#tnome").prop("disabled", false);
		$("#tdescricao").prop("disabled", false);
		$("#tpreco").prop("disabled", false);
	}
	if ($("#form_CadProdutos").is(':visible')){
		$("#tid").prop("disabled", true);
		$("#tnome").prop("disabled", false);
		$("#tdescricao").prop("disabled", false);
		$("#tpreco").prop("disabled", false);
		$("#tqtde").prop("disabled", false);
		$("#tqtdv").prop("disabled", false);
	}
	$("#btn_back").prop("disabled", true);
	$("#btn_next").prop("disabled", true);
	$("#btn_edit").prop("disabled", true);
	$("#btn_del").prop("disabled", true);
	$("#btn_new").prop("disabled", true);
	$("#btn_cancel").prop("disabled", false);
	$("#btn_save").prop("disabled", false);
});
$(document).on("click", "#btn_new", ()=>{
	if ($("#form_cadClient").is(':visible')){
		$("#tid").val("xxxxxx");
		$("#tnome").val("");
		$("#tendereco").val("");
		$("#ttelefone").val("(xx)xxxx-xxxx");
		$("#temail").val("");
		$("#tlogin").val("");
		$("#tpass").val("");
		$("#tid").prop("disabled", false);
		$("#tnome").prop("disabled", false);
		$("#tendereco").prop("disabled", false);
		$("#ttelefone").prop("disabled", false);
		$("#temail").prop("disabled", false);
		$("#tlogin").prop("disabled", false);
		$("#tpass").prop("disabled", false);
		$("#add_pets").empty();
	}
	if ($("#form_cadAdmin").is(':visible')){
		$("#tid").val("xxxxxx");
		$("#tnome").val("");
		$("#ttelefone").val("(xx)xxxx-xxxx");
		$("#temail").val("");
		$("#tlogin").val("");
		$("#tpass").val("");
		$("#tid").prop("disabled", false);
		$("#tnome").prop("disabled", false);
		$("#ttelefone").prop("disabled", false);
		$("#temail").prop("disabled", false);
		$("#tlogin").prop("disabled", false);
		$("#tpass").prop("disabled", false);
	}
	if ($("#form_CadServicos").is(':visible')){
		$("#tid").val("xxxxxx");
		$("#tnome").val("");
		$("#tdescricao").val("");
		$("#tpreco").val("0.00");	
		$("#tid").prop("disabled", false);
		$("#tnome").prop("disabled", false);
		$("#tdescricao").prop("disabled", false);
		$("#tpreco").prop("disabled", false);
	}
	if ($("#form_CadProdutos").is(':visible')){
		$("#tid").val("xxxxxx");
		$("#tnome").val("");
		$("#tdescricao").val("");
		$("#tpreco").val(0.0);	
		$("#tqtde").val(00);
		$("#tqtdv").val(00);
		$("#tid").prop("disabled", false);
		$("#tnome").prop("disabled", false);
		$("#tdescricao").prop("disabled", false);
		$("#tpreco").prop("disabled", false);
		$("#tqtde").prop("disabled", false);
		$("#tqtdv").prop("disabled", false);
	}
	$("#btn_back").prop("disabled", true);
	$("#btn_next").prop("disabled", true);
	$("#btn_edit").prop("disabled", true);
	$("#btn_del").prop("disabled", true);
	$("#btn_new").prop("disabled", true);
	$("#btn_cancel").prop("disabled", false);
	$("#btn_save").prop("disabled", false);
});
$(document).on("click", "#btn_del", ()=>{
	if ($("#form_cadAdmin").is(':visible') || ($("#form_cadClient").is(':visible')))
		remove("users",$("#tid").val());
	if ($("#form_CadServicos").is(':visible'))
		remove("servs",$("#tid").val());
	if ($("#form_CadProdutos").is(':visible'))
		remove("products",$("#tid").val());
	list.splice(index, 1);
	$("#btn_back").prop("disabled", false);
	$("#btn_next").prop("disabled", false);
	$("#btn_edit").prop("disabled", false);
	$("#btn_del").prop("disabled", false);
	$("#btn_new").prop("disabled", false);
	$("#btn_cancel").prop("disabled", true);
	$("#btn_save").prop("disabled", true);
	$("#btn_back").trigger('click');	
});
$(document).on("click", "#btn_cancel", ()=>{
	if ($("#form_cadClient").is(':visible')){
		$("#add_pets").empty();
		loadClient(list[index]);
	}
	if ($("#form_cadAdmin").is(':visible')){
		loadAdmin(list[index]);
	}
	if ($("#form_CadServicos").is(':visible')){
		loadServs(list[index]);
	}
	if ($("#form_CadProdutos").is(':visible')){
		loadProducts(list[index]);	
	}
	$("#btn_back").prop("disabled", false);
	$("#btn_next").prop("disabled", false);
	$("#btn_edit").prop("disabled", false);
	$("#btn_del").prop("disabled", false);
	$("#btn_new").prop("disabled", false);
	$("#btn_cancel").prop("disabled", true);
	$("#btn_save").prop("disabled", true);
});
$(document).on("click", "#btn_save", ()=>{
	if ($("#form_cadClient").is(':visible')){
		if ($("#tid").attr("disabled")){ //So it's an updating
			list[index].name =  $("#tnome").val();
			list[index].address =  $("#tendereco").val();
			list[index].phone =  $("#ttelefone").val();
			list[index].email =  $("#temail").val();
			list[index].login =  $("#tlogin").val();
			list[index].password =  $("#tpass").val();
			updating("users",list[index]);
			$("#tid").prop("disabled", true);
			$("#tnome").prop("disabled", true);
			$("#tendereco").prop("disabled", true);
			$("#ttelefone").prop("disabled", true);
			$("#temail").prop("disabled", true);
			$("#tlogin").prop("disabled", true);
			$("#tpass").prop("disabled", true);
			$("#btn_back").prop("disabled", false);
			$("#btn_next").prop("disabled", false);
			$("#btn_edit").prop("disabled", false);
			$("#btn_del").prop("disabled", false);
			$("#btn_new").prop("disabled", false);
			$("#btn_cancel").prop("disabled", true);
			$("#btn_save").prop("disabled", true);	
		}
		else {
			if(($("#tid").val()!= "") && ($("#tnome").val()!= "") && ($("#tendereco").val()!="")&&($("#ttelefone").val()!="")&&($("#temail").val()!="")){
				list.push({iduser: $("#tid").val(), name: $("#tnome").val(), login: $("#tlogin").val(), password: $("#tpass").val(), address: $("#tendereco").val(), phone: $("#ttelefone").val(), email: $("#temail").val(), photo: "", type: "1"});	
				index = list.length-1;			
				add("users",list[index]);
				$("#tid").prop("disabled", true);
				$("#tnome").prop("disabled", true);
				$("#tendereco").prop("disabled", true);
				$("#ttelefone").prop("disabled", true);
				$("#temail").prop("disabled", true);
				$("#btn_back").prop("disabled", false);
				$("#btn_next").prop("disabled", false);
				$("#btn_edit").prop("disabled", false);
				$("#btn_del").prop("disabled", false);
				$("#btn_new").prop("disabled", false);
				$("#btn_cancel").prop("disabled", true);
				$("#btn_save").prop("disabled", true);	
			}
			else
				alert("There is empty fields!");
		}
	}
	if ($("#form_cadAdmin").is(':visible')){
		if ($("#tid").attr("disabled")){ //So it's an updating
			list[index].name =  $("#tnome").val();
			list[index].phone =  $("#ttelefone").val();
			list[index].email =  $("#temail").val();
			list[index].login =  $("#tlogin").val();
			list[index].password =  $("#tpass").val();
			updating("users",list[index]);
			$("#tid").prop("disabled", true);
			$("#tnome").prop("disabled", true);
			$("#ttelefone").prop("disabled", true);
			$("#temail").prop("disabled", true);
			$("#tlogin").prop("disabled", true);
			$("#tpass").prop("disabled", true);
			$("#btn_back").prop("disabled", false);
			$("#btn_next").prop("disabled", false);
			$("#btn_edit").prop("disabled", false);
			$("#btn_del").prop("disabled", false);
			$("#btn_new").prop("disabled", false);
			$("#btn_cancel").prop("disabled", true);
			$("#btn_save").prop("disabled", true);	
		}
		else {
			if(($("#tid").val()!= "") && ($("#tnome").val()!= "") &&($("#ttelefone").val()!="")&&($("#temail").val()!="")){
				list.push({iduser: $("#tid").val(), name: $("#tnome").val(), login: $("#tlogin").val(), password: $("#tpass").val(), phone: $("#ttelefone").val(), email: $("#temail").val(), photo: "", type: "0"});	
				index = list.length-1;			
				add("users",list[index]);
				$("#tid").prop("disabled", true);
				$("#tnome").prop("disabled", true);
				$("#ttelefone").prop("disabled", true);
				$("#temail").prop("disabled", true);
				$("#tlogin").prop("disabled", true);
				$("#tpass").prop("disabled", true);
				$("#btn_back").prop("disabled", false);
				$("#btn_next").prop("disabled", false);
				$("#btn_edit").prop("disabled", false);
				$("#btn_del").prop("disabled", false);
				$("#btn_new").prop("disabled", false);
				$("#btn_cancel").prop("disabled", true);
				$("#btn_save").prop("disabled", true);	
			}
			else
				alert("There is empty fields!");
		}
	}
	if ($("#form_CadServicos").is(':visible')){
		if ($("#tid").attr("disabled")){ //So it's an updating
			list[index].name =  $("#tnome").val();
			list[index].description =  $("#tdescricao").val();
			list[index].price =  $("#tpreco").val();
			updating("servs",list[index]);
			$("#tid").prop("disabled", true);
			$("#tnome").prop("disabled", true);
			$("#tdescricao").prop("disabled", true);
			$("#tpreco").prop("disabled", true);
			$("#btn_back").prop("disabled", false);
			$("#btn_next").prop("disabled", false);
			$("#btn_edit").prop("disabled", false);
			$("#btn_del").prop("disabled", false);
			$("#btn_new").prop("disabled", false);
			$("#btn_cancel").prop("disabled", true);
			$("#btn_save").prop("disabled", true);	
		}
		else {
			if(($("#tid").val()!= "") && ($("#tnome").val()!= "") &&($("#tdescricao").val()!="")&&($("#tprice").val()!="")){
				list.push({idserv: $("#tid").val(), name: $("#tnome").val(), description: $("#tdescricao").val(), price: $("#tpreco").val()});	
				index = list.length-1;			
				add("servs",list[index]);
				$("#tid").prop("disabled", true);
				$("#tnome").prop("disabled", true);
				$("#tdescricao").prop("disabled", true);
				$("#tpreco").prop("disabled", true);
				$("#btn_back").prop("disabled", false);
				$("#btn_next").prop("disabled", false);
				$("#btn_edit").prop("disabled", false);
				$("#btn_del").prop("disabled", false);
				$("#btn_new").prop("disabled", false);
				$("#btn_cancel").prop("disabled", true);
				$("#btn_save").prop("disabled", true);	
			}
			else
				alert("There is empty fields!");
		}
	}
	if ($("#form_CadProdutos").is(':visible')){
		if ($("#tid").attr("disabled")){ //So it's an updating
			list[index].name =  $("#tnome").val();
			list[index].description =  $("#tdescricao").val();
			list[index].price =  $("#tpreco").val();
			list[index].stock =  $("#tqtde").val();
			list[index].sells =  $("#tqtdv").val();
			updating("products",list[index]);
			$("#tid").prop("disabled", true);
			$("#tnome").prop("disabled", true);
			$("#tdescricao").prop("disabled", true);
			$("#tpreco").prop("disabled", true);
			$("#tqtde").prop("disabled", true);
			$("#tqtdv").prop("disabled", true);
			$("#btn_back").prop("disabled", false);
			$("#btn_next").prop("disabled", false);
			$("#btn_edit").prop("disabled", false);
			$("#btn_del").prop("disabled", false);
			$("#btn_new").prop("disabled", false);
			$("#btn_cancel").prop("disabled", true);
			$("#btn_save").prop("disabled", true);	
		}
		else {
			if(($("#tid").val()!= "") && ($("#tnome").val()!= "") &&($("#tdescricao").val()!="")&&($("#tprice").val()!="")){
				list.push({idprod: $("#tid").val(), name: $("#tnome").val(), description: $("#tdescricao").val(), price: $("#tpreco").val(), stock: $("#tqtde").val(), sells: $("#tqtdv").val()});	
				index = list.length-1;			
				add("products",list[index]);
				$("#tid").prop("disabled", true);
				$("#tnome").prop("disabled", true);
				$("#tdescricao").prop("disabled", true);
				$("#tpreco").prop("disabled", true);
				$("#tqtde").prop("disabled", true);
				$("#tqtdv").prop("disabled", true);
				$("#btn_back").prop("disabled", false);
				$("#btn_next").prop("disabled", false);
				$("#btn_edit").prop("disabled", false);
				$("#btn_del").prop("disabled", false);
				$("#btn_new").prop("disabled", false);
				$("#btn_cancel").prop("disabled", true);
				$("#btn_save").prop("disabled", true);	
			}
			else
				alert("There is empty fields!");
		}
	}
	if($("#form_CadAnimal").is(':visible')){
		if(($("#tnome").val()!= "") && ($("#traca").val()!= "") &&($("#tage").val()!="")&&($("#tsexo").val()!="")){
			list.push({idpet: "0004", name: $("#tnome").val(), breed: $("traca").val(), age: $("#tage").val() , sex: $("tsexo").val()});
			index = list.length-1;
			add("pets",list[index]);
		}else
			alert("There is empty fields!");
	}
});

$(document).on("click", "#cbServicos", ()=>{
	alert("ta aqui");
	loadServsCB(list[index]);
});

$(document).on("click", "#cbPet", ()=>{
	alert("ta aqui");
	//loadServsCB(list[index]);
});
//===========================================================================================================================
// Ready do documento
//===========================================================================================================================
$(document).ready(() => {
	LoadDB(() => { //Carrega o "banco"
		if ($("#form_cadClient").is(':visible')){ //Se estiver na tela de cadastro de cliente
			readAll("users", function(resp) { 
				let i=0;			
				while(resp[i].type != "1"){ //Enquanto não for cliente
					i = i+1;			
				}
				index=i;				
				loadClient(resp[i]); 
				list=resp;
			});
		}
		if ($("#form_cadAdmin").is(':visible')){ //Se estiver na tela de cadastro de admin
			readAll("users", function(resp) {  
				let i=0;			
				while(resp[i].type != "0"){ //Enquanto não for admin
					i = i+1;			
				}
				index=i;
				loadAdmin(resp[i]);
				list=resp;
			});
		}
		if ($("#form_CadServicos").is(':visible')){ //Se estiver na tela de cadastro de servicos
			readAll("servs", function(resp) {
				index=0;
				list=resp;
				loadServs(list[index]);
			});
		}
		if ($("#form_CadProdutos").is(':visible')){ //Se estiver na tela de cadastro de servicos
			readAll("products", function(resp) {
				index=0;
				list=resp;
				loadProducts(list[index]);
			});
		}
		if ($("#produtos").is(':visible')){ //Se estiver na tela de produtos do cliente
			readAll("products", function(resp) {
				index=0;
				list=resp;
				loadProductsStore(list, index);
			});
		}
		if ($("#animais").is(':visible')){ //Se estiver na tela de produtos do cliente
			readAll("pets", function(resp) {
				index=0;
				list=resp;
				loadPetsUser(list);
			});
		}
		if ($("#cbServicos").is(':visible')){ //Se estiver na tela de produtos do cliente
			readAll("servs", function(resp) {
				index=0;
				list=resp;
				loadServsCB(list);
			});
		}
	});
});





