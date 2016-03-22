{
  "targets": [
    {
      "target_name": "nbase",
      "type": "static_library",
      "defines": [
        "HAVE_CONFIG_H",
        "NBASE_WINUNIX_H"
      ],
      "variables": {
        "cwd": "<!(pwd)",
        "path": "../../src/nmap/nbase/",
        "ldpath": "<(cwd)build/src/gyp/"
      },
      "include_dirs": [
        "<(path)"
      ],
      "sources": [
        "<(path)getopt.c",
        "<(path)nbase_memalloc.c",
        "<(path)nbase_str.c",
        "<(path)strcasecmp.c",
        "<(path)snprintf.c",
        "<(path)nbase_time.c",
        "<(path)nbase_misc.c",
        "<(path)nbase_addrset.c",
        "<(path)getaddrinfo.c",
        "<(path)nbase_rnd.c",
        "<(path)inet_pton.c",
      ],
      "conditions": [
        ['OS=="win"', {
          "defines": [
            "WIN32"
          ]
        }],
        ['OS=="linux"', {
          "defines": [
            "HAVE_NETDB_H",
            "HAVE_STRING_H",
            "HAVE_SYS_TYPES_H",
            "HAVE_SYS_SOCKET_H",
            "HAVE_NETDB_H",
            "HAVE_STRING_H",
            "HAVE_SYS_PARAM_H",
            "HAVE_SYS_TYPES_H",
            "HAVE_SYS_SELECT_H",
            "HAVE_UNISTD_H",
            "HAVE_SYS_STAT_H",
            "HAVE_INTTYPES_H"
          ],
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
          "link_settings": {
            "libraries": [
              "-lssl",
              "-lcrypto"
            ]
          }
        }]
      ]
    }
  ]
}