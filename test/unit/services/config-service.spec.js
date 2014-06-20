var expect = chai.expect;

//
// test/unit/services/servicesSpec.js
//
describe("Config service", function() {

  beforeEach(module('inspectionFrontEnd'));

  it('should exist',
    inject(function(Config) {
      expect(Config).not.to.equal(null);
    })
  );

  it('should return an not empty array object on .sensors()',
    inject(function(Config) {
      expect(Config.sensors().length).not.to.equal(0);
      expect(typeof Config.sensors()).to.equal('object');
    })
  );

  it('should return an not empty array object on .xDomain()',
    inject(function(Config) {
      expect(Config.xDomain().length).not.to.equal(0);
      expect(typeof Config.xDomain()).to.equal('object');
    })
  );

  it('should return an not empty array object on .yDomain()',
    inject(function(Config) {
      expect(Config.yDomain().length).not.to.equal(0);
      expect(typeof Config.yDomain()).to.equal('object');
    })
  );

  it('should return a number on .windowSize()',
    inject(function(Config) {
      expect(Config.windowSize()).not.to.equal(null);
      expect(typeof Config.windowSize()).to.equal('number');
    })
  );

});