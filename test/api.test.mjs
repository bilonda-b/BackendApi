const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect; 
chai.use(chaiHttp); 

describe("GET /user", () => {
    it('should return user data', (done) => {
        chai.request('http://localhost:3000/user')
        .get('/user/1')
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('id', 1);
            done();
        });
    });
});



