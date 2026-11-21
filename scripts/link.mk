# Compiles nmap as a static library and not as a program. nmap's own Makefile has the rules.
# Run from src/nmap: make -f ../../scripts/link.mk libnmap.a
include Makefile

# The same inputs as the nmap program, but without main.o and without the link step.
libnmap.a: build-netutil build-liblinear build-pcap build-zlib build-pcre build-nsock build-nbase build-dnet build-lua $(OBJS)
	rm -f $@
	$(AR) rcs $@ $(OBJS)

# Prints the libraries that the node module links.
libnmap-link:
	@echo libnmap.a
	@echo $(LDFLAGS) $(LIBS)
