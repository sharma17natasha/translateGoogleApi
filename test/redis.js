var redismock = require("redis-mock");
var should = require("chai").should();
const expect = require("chai").expect;
var events = require("events");
const { cache } = require("../middlewares/cache");
const ISO6391 = require("iso-639-1");

if (process.env["VALID_TESTS"]) {
  redismock = require("redis");
}

// Clean the db after each test
afterEach(function (done) {
  r = redismock.createClient();
  r.flushdb(function () {
    r.end();
    done();
  });
});

describe("redis-mock", function () {
  it("should create an instance of RedisClient which inherits from EventEmitter", function () {
    should.exist(redismock.createClient);

    var r = redismock.createClient();
    should.exist(r);
    r.should.be.an.instanceof(redismock.RedisClient);
    r.should.be.an.instanceof(events.EventEmitter);

    r.end();
  });

  it("should emit ready and connected when creating client", function (done) {
    var r = redismock.createClient();

    var didEmitOther = true;
    var didOtherPassed = false;

    r.on("ready", function () {
      if (didEmitOther && !didOtherPassed) {
        didOtherPassed = true;

        r.end();

        done();
      }
    });

    r.on("connect", function () {
      if (didEmitOther && !didOtherPassed) {
        didOtherPassed = true;

        r.end();

        done();
      }
    });
  });

  it("it should check the cache ", () => {
    const r = redismock.createClient();
    const req = {
      body: {
        text: "hi there, how are you ?",
        language: "hindi",
      },
    };
    const res = cache(req, {}, () => {});
    expect(res).to.be.undefined;
  });

});
