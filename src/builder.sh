#!/bin/bash

#
# libnmap
# Copyright(c) 2013-2016 Jason Gerfen <jason.gerfen@gmail.com>
# License: MIT
#

# Set our base directory
base="$(pwd)"

# Set the path
cwd="$(pwd)/nmap/"

# Array of dependencies
deps=(nbase nsock libdnet-stripped liblinear liblua libnetutil libpcap libpcre macosx mswin32 ncat ndiff nmap-update nping nselib zenmap)

# Iterate ${deps[@]} & configure
for dep in "${deps[@]}"; do

  path=${cwd}${dep}

  if [ ! -d ${path} ]; then
    echo "${path} is not a directory, skipping..."
    break
  fi

  cd ${path}
  
  if [ ! -f configure ]; then
    if [[ ! -f configure.ac ]] && [[ -d src/ ]]; then
      cd src/
    fi
    echo "Setting up autoconf for ${dep}..."
    autoconf 1>/dev/null
  fi

  if [ -f configure ]; then
    echo "Configuring ${dep}..."
    ./configure 1>/dev/null
  fi

  if [ ! -f Makefile ]; then
    if [[ ! -f Makefile.in ]] && [[ -d src/ ]]; then
      cd src/
    fi
    echo "Setting up automake for ${dep}..."
    automake -a 1>/dev/null
  fi

  if [ -f Makefile ]; then
    echo "Setting up autoconf for ${dep}..."
    make 1>/dev/null
  fi
done

cd ${base}