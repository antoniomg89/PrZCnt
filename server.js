const express = require('express');
const sdb = require("stormdb");
const firebase = require("firebase-admin");
require('dotenv').config();
let https = require('https');
const fs = require('fs');

const app = express();
let fb_iniciado = false;
let db,ruta;
let hora,sv,sa,id_evento;

const er = new RegExp('^(0{1}|[1-9]|1[0-9]|2[0-3]):(0{1}|[1-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]):(0{1}|[1-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])$');

app.use(express.static('contador'));
app.set('port', (process.env.PORT || 4000));

app.get('/setHora/:hora/:id/:agente', (req, res) => {
    if (valHora(req.params['hora'])) {
        hora = req.params['hora'];
        console.log('Hora correcta: ' + hora);

        if (req.params['agente'] == process.env.AGENTE) {
            id_evento = req.params['id'];
            //fin = req.params['fin'];
            console.log('Validador verificado.');
            comprobarDB();
            setHora(hora, id_evento);
            console.log('Hora guardada: ' + getHora());
            segundosVal();
        }
    } else {
        console.log('Hora no válida');
    }
    res.send('ok');
    
})

app.get('/getHora', (req, res) => {
    res.send(getHora());

});

app.listen(app.get('port'), () => {
    console.log('Estado del server: ON');
});

function segundosVal() {
    let res2 = hora.split(':');
    sv = parseInt(res2[0])*3600 + parseInt(res2[1])*60 + parseInt(res2[2]);

    let d = new Date();
    sa = d.getUTCSeconds() + d.getUTCMinutes()*60 + ((d.getUTCHours()+2)%24)*3600;
    setTimeout(cHoras, (298-(sa-sv))*1000);
    cuenta_activa = true;

    /*setInterval(function() {
        if (cuenta_activa){
            https.get("https://cuenta-atras.herokuapp.com/");
        }
    }, 180000);*/
    
    
}

function cHoras () {
    //cuenta_activa = false;
    
    if (!fb_iniciado) {
        firebase.initializeApp({
            credential: firebase.credential.cert(JSON.parse(Buffer.from(process.env.SERVICE_ACCOUNT, 'base64').toString('ascii'))),
            databaseURL: process.env.FBR
        });
        fb_iniciado = true;
    }

    const fbdb = firebase.database();
    let contador_actualizacion = {
        estado: 'false' 
    }

    let fbContador = fbdb.ref(process.env.FB1 + id_evento + process.env.FB2);
    
    fbContador.update(contador_actualizacion);
    console.log('Contador actualizado en fb');
}

function valHora(hora) {
    return er.test(hora);
}

function setHora(h,i) {
    console.log('Hora: ' + h + ' id: ' + i);
    db.get('granada').delete();
    db.default({ granada: [] });
    db.get('granada').push({idev: i, hora: h}).save();  
}

function getHora() {
    return db.get('granada').get(0).get('hora').value();
}

function resVal(diferencia) {
    if (diferencia > 0 && diferencia <= 300) {
        return true;
    } else {
        return false;
    }
}

function comprobarDB() {
    const r = './db.hora'
  
    try {
      if (!fs.existsSync(r)) {
        console.log('No existe la db. Creando...');
        ruta = new sdb.localFileEngine('./db.hora');
        db = new sdb(ruta);
        db.default({ granada: [] });
        db.get('granada').push({idev: 'null', hora: 'null'}).save();
        
      } else {
        console.log('Existe la db.');
        ruta = new sdb.localFileEngine('./db.hora');
        db = new sdb(ruta);    
      }
    } catch(err) {
      console.error(err)
    }
  }

exports.valHora = valHora;
exports.resVal = resVal;
exports.comprobarDB = comprobarDB;
exports.getHora = getHora;
