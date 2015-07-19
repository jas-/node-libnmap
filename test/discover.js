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

var libnmap = require('../')
  , timeout = 1024 * 1024
  , chai = require('chai')
  , should = chai.should()
  , expect = chai.expect

describe('nmap', function(){

  describe('discovery method', function(){
    it('validate report', function(done){
      this.timeout(timeout)

      libnmap.nmap('discover', function(err, report){
        should.not.exist(err)

        report.should.be.a('array')

        should.exist(report[0].adapter)

        report[0].properties.should.be.a('object')

        should.exist(report[0].properties)
        should.exist(report[0].properties.address)
        should.exist(report[0].properties.netmask)
        should.exist(report[0].properties.family)
        should.exist(report[0].properties.mac)
        should.exist(report[0].properties.internal)
        should.exist(report[0].properties.cidr)
        should.exist(report[0].properties.hosts)
        should.exist(report[0].properties.range)

        report[0].properties.range.should.be.a('object')

        should.exist(report[0].properties.range.start)
        should.exist(report[0].properties.range.end)

        report[0].neighbors.should.be.a('array')

        done()
      })
    })
  })
})
