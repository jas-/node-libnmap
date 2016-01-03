{
  "targets": [
    {
      "target_name": "nmap",
      "type": "shared_library",
      "variables": {
        'path': 'src/nmap/',
        'sources': '<!(find <(path) -type f -name *.c)',
        'incs': '<!(find <(path) -type d -name lib*)'
      },
      "sources": [
        "<(sources)",
      ],
      "include_dirs" : [
        "<(incs)"
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
        "<(sources)",
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
          ],
        }],
      ],
    }
  ],
}