{
  "targets": [
    {
      "target_name": "nbase",
      "type": "shared_library",
      "variables": {
        "path": "src/nmap/nbase/"
      },
      "sources": [
        "<(path)nbase_winunix.c",
        "<(path)getaddrinfo.c",
        "<(path)nbase_str.c",
        "<(path)nbase_misc.c",
        "<(path)nbase_time.c",
        "<(path)inet_pton.c",
        "<(path)inet_ntop.c",
        "<(path)strcasecmp.c",
        "<(path)nbase_rnd.c",
        "<(path)nbase_memalloc.c",
        "<(path)test/test-escape_windows_command_arg.c",
        "<(path)getopt.c",
        "<(path)snprintf.c",
        "<(path)getnameinfo.c",
        "<(path)nbase_addrset.c",
      ],
      "include_dirs" : [
        "<(path)",
      ],
      "conditions": [
        ['OS=="linux"', {
          "cflags": [
            "-ggdb",
            "-fPIC",
            "-std=gnu99",
          ]
        }]
      ]
    }
  ]
}