let expect  = require("chai").expect;
let server = require('../server.js'); 

describe('Tests unitarios', function(){
    describe('Validar hora:', function(){
        let datetest = new Date();
        let horatest =  ((datetest.getUTCHours()+2)%24) + ':' + datetest.getUTCMinutes() + ':' + datetest.getUTCSeconds();

        it('Resultado', function(done){
            expect(server.valHora(horatest)).equal(true);
            done();
        });
    });

    describe('Funcionamiento diferencia horaria:', function(){
        let datetest = new Date();
        let horatestv =  datetest.getUTCSeconds() + datetest.getUTCMinutes()*60 + ((datetest.getUTCHours()+2)%24)*3600;
        let dif = (horatestv+240) - horatestv;
        it('Resultado', function(done){
            expect(server.resVal(dif)).equal(true);
            done();
        });
    });

    describe('Hora db correcta:', function(){
        server.comprobarDB();
        it('Resultado', function(done){
            expect(server.getHora()).equal('null');
            done();
        });
    });
});
