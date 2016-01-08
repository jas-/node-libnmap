{
  "targets": [
    {
      "target_name": "nsock",
      "type": "shared_library",
      "variables": {
        'path': 'src/nmap/nsock/src/'
      },
      "sources": [
        "<(path)error.c",
        "<(path)proxy_socks4.c",
        "<(path)netutils.c",
        "<(path)engine_kqueue.c",
        "<(path)nsock_ssl.c",
        "<(path)nsock_log.c",
        "<(path)engine_epoll.c",
        "<(path)nsock_pool.c",
        "<(path)nsock_event.c",
        "<(path)nsock_write.c",
        "<(path)filespace.c",
        "<(path)nsock_pcap.c",
        "<(path)nsock_iod.c",
        "<(path)nsock_proxy.c",
        "<(path)nsock_read.c",
        "<(path)proxy_http.c",
        "<(path)nsock_timers.c",
        "<(path)nsock_connect.c",
        "<(path)engine_select.c",
        "<(path)engine_poll.c",
        "<(path)gh_heap.c",
        "<(path)nsock_engines.c",
        "<(path)nsock_core.c"
      ],
      "include_dirs" : [
        "<(path)../include",
      ],
    },
    {
      "target_name": "nmap",
      "type": "shared_library",
      "variables": {
        'path': 'src/nmap/',
        'sources': "<!(find <(path) -type f -name *.c -exec printf '%s\n' {} \;)",
        'incs': "<!(find <(path) -type d -name lib* -exec printf '%s\n' {} \;)"
      },
      "sources": [
        "<(path)osscan2.cc",
        "<(path)nse_lpeg.cc",
        "<(path)NmapOps.cc",
        "<(path)nmap.cc",
        "<(path)Target.cc",
        "<(path)scan_engine_connect.cc",
        "<(path)scan_engine_raw.cc",
        "<(path)NmapOutputTable.cc",
        "<(path)nse_ssl_cert.cc",
        "<(path)utils.cc",
        "<(path)nse_main.cc",
        "<(path)charpool.cc",
        "<(path)portlist.cc",
        "<(path)payload.cc",
        "<(path)timing.cc",
        "<(path)nmap_tty.cc",
        "<(path)service_scan.cc",
        "<(path)protocols.cc",
        "<(path)targets.cc",
        "<(path)FPEngine.cc",
        "<(path)nse_utility.cc",
        "<(path)xml.cc",
        "<(path)services.cc",
        "<(path)nse_openssl.cc",
        "<(path)traceroute.cc",
        "<(path)main.cc",
        "<(path)nse_dnet.cc",
        "<(path)nmap_error.cc",
        "<(path)tcpip.cc",
        "<(path)nse_fs.cc",
        "<(path)output.cc",
        "<(path)nse_bit.cc",
        "<(path)nse_nmaplib.cc",
        "<(path)MACLookup.cc",
        "<(path)nse_nsock.cc",
        "<(path)scan_engine.cc",
        "<(path)TargetGroup.cc",
        "<(path)idle_scan.cc",
        "<(path)FPModel.cc",
        "<(path)nmap-header-template.cc",
        "<(path)nmap_ftp.cc",
        "<(path)nse_binlib.cc",
        "<(path)nse_pcrelib.cc",
        "<(path)osscan.cc",
        "<(path)nse_debug.cc",
        "<(path)portreasons.cc",
        "<(path)FingerPrintResults.cc",
        "<(path)nmap_dns.cc"
      ],
      "include_dirs" : [
        "<(path)libdnet-stripped/include",
        "<(path)liblinear/",
        "<(path)liblua/",
        "<(path)libnetutil/",
        "<(path)libpcap/",
        "<(path)libpcre/",
        "<(path)macosx/",
        "<(path)mswin32/",
        "<(path)nbase/",
        "<(path)ncat/",
        "<(path)ndiff/",
        "<(path)nmap-update/",
        "<(path)nping/",
        "<(path)nselib/",
        "<(path)nsock/include",
        "<(path)zenmap/",
      ],
      "libraries" : [
        '-l libdnet', '-L<(path)libdnet-stripped',
        '-l liblinear', '-L<(path)liblinear/',
        '-l liblua', '-L<(path)liblua/',
        '-l libnetutil', '-L<(path)libnetutil/',
        '-l libpcap', '-L<(path)libpcap/',
        '-l libpcre', '-L<(path)libpcre/'
      ]
    },
    {
      "target_name": "libnmap",
      "type": "loadable_module",
      "variables": {
        'cwd': "<!(pwd)",
        'path': "src/",
        'ldpath': "build/Release",
        'sources': '<!(find <(path) -type f -name *.c)'
      },
      "sources": [
        "",
      ],
      "include_dirs" : [
        "<!(node -e \"require('nan')\")",
      ],
      "dependencies": [
        "nmap",
		  ],
      "conditions": [
        ['OS=="linux"', {
          "libraries":[
            "<(cwd)/<(ldpath)/nmap.so"
          ],
          "cflags": [
            "-ggdb",
            "-g"
          ]
        }]
      ]
    }
  ]
}