/*
 * node-libnmap
 *
 * Copyright 2014-2015 Jason Gerfen
 * All rights reserved.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */

var version = 'v0.1.13'
  , usage = 'https://github.com/jas-/node-libnmap'
  , support = 'https://github.com/jas-/node-libnmap/issues'
  , license = 'https://github.com/jas-/node-libnmap/blob/master/LICENSE'
  , legal = 'http://nmap.org/book/man-legal.html'
  , libnmap = require('../')
  , chai = require('chai')
  , should = chai.should()
  , expect = chai.expect
  , nmap = libnmap.nmap()

describe('nmap', function(){

  describe('default method', function(){
    it('object description', function(done){

      nmap.should.be.a('object')
      should.exist(nmap.name)
      should.exist(nmap.version)
      should.exist(nmap.usage)
      should.exist(nmap.license)
      should.exist(nmap.issues)
      should.exist(nmap.name)

      nmap.nmap.should.be.a('object')
      should.exist(nmap.nmap.legal)

      done()
    })

    it('latest version', function(done){

      expect(nmap.version).to.be.equal(version)

      done()
    })

    it('usage url', function(done){

      expect(nmap.usage).to.be.equal(usage)

      done()
    })

    it('support url', function(done){

      expect(nmap.issues).to.be.equal(support)

      done()
    })

    it('license url', function(done){

      expect(nmap.license).to.be.equal(license)

      done()
    })

    it('legal url (nmap)', function(done){

      expect(nmap.nmap.legal).to.be.equal(legal)

      done()
    })
  })
})
