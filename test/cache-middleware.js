const { cache } = require("../middlewares/cache");
const app = require("../app");
var chai = require("chai"),
  chaiHttp = require("chai-http");
var expect = chai.expect;
chai.use(chaiHttp);

describe("Cache middleware", () => {
  it("should return the result of /api/v1/translate", (done) => {
    chai
      .request(app)
      .post("/api/v1/translate")
      .send({ text: "hi there how are you ", language: "hindi" })
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.text).to.equal(
          '{"message":"Success","data":"आपका अभिवादन आपके हालचाल कैसे हैं"}'
        );
      })
      .catch(function (err) {
        expect(res).to.not.have.status(200);
        expect(res).to.throw(err);
      });
    done();
  });

  
});
