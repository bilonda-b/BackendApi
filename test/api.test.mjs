import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js';

const { expect } = chai;
chai.use(chaiHttp);

describe("User API", () => {


    describe("POST /Signup", () => {
        it("should create a new user", (done) => {
            const newUser = { email: "stephaniekalongo@gmail.com", password: "kalongo6985" };
            chai.request.execute(server)
                .post('/Signup')
                .send(newUser)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'User created successfully');
                    done();
                });
        });
    });

    
    // describe("GET /users", () => {
    //     it("should retrieve all users", (done) => {
    //         chai.request(server)
    //             .get('/users')
    //             .end((err, res) => {
    //                 expect(res).to.have.status(200);
    //                 expect(res.body).to.be.an('array');
    //                 done();
    //             });
    //     });
    // });

    
    // describe("POST /Signin", () => {
    //     it("should login the user with valid credentials", (done) => {
    //         const credentials = { username: "ysvanetti0@gmpg.org", password: "p4n`nFj" };
    //         chai.request(server)
    //             .post('/Signin')
    //             .send(credentials)
    //             .end((err, res) => {
    //                 expect(res).to.have.status(200);
    //                 expect(res.body).to.be.an('object');
    //                 expect(res.body).to.have.property('message', 'Login successful');
    //                 done();
    //             });
    //     });
    // });
});

