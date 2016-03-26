{
  "targets": [
    {
      "target_name": "libpcap",
      "type": "static_library",
      "variables": {
        "cwd": "<!(pwd)",
        "path": "../../src/nmap/libpcap/",
        "ldpath": "<(cwd)build/src/gyp/"
      },
      "include_dirs": [
        "<(path)"
      ],
      "sources": [
        "<(path)bpf_dump.c,"
        "<(path)bpf_image.c,"
        "<(path)dlpisubs.c,"
        "<(path)etherent.c,"
        "<(path)fad-getad.c,"
        "<(path)fad-gifc.c,"
        "<(path)fad-glifc.c,"
        "<(path)fad-null.c,"
        "<(path)fad-sita.c,"
        "<(path)fad-win32.c,"
        "<(path)gencode.c,"
        "<(path)grammar.c,"
        "<(path)inet.c,"
        "<(path)nametoaddr.c,"
        "<(path)optimize.c,"
        "<(path)pcap-bpf.c,"
        "<(path)pcap-bt-linux.c,"
        "<(path)pcap-bt-monitor-linux.c,"
        "<(path)pcap-can-linux.c,"
        "<(path)pcap-canusb-linux.c,"
        "<(path)pcap-common.c,"
        "<(path)pcap-dag.c,"
        "<(path)pcap-dbus.c,"
        "<(path)pcap-dlpi.c,"
        "<(path)pcap-dos.c,"
        "<(path)pcap-enet.c,"
        "<(path)pcap-libdlpi.c,"
        "<(path)pcap-linux.c,"
        "<(path)pcap-netfilter-linux.c,"
        "<(path)pcap-nit.c,"
        "<(path)pcap-null.c,"
        "<(path)pcap-pf.c,"
        "<(path)pcap-septel.c,"
        "<(path)pcap-sita.c,"
        "<(path)pcap-snf.c,"
        "<(path)pcap-snit.c,"
        "<(path)pcap-snoop.c,"
        "<(path)pcap-usb-linux.c,"
        "<(path)pcap-win32.c,"
        "<(path)pcap.c,"
        "<(path)savefile.c,"
        "<(path)scanner.c,"
        "<(path)sf-pcap-ng.c,"
        "<(path)sf-pcap.c,"
        "<(path)version.c,"
      ],
      "conditions": [
        ['OS=="linux"', {
          "libraries":[
            "<(cwd)/<(ldpath)"
          ],
          "cflags": [
            "-w",
            "-g",
            "-O2",
            "-Wall",
            "-Wextra",
            "-Werror",
            "-Wmissing-prototypes",
            "-Wstrict-prototypes",
            "-Wl,--whole-archive"
          ],
        }]
      ]
    }
  ]
}