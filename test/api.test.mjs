import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js';

const { expect } = chai;
chai.use(chaiHttp);

describe("User API", () => {


    describe("POST /user", () => {
        it("should create a new user", (done) => {
            const newUser = { email: "stephaniekalongo@gmail.com", password: "kalongo6985" };
            chai.request.execute(server)
                .post('/user')
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

    
//     describe("Vehicle API", () => {
        
//         it('should POST a new vehicle', (done) => {
//             const newVehicle = {
//                 vehicle: 'Toyota',
//                 model: 'Camry',
//                 year: 2020,
//                 ratings: 5, 
//             };
    
//             chai.request(server)
//                 .post('/vehicles')  
//                 .send(newVehicle)   
//                 .end((err, res) => {
//                     expect(res).to.have.status(201);
//                     expect(res.body).to.be.an('object');
//                     expect(res.body).to.have.property('message').eql('Vehicle added successfully');
//                     expect(res.body).to.have.property('vehicleId'); 
//                     done();
//                 });
//         });
// });

});