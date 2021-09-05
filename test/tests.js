let expect  = require("chai").expect;
//let request = require("request");

let server = require('../server.js'); 

describe('Tests unitario', function(){
    describe('Validar hora', function(){
        let datetest = new Date();
        let horatest =  ((datetest.getUTCHours()+2)%24) + ':' + datetest.getUTCMinutes() + ':' + datetest.getUTCSeconds();

        it('Resultado', function(){
            expect(server.valHora(horatest)).equal(true);
        });
    });
});
