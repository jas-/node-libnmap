{
  "variables": {
    "nmap_src": "src/nmap"
  },
  "target_defaults": {
    "xcode_settings": { "MACOSX_DEPLOYMENT_TARGET": "11.0" }
  },
  "targets": [
    {
      "target_name": "nmap",
      "sources": [ "src/addon.cc" ],
      "include_dirs": [
        "<(nmap_src)",
        "<(nmap_src)/nbase",
        "<(nmap_src)/nsock/include",
        "<(nmap_src)/libdnet-stripped/include",
        "<(nmap_src)/libpcap",
        "<(nmap_src)/liblua",
        "<(nmap_src)/liblinear",
        "<(nmap_src)/libz",
        "<(nmap_src)/libpcre/src"
      ],
      "defines": [ "HAVE_CONFIG_H" ],
      # Unmodified upstream nmap: scripts/build-nmap.js compiles it and prints the link inputs.
      "libraries": [ "<!@(node scripts/build-nmap.js)" ],
      "cflags_cc": [ "-fvisibility=hidden", "-w" ],
      "xcode_settings": {
        "OTHER_CPLUSPLUSFLAGS": [ "-w" ],
        "GCC_SYMBOLS_PRIVATE_EXTERN": "YES"
      },
      "conditions": [
        # The module must use its own zlib and Lua, not the symbols that the node binary exports.
        [ "OS=='linux'", {
          "ldflags": [ "-Wl,-Bsymbolic", "-Wl,--exclude-libs,ALL" ]
        }]
      ]
    }
  ]
}
