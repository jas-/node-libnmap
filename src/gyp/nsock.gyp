{
  "targets": [
    {
      "target_name": "nsock",
      "type": "static_library",
      "variables": {
        "cwd": "<!(pwd)",
        "path": "../../src/nmap/nsock/src/",
        "inc": "../../src/nmap/nsock/include/",
        "ldpath": "<(cwd)build/src/gyp/"
      },
      "sources": [
        "<(path)error.c",
        "<(path)gh_heap.c",
        "<(path)engine_epoll.c",
        "<(path)engine_kqueue.c",
        "<(path)engine_poll.c",
      ],
      "include_dirs" : [
        "<(inc)",
        "<(cwd)/<(ldpath)",
        "../../src/nmap/nbase/"
      ],
      "conditions": [
        ['OS=="linux"', {
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
              "-lcrypto",
              "<(cwd)/build/Release/nbase.a"
            ]
          }
        }]
      ]
    }
  ]
}