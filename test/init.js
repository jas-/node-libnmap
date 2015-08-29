var pkg = require('../package.json');

var chai = require('chai')
var should = chai.should()
var expect = chai.expect;

var nmap;

describe('nmap', function(){

  before(function () {
    nmap = require('../').nmap();
  })

  describe('default method', function(){

    it('object description', function() {
      expect(nmap).to.be.a('object')
    })

    it('latest version', function() {
      expect(nmap.version).to.be.equal('v' + pkg.version)
    })

    it('usage url', function() {
      expect(nmap.usage).to.be.equal('https://github.com/jas-/node-libnmap');
    })

    it('support url', function() {
      expect(nmap.issues).to.be.equal(pkg.bugs.url);
    })

    it('license url', function() {
      expect(nmap.license).to.be.equal('https://github.com/jas-/node-libnmap/blob/master/LICENSE');
    })

    it('legal url (nmap)', function() {
      expect(nmap.nmap.legal).to.be.equal('http://nmap.org/book/man-legal.html')
    })
  })

  after(function () {
    libnmap = undefined;
  });
})
