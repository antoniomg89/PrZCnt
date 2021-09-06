const express = require('express');
const sdb = require("stormdb");
const firebase = require("firebase-admin");
require('dotenv').config();
let https = require('https');

const app = express();
const ruta = new sdb.localFileEngine("./db.stormdb");
let cuenta_activa = false;
let fb_iniciado = false;

let dv,sv,sa,id_evento;
let db = new sdb(ruta);

//const er = new RegExp(process.env.RE);
const er = new RegExp('^(0{1}|[1-9]|1[0-9]|2[0-3]):(0{1}|[1-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]):(0{1}|[1-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])$');

if(!fb_iniciado) {
    firebase.initializeApp({
        credential: firebase.credential.cert(JSON.parse(Buffer.from(process.env.SERVICE_ACCOUNT, 'base64').toString('ascii'))),
        databaseURL: process.env.FBR
    });
    
    const fbdb = firebase.database();
    fb_iniciado = true;
}


app.use(express.static('contador'));
app.set('port', (process.env.PORT || 4000));

app.get('/setHora/:hora/:id/:agente', (req, res) => {
    if (valHora(req.params['hora'])) {
        dv = req.params['hora'];
        console.log('Hora correcta: ' + dv);

        if (req.params['agente'] == process.env.AGENTE) { 
            id_evento = req.params['id'];
            console.log('Validador verificado.');

            db.get("fecha").delete();
            db.default({ fecha: [] });
            db.get('fecha').push(dv);
            db.save();

            console.log('Hora guardada: ' + getHora());

            segundosVal();
        }
    } else {
        console.log('Hora no válida');
    }
    res.send('ok');
    
})

app.get('/getHora', (req, res) => {
    res.send(db.get('fecha').value());
});

app.listen(app.get('port'), () => {
    console.log('Estado del server: ON');
});

function segundosVal() {
    let res2 = dv.split(':');
    sv = parseInt(res2[0])*3600 + parseInt(res2[1])*60 + parseInt(res2[2]);

    let d = new Date();
    sa = d.getUTCSeconds() + d.getUTCMinutes()*60 + ((d.getUTCHours()+2)%24)*3600;
    setTimeout(cHoras, (298-(sa-sv))*1000);
    cuenta_activa = true;

    if (cuenta_activa){
        setInterval(function() {
            https.get("https://cuenta-atras.herokuapp.com/");
        }, 60000);
    }
    
}

function cHoras () {
    cuenta_activa = false;

    let fbContador = fbdb.ref(process.env.FB1 + id_evento + process.env.FB2);
    let contador_actualizacion = {
        estado: 'false' 
    }

    fbContador.update(contador_actualizacion);
}

function valHora(hora) {
    return er.test(hora);
}

function getHora() {
    return db.get('fecha').value();
}

function resVal(diferencia) {
    if (diferencia > 0 && diferencia <= 300) {
        return true;
    } else {
        return false;
    }
}

exports.valHora = valHora;
exports.getHora = getHora;
exports.resVal = resVal;
