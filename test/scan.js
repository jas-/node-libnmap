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
  , timeout = 1024 * 1024 * 2
  , chai = require('chai')
  , should = chai.should()
  , expect = chai.expect

describe('nmap', function(){

  describe('scan method', function(){
    it('valid report', function(done){
      this.timeout(timeout)

      var opts = {
        range: ['localhost'],
        ports: '1-1024'
      }

      libnmap.nmap('scan', opts, function(err, report){
        should.not.exist(err)

        report.should.be.a('array')
        report[0].should.be.a('array')
        report[0][0].should.be.a('object')

        should.exist(report[0][0].ip)
        should.exist(report[0][0].ports)

        done()
      })
    })
  })
})
