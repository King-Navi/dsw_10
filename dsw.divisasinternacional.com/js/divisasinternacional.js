const API_URL_BASE = "https://openexchangerates.org/api/";
const API_APP_ID = "e77f99c02f404d34a3631b67223d85e5";
var opt_origen;
var opt_destino;

function consultarMonedas(){
  console.log('consultarMonedas');
  opt_origen = document.getElementById("opt_origen");
  opt_destino = document.getElementById("opt_destino");
  var request = new XMLHttpRequest();
  request.open('GET',API_URL_BASE+"currencies.json?app_id="+API_APP_ID, true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 300) {
      var data = JSON.parse(this.response);
      // El resultado en JSON es un Objeto de tipo Enumerable, por lo que se tiene que hacer un for para recorrer cada elemento
      for(var key in data){
        // Se valida que el atributo tenga propiedades
        if (data.hasOwnProperty(key)){
          // Se obtiene el nombre de cada objeto enumerable
          var nombre = data[key];
          // Se almacena en el arreglo observable cada uno de los elementos
          var opt1 = new Option(nombre, key);
          var opt2 = new Option(nombre, key);
          opt_origen.options.add(opt1);
          opt_destino.options.add(opt2);
        }
      }
    } else {
      alert("No se puede conectar al servidor...");
    }
  }
  request.send();
}

window.onload = function(){
  consultarMonedas();
}

function invertir(){
  var tmp = opt_origen.value;
  opt_origen.value = opt_destino.value;
  opt_destino.value = tmp;
}

function convertir(){
    console.log('convertir');
    let importe = parseFloat(document.getElementById("txt_importe").value);
    let res = document.getElementById("txt_resultado");
    let txtasa = document.getElementById("txt_tasa");
    console.log("Origen: "+opt_origen.value);
    console.log("Destino: "+opt_destino.value);

    var request = new XMLHttpRequest();
    request.open('GET',API_URL_BASE+"latest.json?app_id="+API_APP_ID, true);
    request.onload = function() {

      if (request.status >= 200 && request.status < 300) {
        var data = JSON.parse(this.response);

        console.log(data);

        var var_rates = data.rates;
        var importe_usd = 0.0;
        var importe_final = 0.0;
        var tasa = 0.0;
        var tasa1 = parseFloat(var_rates[opt_origen.value]);
        var tasa2 = parseFloat(var_rates[opt_destino.value]);
        console.log("tasa1: "+tasa1);
        console.log("tasa2: "+tasa2);

        //Convertimos el importe de la tasa origen a dolares
        if(!isNaN(importe) && !isNaN(tasa1) && tasa1 != 0.0){
          importe_usd = importe / tasa1;
        }
        console.log("importe_usd: "+importe_usd);
        //Convertimos el importe en USD al importe destino con la segunda tasa
        if(!isNaN(importe_usd) && !isNaN(tasa2)){
          importe_final = importe_usd * tasa2;
        }
        console.log("importe_final: "+importe_final);
        //Calculamos la tasa directa entre Moneda Origen y Moneda Destino
        if(!isNaN(importe_usd) && !isNaN(importe) && importe!=0.0){
          tasa = importe_final / importe;
        }
        //Asignamos los valores a la interfaz
        txtasa.value = tasa.toFixed(2);
        res.value = importe_final.toFixed(2);
        
      } else {
        alert("No se puede conectar al servidor...");
      }
    }
    request.send();
    return false;// Evita que se ejecute el redirect del FORM
}