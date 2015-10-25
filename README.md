# libnmap [![Build Status](https://travis-ci.org/jas-/node-libnmap.png?branch=master)](https://travis-ci.org/jas-/node-libnmap)

Access nmap using node.js

## install ##

To install `npm install libnmap`

## methods ##

* `scan`      Performs scan given available range & optional port
* `discover`  Retrieves list of online network neighbors

## options ##

* `nmap`      {String}    Path to NMAP binary
* `verbose`   {Boolean}   Turn on verbosity during scan(s)
* `ports`     {String}    Range of ports to scan
* `range`     {Array}     An array of hostnames/ipv4/ipv6, CIDR or ranges
* `timeout`   {Number}    Number of minutes to wait for host/port response
* `blocksize` {Number}    Number of hosts per network scanning block
* `threshold` {Number}    Max number of  spawned process
* `flags`     {Array}     Array of flags for .spawn()
* `udp`       {Boolean}   UDP scan mode enabled
* `json`      {Boolean}   JSON object as output, false produces XML

## tests ##

To test `npm test`

## example ##

A default usage example. For more advanced and possible options please
see [here](https://gist.github.com/jas-/eae6b0c6e82a4e072b97)

### scan ###

The example show shows the types of host ranges supported. In this example the
default IANA range of reserved ports is scanned per host in each range (1024).

```javascript
var nmap = require('libnmap')
  , opts = {
      range: [
        'scanme.nmap.org',
        '10.0.2.0/25',
        '192.168.10.80-120',
        'fe80::42:acff:fe11:fd4e/64'
      ]
    };

nmap.scan(opts, function(err, report) {
  if (err) throw new Error(err);

  for (var item in report) {
    console.log(JSON.stringify(report[item]));
  }
});
```

### discover ###

The discover method requires nodejs < `v0.11.2` and can be used to aquire
information about neighbors per network interface.

```javascript
var nmap = require('libnmap');

nmap.discover(function(err, report) {
  if (err) throw new Error(err);

  for (var item in report) {
    console.log(JSON.stringify(report[item]));
  }
});
```

### sample report ###

`xml` & `json` (default) reporting methods are available. Here is a sample 
report.

```json
{
    "172.17.190.241-255": {
        "$": {
            "scanner": "nmap",
            "args": "nmap --host-timeout=900s -T0 --max-retries 10 --ttl 200ms --scan-delay 10s --max-rate 30 -oX - -p1-1024 172.17.190.241-255",
            "start": "1445783304",
            "startstr": "Sun Oct 25 14:28:24 2015",
            "version": "6.40",
            "xmloutputversion": "1.04"
        },
        "scaninfo": [
            {
                "$": {
                    "type": "connect",
                    "protocol": "tcp",
                    "numservices": "1024",
                    "services": "1-1024"
                }
            }
        ],
        "verbose": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "debugging": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "runstats": [
            {
                "finished": [
                    {
                        "$": {
                            "time": "1445783360",
                            "timestr": "Sun Oct 25 14:29:20 2015",
                            "elapsed": "56.22",
                            "summary": "Nmap done at Sun Oct 25 14:29:20 2015; 15 IP addresses (0 hosts up) scanned in 56.22 seconds",
                            "exit": "success"
                        }
                    }
                ],
                "hosts": [
                    {
                        "$": {
                            "up": "0",
                            "down": "15",
                            "total": "15"
                        }
                    }
                ]
            }
        ]
    },
    "172.17.190.1-16": {
        "$": {
            "scanner": "nmap",
            "args": "nmap --host-timeout=900s -T0 --max-retries 10 --ttl 200ms --scan-delay 10s --max-rate 30 -oX - -p1-1024 172.17.190.1-16",
            "start": "1445783304",
            "startstr": "Sun Oct 25 14:28:24 2015",
            "version": "6.40",
            "xmloutputversion": "1.04"
        },
        "scaninfo": [
            {
                "$": {
                    "type": "connect",
                    "protocol": "tcp",
                    "numservices": "1024",
                    "services": "1-1024"
                }
            }
        ],
        "verbose": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "debugging": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "runstats": [
            {
                "finished": [
                    {
                        "$": {
                            "time": "1445783362",
                            "timestr": "Sun Oct 25 14:29:22 2015",
                            "elapsed": "58.08",
                            "summary": "Nmap done at Sun Oct 25 14:29:22 2015; 16 IP addresses (0 hosts up) scanned in 58.08 seconds",
                            "exit": "success"
                        }
                    }
                ],
                "hosts": [
                    {
                        "$": {
                            "up": "0",
                            "down": "16",
                            "total": "16"
                        }
                    }
                ]
            }
        ]
    },
    "172.17.190.113-128": {
        "$": {
            "scanner": "nmap",
            "args": "nmap --host-timeout=900s -T0 --max-retries 10 --ttl 200ms --scan-delay 10s --max-rate 30 -oX - -p1-1024 172.17.190.113-128",
            "start": "1445783304",
            "startstr": "Sun Oct 25 14:28:24 2015",
            "version": "6.40",
            "xmloutputversion": "1.04"
        },
        "scaninfo": [
            {
                "$": {
                    "type": "connect",
                    "protocol": "tcp",
                    "numservices": "1024",
                    "services": "1-1024"
                }
            }
        ],
        "verbose": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "debugging": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "runstats": [
            {
                "finished": [
                    {
                        "$": {
                            "time": "1445783362",
                            "timestr": "Sun Oct 25 14:29:22 2015",
                            "elapsed": "58.24",
                            "summary": "Nmap done at Sun Oct 25 14:29:22 2015; 16 IP addresses (0 hosts up) scanned in 58.24 seconds",
                            "exit": "success"
                        }
                    }
                ],
                "hosts": [
                    {
                        "$": {
                            "up": "0",
                            "down": "16",
                            "total": "16"
                        }
                    }
                ]
            }
        ]
    },
    "172.17.190.33-48": {
        "$": {
            "scanner": "nmap",
            "args": "nmap --host-timeout=900s -T0 --max-retries 10 --ttl 200ms --scan-delay 10s --max-rate 30 -oX - -p1-1024 172.17.190.33-48",
            "start": "1445783304",
            "startstr": "Sun Oct 25 14:28:24 2015",
            "version": "6.40",
            "xmloutputversion": "1.04"
        },
        "scaninfo": [
            {
                "$": {
                    "type": "connect",
                    "protocol": "tcp",
                    "numservices": "1024",
                    "services": "1-1024"
                }
            }
        ],
        "verbose": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "debugging": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "runstats": [
            {
                "finished": [
                    {
                        "$": {
                            "time": "1445783362",
                            "timestr": "Sun Oct 25 14:29:22 2015",
                            "elapsed": "58.29",
                            "summary": "Nmap done at Sun Oct 25 14:29:22 2015; 16 IP addresses (0 hosts up) scanned in 58.29 seconds",
                            "exit": "success"
                        }
                    }
                ],
                "hosts": [
                    {
                        "$": {
                            "up": "0",
                            "down": "16",
                            "total": "16"
                        }
                    }
                ]
            }
        ]
    },
    "172.17.190.81-96": {
        "$": {
            "scanner": "nmap",
            "args": "nmap --host-timeout=900s -T0 --max-retries 10 --ttl 200ms --scan-delay 10s --max-rate 30 -oX - -p1-1024 172.17.190.81-96",
            "start": "1445783304",
            "startstr": "Sun Oct 25 14:28:24 2015",
            "version": "6.40",
            "xmloutputversion": "1.04"
        },
        "scaninfo": [
            {
                "$": {
                    "type": "connect",
                    "protocol": "tcp",
                    "numservices": "1024",
                    "services": "1-1024"
                }
            }
        ],
        "verbose": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "debugging": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "runstats": [
            {
                "finished": [
                    {
                        "$": {
                            "time": "1445783362",
                            "timestr": "Sun Oct 25 14:29:22 2015",
                            "elapsed": "58.26",
                            "summary": "Nmap done at Sun Oct 25 14:29:22 2015; 16 IP addresses (0 hosts up) scanned in 58.26 seconds",
                            "exit": "success"
                        }
                    }
                ],
                "hosts": [
                    {
                        "$": {
                            "up": "0",
                            "down": "16",
                            "total": "16"
                        }
                    }
                ]
            }
        ]
    },
    "172.17.190.161-176": {
        "$": {
            "scanner": "nmap",
            "args": "nmap --host-timeout=900s -T0 --max-retries 10 --ttl 200ms --scan-delay 10s --max-rate 30 -oX - -p1-1024 172.17.190.161-176",
            "start": "1445783304",
            "startstr": "Sun Oct 25 14:28:24 2015",
            "version": "6.40",
            "xmloutputversion": "1.04"
        },
        "scaninfo": [
            {
                "$": {
                    "type": "connect",
                    "protocol": "tcp",
                    "numservices": "1024",
                    "services": "1-1024"
                }
            }
        ],
        "verbose": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "debugging": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "runstats": [
            {
                "finished": [
                    {
                        "$": {
                            "time": "1445783362",
                            "timestr": "Sun Oct 25 14:29:22 2015",
                            "elapsed": "58.24",
                            "summary": "Nmap done at Sun Oct 25 14:29:22 2015; 16 IP addresses (0 hosts up) scanned in 58.24 seconds",
                            "exit": "success"
                        }
                    }
                ],
                "hosts": [
                    {
                        "$": {
                            "up": "0",
                            "down": "16",
                            "total": "16"
                        }
                    }
                ]
            }
        ]
    },
    "172.17.190.49-64": {
        "$": {
            "scanner": "nmap",
            "args": "nmap --host-timeout=900s -T0 --max-retries 10 --ttl 200ms --scan-delay 10s --max-rate 30 -oX - -p1-1024 172.17.190.49-64",
            "start": "1445783304",
            "startstr": "Sun Oct 25 14:28:24 2015",
            "version": "6.40",
            "xmloutputversion": "1.04"
        },
        "scaninfo": [
            {
                "$": {
                    "type": "connect",
                    "protocol": "tcp",
                    "numservices": "1024",
                    "services": "1-1024"
                }
            }
        ],
        "verbose": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "debugging": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "runstats": [
            {
                "finished": [
                    {
                        "$": {
                            "time": "1445783362",
                            "timestr": "Sun Oct 25 14:29:22 2015",
                            "elapsed": "58.43",
                            "summary": "Nmap done at Sun Oct 25 14:29:22 2015; 16 IP addresses (0 hosts up) scanned in 58.43 seconds",
                            "exit": "success"
                        }
                    }
                ],
                "hosts": [
                    {
                        "$": {
                            "up": "0",
                            "down": "16",
                            "total": "16"
                        }
                    }
                ]
            }
        ]
    },
    "172.17.190.177-192": {
        "$": {
            "scanner": "nmap",
            "args": "nmap --host-timeout=900s -T0 --max-retries 10 --ttl 200ms --scan-delay 10s --max-rate 30 -oX - -p1-1024 172.17.190.177-192",
            "start": "1445783304",
            "startstr": "Sun Oct 25 14:28:24 2015",
            "version": "6.40",
            "xmloutputversion": "1.04"
        },
        "scaninfo": [
            {
                "$": {
                    "type": "connect",
                    "protocol": "tcp",
                    "numservices": "1024",
                    "services": "1-1024"
                }
            }
        ],
        "verbose": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "debugging": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "runstats": [
            {
                "finished": [
                    {
                        "$": {
                            "time": "1445783362",
                            "timestr": "Sun Oct 25 14:29:22 2015",
                            "elapsed": "58.37",
                            "summary": "Nmap done at Sun Oct 25 14:29:22 2015; 16 IP addresses (0 hosts up) scanned in 58.37 seconds",
                            "exit": "success"
                        }
                    }
                ],
                "hosts": [
                    {
                        "$": {
                            "up": "0",
                            "down": "16",
                            "total": "16"
                        }
                    }
                ]
            }
        ]
    },
    "172.17.190.129-144": {
        "$": {
            "scanner": "nmap",
            "args": "nmap --host-timeout=900s -T0 --max-retries 10 --ttl 200ms --scan-delay 10s --max-rate 30 -oX - -p1-1024 172.17.190.129-144",
            "start": "1445783304",
            "startstr": "Sun Oct 25 14:28:24 2015",
            "version": "6.40",
            "xmloutputversion": "1.04"
        },
        "scaninfo": [
            {
                "$": {
                    "type": "connect",
                    "protocol": "tcp",
                    "numservices": "1024",
                    "services": "1-1024"
                }
            }
        ],
        "verbose": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "debugging": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "runstats": [
            {
                "finished": [
                    {
                        "$": {
                            "time": "1445783362",
                            "timestr": "Sun Oct 25 14:29:22 2015",
                            "elapsed": "58.42",
                            "summary": "Nmap done at Sun Oct 25 14:29:22 2015; 16 IP addresses (0 hosts up) scanned in 58.42 seconds",
                            "exit": "success"
                        }
                    }
                ],
                "hosts": [
                    {
                        "$": {
                            "up": "0",
                            "down": "16",
                            "total": "16"
                        }
                    }
                ]
            }
        ]
    },
    "172.17.190.193-208": {
        "$": {
            "scanner": "nmap",
            "args": "nmap --host-timeout=900s -T0 --max-retries 10 --ttl 200ms --scan-delay 10s --max-rate 30 -oX - -p1-1024 172.17.190.193-208",
            "start": "1445783304",
            "startstr": "Sun Oct 25 14:28:24 2015",
            "version": "6.40",
            "xmloutputversion": "1.04"
        },
        "scaninfo": [
            {
                "$": {
                    "type": "connect",
                    "protocol": "tcp",
                    "numservices": "1024",
                    "services": "1-1024"
                }
            }
        ],
        "verbose": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "debugging": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "runstats": [
            {
                "finished": [
                    {
                        "$": {
                            "time": "1445783363",
                            "timestr": "Sun Oct 25 14:29:23 2015",
                            "elapsed": "59.37",
                            "summary": "Nmap done at Sun Oct 25 14:29:23 2015; 16 IP addresses (0 hosts up) scanned in 59.37 seconds",
                            "exit": "success"
                        }
                    }
                ],
                "hosts": [
                    {
                        "$": {
                            "up": "0",
                            "down": "16",
                            "total": "16"
                        }
                    }
                ]
            }
        ]
    },
    "scanme.nmap.org": {
        "$": {
            "scanner": "nmap",
            "args": "nmap --host-timeout=900s -T0 --max-retries 10 --ttl 200ms --scan-delay 10s --max-rate 30 -oX - -p1-1024 scanme.nmap.org",
            "start": "1445783304",
            "startstr": "Sun Oct 25 14:28:24 2015",
            "version": "6.40",
            "xmloutputversion": "1.04"
        },
        "scaninfo": [
            {
                "$": {
                    "type": "connect",
                    "protocol": "tcp",
                    "numservices": "1024",
                    "services": "1-1024"
                }
            }
        ],
        "verbose": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "debugging": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "host": [
            {
                "$": {
                    "starttime": "1445783304",
                    "endtime": "1445784205"
                },
                "status": [
                    {
                        "$": {
                            "state": "up",
                            "reason": "syn-ack",
                            "reason_ttl": "0"
                        }
                    }
                ],
                "address": [
                    {
                        "$": {
                            "addr": "45.33.32.156",
                            "addrtype": "ipv4"
                        }
                    }
                ],
                "hostnames": [
                    {
                        "hostname": [
                            {
                                "$": {
                                    "name": "scanme.nmap.org",
                                    "type": "user"
                                }
                            },
                            {
                                "$": {
                                    "name": "scanme.nmap.org",
                                    "type": "PTR"
                                }
                            }
                        ]
                    }
                ]
            }
        ],
        "runstats": [
            {
                "finished": [
                    {
                        "$": {
                            "time": "1445784205",
                            "timestr": "Sun Oct 25 14:43:25 2015",
                            "elapsed": "901.24",
                            "summary": "Nmap done at Sun Oct 25 14:43:25 2015; 1 IP address (1 host up) scanned in 901.24 seconds",
                            "exit": "success"
                        }
                    }
                ],
                "hosts": [
                    {
                        "$": {
                            "up": "1",
                            "down": "0",
                            "total": "1"
                        }
                    }
                ]
            }
        ]
    },
    "172.17.190.65-80": {
        "$": {
            "scanner": "nmap",
            "args": "nmap --host-timeout=900s -T0 --max-retries 10 --ttl 200ms --scan-delay 10s --max-rate 30 -oX - -p1-1024 172.17.190.65-80",
            "start": "1445783304",
            "startstr": "Sun Oct 25 14:28:24 2015",
            "version": "6.40",
            "xmloutputversion": "1.04"
        },
        "scaninfo": [
            {
                "$": {
                    "type": "connect",
                    "protocol": "tcp",
                    "numservices": "1024",
                    "services": "1-1024"
                }
            }
        ],
        "verbose": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "debugging": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "host": [
            {
                "$": {
                    "starttime": "1445783304",
                    "endtime": "1445784236"
                },
                "status": [
                    {
                        "$": {
                            "state": "up",
                            "reason": "conn-refused",
                            "reason_ttl": "0"
                        }
                    }
                ],
                "address": [
                    {
                        "$": {
                            "addr": "172.17.190.67",
                            "addrtype": "ipv4"
                        }
                    }
                ],
                "hostnames": [
                    "\n"
                ]
            },
            {
                "$": {
                    "starttime": "1445783304",
                    "endtime": "1445784244"
                },
                "status": [
                    {
                        "$": {
                            "state": "up",
                            "reason": "conn-refused",
                            "reason_ttl": "0"
                        }
                    }
                ],
                "address": [
                    {
                        "$": {
                            "addr": "172.17.190.69",
                            "addrtype": "ipv4"
                        }
                    }
                ],
                "hostnames": [
                    "\n"
                ]
            }
        ],
        "runstats": [
            {
                "finished": [
                    {
                        "$": {
                            "time": "1445784244",
                            "timestr": "Sun Oct 25 14:44:04 2015",
                            "elapsed": "940.53",
                            "summary": "Nmap done at Sun Oct 25 14:44:04 2015; 16 IP addresses (2 hosts up) scanned in 940.53 seconds",
                            "exit": "success"
                        }
                    }
                ],
                "hosts": [
                    {
                        "$": {
                            "up": "2",
                            "down": "14",
                            "total": "16"
                        }
                    }
                ]
            }
        ]
    },
    "172.17.190.225-240": {
        "$": {
            "scanner": "nmap",
            "args": "nmap --host-timeout=900s -T0 --max-retries 10 --ttl 200ms --scan-delay 10s --max-rate 30 -oX - -p1-1024 172.17.190.225-240",
            "start": "1445783304",
            "startstr": "Sun Oct 25 14:28:24 2015",
            "version": "6.40",
            "xmloutputversion": "1.04"
        },
        "scaninfo": [
            {
                "$": {
                    "type": "connect",
                    "protocol": "tcp",
                    "numservices": "1024",
                    "services": "1-1024"
                }
            }
        ],
        "verbose": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "debugging": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "host": [
            {
                "$": {
                    "starttime": "1445783304",
                    "endtime": "1445784233"
                },
                "status": [
                    {
                        "$": {
                            "state": "up",
                            "reason": "conn-refused",
                            "reason_ttl": "0"
                        }
                    }
                ],
                "address": [
                    {
                        "$": {
                            "addr": "172.17.190.226",
                            "addrtype": "ipv4"
                        }
                    }
                ],
                "hostnames": [
                    "\n"
                ]
            },
            {
                "$": {
                    "starttime": "1445783304",
                    "endtime": "1445784243"
                },
                "status": [
                    {
                        "$": {
                            "state": "up",
                            "reason": "conn-refused",
                            "reason_ttl": "0"
                        }
                    }
                ],
                "address": [
                    {
                        "$": {
                            "addr": "172.17.190.234",
                            "addrtype": "ipv4"
                        }
                    }
                ],
                "hostnames": [
                    "\n"
                ]
            },
            {
                "$": {
                    "starttime": "1445783304",
                    "endtime": "1445784246"
                },
                "status": [
                    {
                        "$": {
                            "state": "up",
                            "reason": "conn-refused",
                            "reason_ttl": "0"
                        }
                    }
                ],
                "address": [
                    {
                        "$": {
                            "addr": "172.17.190.239",
                            "addrtype": "ipv4"
                        }
                    }
                ],
                "hostnames": [
                    "\n"
                ]
            },
            {
                "$": {
                    "starttime": "1445783304",
                    "endtime": "1445784219"
                },
                "status": [
                    {
                        "$": {
                            "state": "up",
                            "reason": "conn-refused",
                            "reason_ttl": "0"
                        }
                    }
                ],
                "address": [
                    {
                        "$": {
                            "addr": "172.17.190.240",
                            "addrtype": "ipv4"
                        }
                    }
                ],
                "hostnames": [
                    "\n"
                ]
            }
        ],
        "runstats": [
            {
                "finished": [
                    {
                        "$": {
                            "time": "1445784246",
                            "timestr": "Sun Oct 25 14:44:06 2015",
                            "elapsed": "941.47",
                            "summary": "Nmap done at Sun Oct 25 14:44:06 2015; 16 IP addresses (4 hosts up) scanned in 941.47 seconds",
                            "exit": "success"
                        }
                    }
                ],
                "hosts": [
                    {
                        "$": {
                            "up": "4",
                            "down": "12",
                            "total": "16"
                        }
                    }
                ]
            }
        ]
    },
    "172.17.190.17-32": {
        "$": {
            "scanner": "nmap",
            "args": "nmap --host-timeout=900s -T0 --max-retries 10 --ttl 200ms --scan-delay 10s --max-rate 30 -oX - -p1-1024 172.17.190.17-32",
            "start": "1445783304",
            "startstr": "Sun Oct 25 14:28:24 2015",
            "version": "6.40",
            "xmloutputversion": "1.04"
        },
        "scaninfo": [
            {
                "$": {
                    "type": "connect",
                    "protocol": "tcp",
                    "numservices": "1024",
                    "services": "1-1024"
                }
            }
        ],
        "verbose": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "debugging": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "host": [
            {
                "$": {
                    "starttime": "1445783304",
                    "endtime": "1445784254"
                },
                "status": [
                    {
                        "$": {
                            "state": "up",
                            "reason": "conn-refused",
                            "reason_ttl": "0"
                        }
                    }
                ],
                "address": [
                    {
                        "$": {
                            "addr": "172.17.190.27",
                            "addrtype": "ipv4"
                        }
                    }
                ],
                "hostnames": [
                    "\n"
                ]
            }
        ],
        "runstats": [
            {
                "finished": [
                    {
                        "$": {
                            "time": "1445784254",
                            "timestr": "Sun Oct 25 14:44:14 2015",
                            "elapsed": "950.47",
                            "summary": "Nmap done at Sun Oct 25 14:44:14 2015; 16 IP addresses (1 host up) scanned in 950.47 seconds",
                            "exit": "success"
                        }
                    }
                ],
                "hosts": [
                    {
                        "$": {
                            "up": "1",
                            "down": "15",
                            "total": "16"
                        }
                    }
                ]
            }
        ]
    },
    "172.17.190.145-160": {
        "$": {
            "scanner": "nmap",
            "args": "nmap --host-timeout=900s -T0 --max-retries 10 --ttl 200ms --scan-delay 10s --max-rate 30 -oX - -p1-1024 172.17.190.145-160",
            "start": "1445783304",
            "startstr": "Sun Oct 25 14:28:24 2015",
            "version": "6.40",
            "xmloutputversion": "1.04"
        },
        "scaninfo": [
            {
                "$": {
                    "type": "connect",
                    "protocol": "tcp",
                    "numservices": "1024",
                    "services": "1-1024"
                }
            }
        ],
        "verbose": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "debugging": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "host": [
            {
                "$": {
                    "starttime": "1445783304",
                    "endtime": "1445784255"
                },
                "status": [
                    {
                        "$": {
                            "state": "up",
                            "reason": "conn-refused",
                            "reason_ttl": "0"
                        }
                    }
                ],
                "address": [
                    {
                        "$": {
                            "addr": "172.17.190.148",
                            "addrtype": "ipv4"
                        }
                    }
                ],
                "hostnames": [
                    "\n"
                ]
            },
            {
                "$": {
                    "starttime": "1445783304",
                    "endtime": "1445784242"
                },
                "status": [
                    {
                        "$": {
                            "state": "up",
                            "reason": "conn-refused",
                            "reason_ttl": "0"
                        }
                    }
                ],
                "address": [
                    {
                        "$": {
                            "addr": "172.17.190.150",
                            "addrtype": "ipv4"
                        }
                    }
                ],
                "hostnames": [
                    "\n"
                ]
            },
            {
                "$": {
                    "starttime": "1445783304",
                    "endtime": "1445784223"
                },
                "status": [
                    {
                        "$": {
                            "state": "up",
                            "reason": "conn-refused",
                            "reason_ttl": "0"
                        }
                    }
                ],
                "address": [
                    {
                        "$": {
                            "addr": "172.17.190.152",
                            "addrtype": "ipv4"
                        }
                    }
                ],
                "hostnames": [
                    "\n"
                ]
            },
            {
                "$": {
                    "starttime": "1445783304",
                    "endtime": "1445784237"
                },
                "status": [
                    {
                        "$": {
                            "state": "up",
                            "reason": "conn-refused",
                            "reason_ttl": "0"
                        }
                    }
                ],
                "address": [
                    {
                        "$": {
                            "addr": "172.17.190.156",
                            "addrtype": "ipv4"
                        }
                    }
                ],
                "hostnames": [
                    "\n"
                ]
            }
        ],
        "runstats": [
            {
                "finished": [
                    {
                        "$": {
                            "time": "1445784255",
                            "timestr": "Sun Oct 25 14:44:15 2015",
                            "elapsed": "950.59",
                            "summary": "Nmap done at Sun Oct 25 14:44:15 2015; 16 IP addresses (4 hosts up) scanned in 950.59 seconds",
                            "exit": "success"
                        }
                    }
                ],
                "hosts": [
                    {
                        "$": {
                            "up": "4",
                            "down": "12",
                            "total": "16"
                        }
                    }
                ]
            }
        ]
    },
    "172.17.190.97-112": {
        "$": {
            "scanner": "nmap",
            "args": "nmap --host-timeout=900s -T0 --max-retries 10 --ttl 200ms --scan-delay 10s --max-rate 30 -oX - -p1-1024 172.17.190.97-112",
            "start": "1445783304",
            "startstr": "Sun Oct 25 14:28:24 2015",
            "version": "6.40",
            "xmloutputversion": "1.04"
        },
        "scaninfo": [
            {
                "$": {
                    "type": "connect",
                    "protocol": "tcp",
                    "numservices": "1024",
                    "services": "1-1024"
                }
            }
        ],
        "verbose": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "debugging": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "host": [
            {
                "$": {
                    "starttime": "1445783304",
                    "endtime": "1445784256"
                },
                "status": [
                    {
                        "$": {
                            "state": "up",
                            "reason": "conn-refused",
                            "reason_ttl": "0"
                        }
                    }
                ],
                "address": [
                    {
                        "$": {
                            "addr": "172.17.190.107",
                            "addrtype": "ipv4"
                        }
                    }
                ],
                "hostnames": [
                    "\n"
                ]
            }
        ],
        "runstats": [
            {
                "finished": [
                    {
                        "$": {
                            "time": "1445784256",
                            "timestr": "Sun Oct 25 14:44:16 2015",
                            "elapsed": "952.48",
                            "summary": "Nmap done at Sun Oct 25 14:44:16 2015; 16 IP addresses (1 host up) scanned in 952.48 seconds",
                            "exit": "success"
                        }
                    }
                ],
                "hosts": [
                    {
                        "$": {
                            "up": "1",
                            "down": "15",
                            "total": "16"
                        }
                    }
                ]
            }
        ]
    },
    "172.17.190.209-224": {
        "$": {
            "scanner": "nmap",
            "args": "nmap --host-timeout=900s -T0 --max-retries 10 --ttl 200ms --scan-delay 10s --max-rate 30 -oX - -p1-1024 172.17.190.209-224",
            "start": "1445783304",
            "startstr": "Sun Oct 25 14:28:24 2015",
            "version": "6.40",
            "xmloutputversion": "1.04"
        },
        "scaninfo": [
            {
                "$": {
                    "type": "connect",
                    "protocol": "tcp",
                    "numservices": "1024",
                    "services": "1-1024"
                }
            }
        ],
        "verbose": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "debugging": [
            {
                "$": {
                    "level": "0"
                }
            }
        ],
        "host": [
            {
                "$": {
                    "starttime": "1445783304",
                    "endtime": "1445784227"
                },
                "status": [
                    {
                        "$": {
                            "state": "up",
                            "reason": "conn-refused",
                            "reason_ttl": "0"
                        }
                    }
                ],
                "address": [
                    {
                        "$": {
                            "addr": "172.17.190.209",
                            "addrtype": "ipv4"
                        }
                    }
                ],
                "hostnames": [
                    "\n"
                ]
            },
            {
                "$": {
                    "starttime": "1445783304",
                    "endtime": "1445784254"
                },
                "status": [
                    {
                        "$": {
                            "state": "up",
                            "reason": "conn-refused",
                            "reason_ttl": "0"
                        }
                    }
                ],
                "address": [
                    {
                        "$": {
                            "addr": "172.17.190.212",
                            "addrtype": "ipv4"
                        }
                    }
                ],
                "hostnames": [
                    "\n"
                ]
            },
            {
                "$": {
                    "starttime": "1445783304",
                    "endtime": "1445784251"
                },
                "status": [
                    {
                        "$": {
                            "state": "up",
                            "reason": "conn-refused",
                            "reason_ttl": "0"
                        }
                    }
                ],
                "address": [
                    {
                        "$": {
                            "addr": "172.17.190.215",
                            "addrtype": "ipv4"
                        }
                    }
                ],
                "hostnames": [
                    "\n"
                ]
            },
            {
                "$": {
                    "starttime": "1445783304",
                    "endtime": "1445784235"
                },
                "status": [
                    {
                        "$": {
                            "state": "up",
                            "reason": "conn-refused",
                            "reason_ttl": "0"
                        }
                    }
                ],
                "address": [
                    {
                        "$": {
                            "addr": "172.17.190.216",
                            "addrtype": "ipv4"
                        }
                    }
                ],
                "hostnames": [
                    "\n"
                ]
            },
            {
                "$": {
                    "starttime": "1445783304",
                    "endtime": "1445785124"
                },
                "status": [
                    {
                        "$": {
                            "state": "up",
                            "reason": "conn-refused",
                            "reason_ttl": "0"
                        }
                    }
                ],
                "address": [
                    {
                        "$": {
                            "addr": "172.17.190.220",
                            "addrtype": "ipv4"
                        }
                    }
                ],
                "hostnames": [
                    "\n"
                ]
            },
            {
                "$": {
                    "starttime": "1445783304",
                    "endtime": "1445785137"
                },
                "status": [
                    {
                        "$": {
                            "state": "up",
                            "reason": "conn-refused",
                            "reason_ttl": "0"
                        }
                    }
                ],
                "address": [
                    {
                        "$": {
                            "addr": "172.17.190.222",
                            "addrtype": "ipv4"
                        }
                    }
                ],
                "hostnames": [
                    "\n"
                ]
            }
        ],
        "runstats": [
            {
                "finished": [
                    {
                        "$": {
                            "time": "1445785137",
                            "timestr": "Sun Oct 25 14:58:57 2015",
                            "elapsed": "1832.48",
                            "summary": "Nmap done at Sun Oct 25 14:58:57 2015; 16 IP addresses (6 hosts up) scanned in 1832.48 seconds",
                            "exit": "success"
                        }
                    }
                ],
                "hosts": [
                    {
                        "$": {
                            "up": "6",
                            "down": "10",
                            "total": "16"
                        }
                    }
                ]
            }
        ]
    }
}
```

## contributing ##

Contributions are welcome & appreciated. Refer to the [contributing document](https://github.com/jas-/node-libnmap/blob/master/CONTRIBUTING.md)
to help facilitate pull requests.

## license ##

This software is licensed under the [MIT License](https://github.com/jas-/node-libnmap/blob/master/LICENSE).

Copyright Jason Gerfen, 2013-2015.
