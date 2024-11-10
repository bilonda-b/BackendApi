import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js';

const expect = chai.expect;
chai.use(chaiHttp);

describe("User API", () => {
    describe("POST /SignUp", () => {
        it("should create a new user", (done) => {
            const user = { email: "testuser@example.com", password: "password123" };
            chai.request(server)
                .post("/SignUp")
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property("message", "User created successfully");
                    expect(res.body).to.have.property("userId");
                    done();
                });
        });
    });

    describe("GET /users", () => {
        it("should retrieve all users", (done) => {
            chai.request(server)
                .get("/users")
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an("array");
                    done();
                });
        });
    });

    describe("POST /Signin", () => {
        it("should login the user with valid credentials", (done) => {
            const credentials = { username: "testuser", password: "password123" };
            chai.request(server)
                .post("/Signin")
                .send(credentials)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property("message", "Login successful");
                    done();
                });
        });
    });

});


