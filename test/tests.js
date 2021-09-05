let expect  = require("chai").expect;
let should = require("chai").should();
let request = require("request");

let url = 'https://cuenta-atras.herokuapp.com/getHora';


let server = require('../server.js'); 

describe('Tests unitarios', function(){
    describe('Validar hora:', function(){
        let datetest = new Date();
        let horatest =  ((datetest.getUTCHours()+2)%24) + ':' + datetest.getUTCMinutes() + ':' + datetest.getUTCSeconds();

        it('Resultado', function(){
            expect(server.valHora(horatest)).equal(true);
        });
    });

    describe('Obtener hora db:', function(){
        it('Resultado', function(){
            should.exist(server.getHora());
        });
    });

    describe('Funcionamiento diferencia horaria:', function(){
        let datetest = new Date();
        let horatestv =  datetest.getUTCSeconds() + datetest.getUTCMinutes()*60 + ((datetest.getUTCHours()+2)%24)*3600;
        let dif = (horatestv+240) - horatestv;
        it('Resultado', function(){
            expect(server.resVal(dif)).equal(true);
        });
    });
});

describe('Tests funcionales', function(){
    describe('Estado del servidor /getHora:', function(){
        it("returns status 200", function() {
            request(url, function(error, response, body) {
              expect(response.statusCode).to.equal(200);
            });
          });
    });

});
