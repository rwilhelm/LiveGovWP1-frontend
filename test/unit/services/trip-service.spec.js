var expect = chai.expect;

//
// test/unit/services/servicesSpec.js
//
describe("Trip service", function() {

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

  // it('should contain an $appYoutubeSearcher service',
  //   inject(function($appYoutubeSearcher) {
  //   expect($appYoutubeSearcher).not.to.equal(null);
  // }));

  // it('should have a working $appYoutubeSearcher service',
  //   inject(['$appYoutubeSearcher',function($yt) {

  //   expect($yt.prefixKey).not.to.equal(null);
  //   expect($yt.resize).not.to.equal(null);
  //   expect($yt.prepareImage).not.to.equal(null);
  //   expect($yt.getWatchedVideos).not.to.equal(null);
  // }]));

  // it('should have a working service that resizes dimensions',
  //   inject(['$appYoutubeSearcher',function($yt) {

  //   var w = 100;
  //   var h = 100;
  //   var mw = 50;
  //   var mh = 50;
  //   var sizes = $yt.resize(w,h,mw,mh);
  //   expect(sizes.length).to.equal(2);
  //   expect(sizes[0]).to.equal(50);
  //   expect(sizes[1]).to.equal(50);
  // }]));

  // it('should store and save data properly',
  //   inject(['$appStorage',function($storage) {

  //   var key = 'key', value = 'value';
  //   $storage.enableCaching();
  //   $storage.put(key, value);
  //   expect($storage.isPresent(key)).to.equal(true);
  //   expect($storage.get(key)).to.equal(value);

  //   $storage.erase(key);
  //   expect($storage.isPresent(key)).to.equal(false);

  //   $storage.put(key, value);
  //   $storage.flush();
  //   expect($storage.isPresent(key)).to.equal(false);
  // }]));

});