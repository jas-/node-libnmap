{
  "targets": [
    {
      "target_name": "libnmap",
      "type": "loadable_module",
      "variables": {
        "cwd": "<!(pwd)",
        "path": "src/",
        "ldpath": "build/Release",
        "sources": "<!(find <(path) -type f -name *.c)"
      },
      "sources": [
        "",
      ],
      "include_dirs" : [
        "<!(node -e \"require('nan')\")",
      ],
      "dependencies": [
        "<(path)gyp/nmap.gyp:nmap",
		  ],
      "conditions": [
        ['OS=="linux"', {
          "libraries":[
            "<(cwd)/<(ldpath)/nmap.so"
          ],
          "cflags": [
            "-ggdb",
            "-fPIC"
          ],
        }]
      ]
    }
  ]
}