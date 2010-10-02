#!/usr/bin/python

import dateutil.parser
import sys
import time, datetime
import CairoPlot
import cairo
import json
import string
from contextlib import contextmanager

data = {}



@contextmanager
def data_stream( name='-' ):
  if name == '-':
    yield sys.stdin
  stream = open( name, 'r' )
  yield stream
  stream.close( )
  
def iter_data( stream ):
  for line in stream.readlines( ):
    if line.startswith( '# ' ) is not True:
      yield line
  raise StopIteration( stream )

def get_data( stream ):
  for datum in iter_data( stream ):
    P = map( string.strip, datum.split( ) )
    print P
    print dateutil.parser.parse( "T".join( P[ 0:2 ] ) )
    #data[ 
    #data[ P[0:2] ] = P[2]
  return data


if __name__ == '__main__':
  print "Generate a chart of a timeseries."
  with data_stream( sys.argv[ 1 ] ) as stream:
    print json.dumps( get_data( stream ) )
  

#####
# EOF
