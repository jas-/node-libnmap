/*!
 * libnmap
 * Copyright(c) 2013 Jason Gerfen <jason.gerfen@gmail.com>
 * License: NPSL-0.95
 */

'use strict'

const os = require('os');

class network {
  families(range) {
    const result = {
      ipv4: [],
      ipv6: []
    };

    range.forEach(host => {
      if (host.indexOf(':') !== -1)
        result.ipv6.push(host);
      else
        result.ipv4.push(host);
    });

    return result;
  }

  adapters() {
    const ret = [];
    const adapters = os.networkInterfaces();

    for (const iface in adapters) {
      adapters[iface].forEach(adapter => {
        if (adapter.internal)
          return;

        if (adapter.family !== 'IPv4' && adapter.family !== 4)
          return;

        if (ret.indexOf(adapter.cidr) === -1)
          ret.push(adapter.cidr);
      });
    }

    return ret;
  }
}

module.exports = new network;
