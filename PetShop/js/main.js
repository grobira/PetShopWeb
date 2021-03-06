//Trabalho 2 Web - Julia Minetto e Giovanni Robira
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
    {idpet: "100000", name: "Duzas", breed: "Vira-Lata", age: 3, photo: "img/duzas.jpg", iduser: "000002"},
    {idpet: "100001", name: "Bob", breed: "Rottweiler", age: 2, photo: "img/Pug.jpg", iduser: "000002"},
	{idpet: "100002", name: "Mell", breed: "Poodle", age: 3, photo: "img/Golden-Retriever.jpg", iduser: "000002"}
];

//Servs
const servicesData = [
    {idserv: "200000", name: "Vacinação", description: "Vacina para pulgas", price: 11.00,  photo: "img/vacina.jpg"},
    {idserv: "200001", name: "Banho e Tosa", description: "Banho e tosa completo", price: 12.00, photo: "img/banho.jpg"}
];

//Products
const productsData = [
    {idprod: "300000", name: "Ração Golden - 15kg", description: "Ração deliciosa cheia de nutrientes para o seu cão.", price: 104.90, stock: 10, sells: 20, photo: "img/golden.jpg"},
    {idprod: "300001", name: "Ração Royal Canin", description: "Nutritiva e macia.", price: 37.99, stock: 5, sells: 2, photo: "img/royal.jpg"},
    {idprod: "300002", name: "Alimento Úmido Pedigree", description: "Feito com deliciosos pedaços de carne cozidos a vapor!", price: 11.99, stock: 12, sells: 2, photo: "img/sache.jpg"},
	{idprod: "300003", name: "Shampoo Antipulgas", description: "Esse funciona!", price: 12.50, stock: 20, sells: 2, photo: "img/shampoo.jpg"},
	{idprod: "300004", name: "Cama Azul Jully Bichinho Chic", description: "A mais confortavel!", price: 88.00, stock: 3, sells: 2, photo: "img/cama.jpg"},
	{idprod: "300005", name: "Gaiola 2 Andares Chinchila", description: "A nova geração de processadores da AMD Bulldozer já chegou!", price: 266.00, stock: 3, sells: 2, photo: "img/gaiola.jpg"}
];

//Venda de produtos
const salesProducts = [
	{ idsalep: "400000", iduser: "000002", idproduto: "300001", qtde: "2", total: 139.90 }
];

//Venda de servicos
const salesServices = [
	{ idsales: "500000", iduser: "000003", idpet: "100000", idserv: "200000", total: 11.00, timeService: "14:00", dateService: "13/06/2017"}
];

let db;
let useri;
var list, list2 = [];
let index = 1;
var totalcomp=0;

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
		    objectStore = db.createObjectStore("pets", {keyPath: "idpet", autoIncrement : true});
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
			//Upgrading sales services
		    objectStore = db.createObjectStore("saleservice", {keyPath: "idsales", autoIncrement: true});
		    for (i in salesServices) {
		       objectStore.add(salesServices[i]);
		    }
			//Upgrading sales products
		    objectStore = db.createObjectStore("saleproducts", {keyPath: "idsalep", autoIncrement: true});
		    for (i in salesProducts) {
		       objectStore.add(salesProducts[i]);
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
		if(request.result) {
			callback(request.result);
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
      //alert("This data has been removed from your database.");
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
				found = true;				
				localStorage.setItem("user_loged", resp[i].iduser);
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
			 loadPetsUser(resp1,data.iduser);
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
	for(let j in data){
		if (data[j].iduser == localStorage.getItem("user_loged"))
			$("#cbServicos").append("<option value=\""+ data[j].name+"\">"+data[j].name+"</option>");
	}
}

function loadPetsCB(data){
	for(let j in data){
		if (data[j].iduser == localStorage.getItem("user_loged"))
			$("#cbPetbtn").append("<option value=\""+ data[j].name+"\">"+data[j].name+"</option>");
	}
}

function loadSalesP(data){
	let user = localStorage.getItem("user_loged");
	for(let i in data){
		if (data[i].iduser == user){
			read("products", data[i].idproduto, function(resp1){
				$("#compra_produtos").append("<div style=\"height: 30%;\" class=\"produto\"><img src=\"" + resp1.photo +"\"><h1><b>"+ resp1.name +"</b></h1><h2>R$:" +data[i].total.toFixed(2) +"</h2></div>");
				totalcomp += data[i].total;
				$("#valor_total").html("Valor total: R$ "+totalcomp.toFixed(2));
			});
		}
	}
}

function loadSalesS(data){
	let user = localStorage.getItem("user_loged");
	for(let i in data){
		if (data[i].iduser == user){
			read("servs", data[i].idserv, function(resp1){
				$("#compra_serv").append("<div style=\"height: 20%;\" class=\"produto\"><img src=\"" + resp1.photo +"\"><h1><b>"+ resp1.name +"</b></h1><p>"+ data[i].timeService +" - " + data[i].dateService+ "</p><h2>R$: " +data[i].total.toFixed(2) +"</h2></div>");
				totalcomp += data[i].total;
				$("#valor_total").html("Valor total: R$ "+totalcomp.toFixed(2));
			});
		}
	}
}

function loadTimeCB(data){
	let times=["8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];
	for(let j in data){
		if ($("#textData").val() == data[j].dateService){
			//Removo os horarios já ocupados
			let index_time = times.indexOf(data[j].timeService);
			times.splice(index_time,1);
		}
	}
	$("#cbHorario").html("");
	for (let j in times){
		$("#cbHorario").append("<option value=\""+ times[j]+"\">"+times[j]+"</option>");	
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

function loadProductsRelatorio(data){
	for(let j in data){
		$("#txtrel").append(data[j].idprod + "\t" + data[j].name.substr(0,15) + "\t\t" + data[j].price.toFixed(2) + "\t\t" + data[j].stock+ "\t" + data[j].sells +"\n");
	}
}

function loadProductsStore(data){
	for (let i=1; i<=6; i++){
		$("#prod"+i).html("");
		if ((index>=0) && (index < list.length)){	
			$("#prod"+i).append("<img src="+data[index].photo +">");
			$("#prod"+i).append("<h1>"+ data[index].name +"</h1>");
			$("#prod"+i).append("<p>"+ data[index].description +"</p>");
			$("#prod"+i).append("<h2>R$: "+ data[index].price +"</h2>");
			$("#prod"+i).append("<p>Qtd:<input type=\"number\" id=\"tqtde"+i+"\" value=\"0\" width=\"20px\"></p>");
			$("#prod"+i).append("<button type=\"button\" class=\"btn btn-success\" id=\"btnComprar"+i+"\">Comprar</button>");
			index++;		
		}
	}
}

function loadPetsUser(data,id_user){
		if (data != null){
			$("#add_pets").append("<ul id=\"nav_pets\" class=\"nav nav-tabs\"> </ul>  <div id=\"tab_pets\" class=\"tab-content\"> </div>");
			let num_pets = 1;			
			for (let j in data) {
				str = "";
				if (id_user == data[j].iduser){ //Se for um pet desse usuario
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
												"<br><img src=\""+ data[j].photo+"\" alt=\"Photo\">	"+		
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
	if(index >= list.length-1)
		index=0;
	loadProductsStore(list);
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
		$("#tphoto").html("<img src=\"img/user.png\">");
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
		$("#tphoto").html("<img src=\"img/user.png\">");
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
		$("#tphoto").html("<img src=\"img/picture.png\">");
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
		$("#tphoto").html("<img src=\"img/picture.png\">");
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
	if ($("#form_cadAdmin").is(':visible') || ($("#form_cadClient").is(':visible'))){
		remove("users",$("#tid").val());
		alert("This user has been removed from your database.");
	}
	if ($("#form_CadServicos").is(':visible')){
		remove("servs",$("#tid").val());
		alert("This service has been removed from your database.");
	}
	if ($("#form_CadProdutos").is(':visible')){
		remove("products",$("#tid").val());
		alert("This product has been removed from your database.");	
	}
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
				list.push({iduser: $("#tid").val(), name: $("#tnome").val(), login: $("#tlogin").val(), password: $("#tpass").val(), address: $("#tendereco").val(), phone: $("#ttelefone").val(), email: $("#temail").val(), photo: "img/user.png", type: "1"});	
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
				list.push({iduser: $("#tid").val(), name: $("#tnome").val(), login: $("#tlogin").val(), password: $("#tpass").val(), phone: $("#ttelefone").val(), email: $("#temail").val(), photo: "img/user.png", type: "0"});	
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
				list.push({idserv: $("#tid").val(), name: $("#tnome").val(), description: $("#tdescricao").val(), price: $("#tpreco").val(), photo: "img/picture.png"});	
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
				list.push({idprod: $("#tid").val(), name: $("#tnome").val(), description: $("#tdescricao").val(), price: $("#tpreco").val(), stock: $("#tqtde").val(), sells: $("#tqtdv").val(), photo: "img/picture.png"});	
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
	if($("#form_cadAnimal").is(':visible')){
		if(($("#tnome").val()!= "") && ($("#traca").val()!= "") &&($("#tage").val()!="")&&($("#tsexo").val()!="")){
			add("pets",{name: $("#tnome").val(), breed: $("#traca").val(), age: $("#tage").val(), photo : "img/pet.png", iduser: localStorage.getItem("user_loged")});
		}else
			alert("There is empty fields!");
	}
});

$(document).on("click", "#btn_finalizar",()=>{
	if ($("#tcartao").val() != ""){
		let user = localStorage.getItem("user_loged");
		for (let i in list){
			alert("entrou2"+list[i].iduser+"e"+user);
			if (list[i].iduser == user){
				alert("entrou");
				remove("salesproducts",list[i].idsalep);	
				list.splice(i,1);
			}
		}	
		for (let i in list2){
			if (list2[i].iduser == user){
				alert("entrou");
				remove("saleservice",list2[i].idsales);	
				list2.splice(i,1);
			}
		}	
		alert("Payment made successfully");
	}
	else
		alert("Please insert your card!");
});

$(document).on("click", "#btn_agenda", ()=>{
	add("saleservice",{iduser: localStorage.getItem("user_loged"), idpet: list2[$("#cbPetbtn").prop("selectedIndex")].idpet, idserv: list[$("#cbServicos").prop("selectedIndex")].idserv, total: list[$("#cbServicos").prop("selectedIndex")].price, timeService: $("#cbHorario").val(), dateService: $("#textData").val()});
	alert("Service scheduled successfully. Please make the payment");
});

$(document).on("click", "#btnComprar1", ()=>{
	alert(index);
	if ($("#tqtde1").val() != 0){
		add("saleproducts",{ iduser: localStorage.getItem("user_loged"), idproduto: list[index-6].idprod, qtde: $("#tqtde1").val(), total: (list[index-6].price*$("#tqtde1").val()) });
	}	
});
$(document).on("click", "#btnComprar2", ()=>{
	if ($("#tqtde2").val() != 0){
		add("saleproducts",{ iduser: localStorage.getItem("user_loged"), idproduto: list[index-5].idprod, qtde: $("#tqtde2").val(), total: (list[index-5].price*$("#tqtde2").val()) });
	}	
});
$(document).on("click", "#btnComprar3", ()=>{
	if ($("#tqtde3").val() != 0){
		add("saleproducts",{ iduser: localStorage.getItem("user_loged"), idproduto: list[index-4].idprod, qtde: $("#tqtde3").val(), total: (list[index-4].price*$("#tqtde3").val()) });
	}	
});
$(document).on("click", "#btnComprar4", ()=>{
	if ($("#tqtde4").val() != 0){
		add("saleproducts",{ iduser: localStorage.getItem("user_loged"), idproduto: list[index-3].idprod, qtde: $("#tqtde4").val(), total: (list[index-3].price*$("#tqtde4").val()) });
	}	
});
$(document).on("click", "#btnComprar5", ()=>{
	if ($("#tqtde5").val() != 0){
		add("saleproducts",{ iduser: localStorage.getItem("user_loged"), idproduto: list[index-2].idprod, qtde: $("#tqtde5").val(), total: (list[index-2].price*$("#tqtde5").val()) });
	}	
});
$(document).on("click", "#btnComprar6", ()=>{
	if ($("#tqtde6").val() != 0){
		add("saleproducts",{ iduser: localStorage.getItem("user_loged"), idproduto: list[index-1].idprod, qtde: $("#tqtde6").val(), total: (list[index-1].price*$("#tqtde6").val()) });
	}	
});

//$(document).on("focusin", "#cbHorario", () =>{
//	alert($('#textData').val());
//	loadTimeCB(list);
//});


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
				loadProductsStore(list);
			});
		}
		if ($("#animais").is(':visible')){ 
			readAll("pets", function(resp) {
				index=0;
				list=resp;
				loadPetsUser(list,localStorage.getItem("user_loged"));
			});
		}
		if ($("#cbServicos").is(':visible')){ //Se estiver na tela de agendamento
			readAll("servs", function(resp) {
				list=resp;
				loadServsCB(resp);
			});
		}
		if ($("#cbPetbtn").is(':visible')){ //Se estiver na tela de agendamento
			readAll("pets", function(resp) {
				list2=resp;
				loadPetsCB(resp);
			});
		}
		if ($("#cbHorario").is(':visible')){ //Se estiver na tela de agendamento
			readAll("saleservice", function(resp) {
				list=resp;
				loadTimeCB(resp);
			});
		}
		if ($("#relatorio").is(':visible')){
			readAll("products", function(resp){
				loadProductsRelatorio(resp);
			});
		}
		if ($("#compra_produtos").is(':visible')){
			readAll("saleproducts", function(resp){
				list = resp;
				loadSalesP(resp);
			});
		}
		if ($("#compra_serv").is(':visible')){
			readAll("saleservice", function(resp){
				list2=resp;
				loadSalesS(resp);
				
			});
		}
    });
});





