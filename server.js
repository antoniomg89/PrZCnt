const express = require('express');
const sdb = require("stormdb");
const firebase = require("firebase-admin");
require('dotenv').config();

const app = express();
const ruta = new sdb.localFileEngine("./db.stormdb");

let dv,sv,sa,id_evento;
let db = new sdb(ruta);
let er = new RegExp(process.env.RE);

firebase.initializeApp({
    credential: firebase.credential.cert(JSON.parse(Buffer.from(process.env.SERVICE_ACCOUNT, 'base64').toString('ascii'))),
    databaseURL: process.env.FBR
});

const fbdb = firebase.database();

app.use(express.static('contador'));
app.set('port', (process.env.PORT || 4000));

app.get(process.env.H, (req, res) => {
    if (valHora(req.params['hora'])) {
        console.log('Hora correcta: ' + req.params['hora']);

        if (req.params['agente'] == process.env.AGENTE) { 
            id_evento = req.params['id'];
            console.log('Validador verificado.');
            dv = req.params['hora'];

            db.get("fecha").delete();
            db.default({ fecha: [] });
            db.get('fecha').push(req.params['hora']);
            db.save();

            segundosVal();
        }
    } else {
        console.log('Hora no válida');
    }
    res.send('');
    
})

app.get('/getHora', (req, res) => {
    res.send(db.get('fecha').value());
})

app.listen(app.get('port'), () => {
    console.log('Estado del server: ON');
})

function segundosVal() {
    let res2 = dv.split(':');
    sv = parseInt(res2[0])*3600 + parseInt(res2[1])*60 + parseInt(res2[2]);

    let d = new Date();
    sa = d.getUTCSeconds() + d.getUTCMinutes()*60 + ((d.getUTCHours()+2)%24)*3600;
    setTimeout(cHoras, (298-(sa-sv))*1000);
}

function cHoras () {
    let fbContador = fbdb.ref(process.env.FB1 + id_evento + process.env.FB2);
    let contador_actualizacion = {
        estado: 'false' 
    }

    fbContador.update(contador_actualizacion);
}

function valHora(hora) {
    return er.test(hora);
}

/*function getH() {
    return db.get('fecha').value();
}*/

exports.valHora = valHora;
//exports.getH  = getH;