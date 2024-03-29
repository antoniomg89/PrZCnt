const gca = document.getElementById('gca');
let url = 'https://cuenta-atras.herokuapp.com/getHora';
//let url = 'http://localhost:8080/getHora';

let req = new XMLHttpRequest();

validacionHora();

function getCA(t, e) {
    let timer = t;
    let min, seg;
    setInterval(function () {
        min = parseInt(timer / 60, 10);
        seg = parseInt(timer % 60, 10);

        min = min < 10 ? '0' + min : min;
        seg = seg < 10 ? '0' + seg : seg;

        e.textContent = min + ":" + seg;

        if (--timer < 0) {
            timer = 0;
        }
    }, 1000);
}

function validacionHora() {
    req.open('GET', url, false, null, null);
    req.send(null);

    if (req.status == 200){
        if (req.responseText != 'null') {
            let res1 = req.responseText;
            let res2 = res1.split(':'); 
            let rs = parseInt(res2[0])*3600 + parseInt(res2[1])*60 + parseInt(res2[2]);
            console.log('Segundos minutos: ' + res2[1]);
            let d = new Date();
            let sa = d.getUTCSeconds() + d.getUTCMinutes()*60 + ((d.getUTCHours()+2)%24)*3600;
            let dif = sa-rs;

            if (dif > 0 && dif <= 300) {
                getCA(300-dif,gca);
            }

            /*if (dif > 0 && dif <= 120) {
                getCA(120-dif,gca);
            }*/
    
        }
        
    }
}



