{
  "targets": [
    {
      "target_name": "nmap",
      "type": "shared_library",
      "variables": {
        "cwd": "<!(pwd)",
        "lpath": "nmap/",
        "path": "../../src/nmap/",
        "ldpath": "<(cwd)build/src/gyp/"
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
        "-L<(path)libdnet-stripped",
        "-L<(path)liblinear/",
        "-L<(path)liblua/",
        "-L<(path)libnetutil/",
        "-L<(path)libpcap/",
        "-L<(path)libpcre/"
      ],
      "dependencies": [
        "<(lpath)../libpcap.gyp:libpcap",
        "<(lpath)../nbase.gyp:nbase",
        "<(lpath)../nsock.gyp:nsock"
		  ],
      "conditions": [
        ['OS=="linux"', {
          "cflags": [
            "-fPIC",
            "-std=gnu99",
            "-w",
            "-g",
            "-O2",
            "-Wall",
            "-Wextra",
            "-Werror",
            "-Wl,--whole-archive"
          ],
          "link_settings": {
            "libraries": [
            ]
          }
        }]
      ]
    },
  ]
}