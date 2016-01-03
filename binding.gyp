{
  "targets": [
    {
      "target_name": "nmap",
      "type": "shared_library",
      "variables": {
        'path': 'src/nmap/',
      },
      "sources": [
        "",
      ],
      "include_dirs" : [
        "<(path)",
        "<(path)libdnet-stripped/",
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
        "<(path)nsock/",
        "<(path)zenmap/",
      ]
    },
    {
      "target_name": "libnmap",
      "type": "loadable_module",
      "variables": {
        'cwd': "<!(pwd)",
        'path': "src/",
        'ldpath': "build/Release",
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
          ],
        }],
      ],
    }
  ],
}

