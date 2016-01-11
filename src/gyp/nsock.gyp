{
  "targets": [
    {
      "target_name": "nsock",
      "type": "shared_library",
      "variables": {
        "cwd": "<!(pwd)",
        "path": "src/nmap/nsock/src/",
        "inc": "src/nmap/nsock/include/"
      },
      "sources": [
        "<(path)nsock_engines.c",
        "<(path)engine_epoll.c",
        "<(path)engine_select.c",
        "<(path)engine_poll.c",
        "<(path)nsock_core.c",
        "<(path)error.c",
        "<(path)proxy_socks4.c",
        "<(path)netutils.c",
        "<(path)engine_kqueue.c",
        "<(path)nsock_ssl.c",
        "<(path)nsock_log.c",
        "<(path)nsock_pool.c",
        "<(path)nsock_event.c",
        "<(path)nsock_write.c",
        "<(path)filespace.c",
        "<(path)nsock_pcap.c",
        "<(path)nsock_iod.c",
        "<(path)nsock_proxy.c",
        "<(path)nsock_read.c",
        "<(path)proxy_http.c",
        "<(path)nsock_timers.c",
        "<(path)nsock_connect.c",
        "<(path)gh_heap.c",
      ],
      "include_dirs" : [
        "<(inc)",
      ],
      "conditions": [
        ['OS=="linux"', {
          "cflags": [
            "-ggdb",
            "-fPIC",
            "-std=gnu99",
          ],
        }]
      ]
    }
  ]
}