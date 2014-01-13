/*
 * node-libnmap
 *
 * Copyright 2014 Jason Gerfen
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

var libnmap = require('../')
  , chai = require('chai')
  , should = chai.should()
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


      done()
    })

    it('issues reference valid', function(done){


      done()
    })
  })
})
