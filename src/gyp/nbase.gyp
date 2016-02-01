{
  "targets": [
    {
      "target_name": "nbase",
      "type": "static_library",
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
      ],
      "conditions": [
        ['OS=="win"', {
          'defines': [
            'WIN32'
          ]
        }],
        ['OS=="linux"', {
          "libraries":[
            "<(cwd)/<(ldpath)"
          ],
          "cflags": [
            "-ggdb",
            "-fPIC",
            "-std=gnu99",
            "-w",
            "-g",
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