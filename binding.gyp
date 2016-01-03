{
  "targets": [
  {
    "target_name": "libnmap",
    "sources": [
      "libnmap.cc",
    ],
    "include_dirs" : [
      "<!(node -e \"require('nan')\")"
    ]
  }
  ],
}