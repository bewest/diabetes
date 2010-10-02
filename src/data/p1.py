#!/usr/bin/python

import sys

import datetime

def proc_line( line ):
  line = line.strip( )
  return line

def process_file( name ):
  if name == '-':
    F = sys.stdout
  F = open( name, 'r' )
  lines = [ proc_line( L ) for L in F.readlines( ) ]
  return lines

if __name__ == '__main__':
  print "Hello World"
  print sys.argv[1]
  print "\n".join( process_file( sys.argv[1] ) )

#####
# EOF
