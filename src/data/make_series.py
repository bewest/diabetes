#!/usr/bin/python

import dateutil.parser
import sys
import time, datetime
import CairoPlot
import cairo
import json
import string
import itertools
from contextlib import contextmanager
from pprint import pformat

import logging
logging.basicConfig( stream=sys.stdout )
log = logging.getLogger( 'data.timseries.hacking' )
log.setLevel( logging.DEBUG )

log.debug( 'hello world' )
data = {}


class DefaultRecord( object ):
  __fields__ = [ 'date', 'time', 'reading' ]
  def __init__( self, header=[] ):
    self.header = header

  def decode( self, raw ):
    P       = map( string.strip, raw.split( ) )
    date    = dateutil.parser.parse( "T".join( P[ 0:2 ] ) )
    reading = P[ 2 ]

def RecordFactory( object ):
  def __init__( self, header ):
    self.header = header

  def decodeFields( self ):
    if self.header.startswith( '# ' ):
      if self.header[3:].split( ) == 3:
        pass


class InvalidRecord( Exception ): pass

@contextmanager
def data_stream( name='-' ):
  if name == '-':
    yield sys.stdin
  stream = open( name, 'r' )
  try:
    yield stream
  except InvalidRecord, e:
    log.error( 'error %r' % ( e ) )
    yield stream
  stream.close( )
  
def iter_data( stream ):
  for x, line in itertools.izip( itertools.count( ),
                                 stream.readlines( ) ):
    if line.startswith( '# ' ) is not True:
      yield line
  raise StopIteration( stream )

def get_data( stream ):
  # TODO: sensitivity to timezones!
  for datum in iter_data( stream ):
    P = map( string.strip, datum.split( ) )
    try:
      date = dateutil.parser.parse( "T".join( P[ 0:2 ] ) )
      data[ date ] = int( P[2] )
    except IndexError, e:
      log.error( 'error %s' % ( e ) )

  return data


if __name__ == '__main__':
  print "Generate a chart of a timeseries."
  data = [[3,4], [4,8], [5,3], [9,1]]
  CairoPlot.bar_plot( 'bar4.svg', data, 600, 200,
                      border = 20, grid= True )
  data = {'teste00' : [27], 'teste01' : [10], 'teste02' : [18], 'teste03' : [5], 'teste04' : [1], 'teste05' : [22], 'teste06' : [31], 'teste07' : [8]}
  CairoPlot.bar_plot( 'bar3.svg', data, 600, 200,
                      border = 20, grid= True )
  with data_stream( sys.argv[ 1 ] ) as stream:
    data = get_data( stream )
    dataList = list( data.iteritems( ) )
    log.debug( pformat( data ) )
    #log.debug( pformat( dataList ) )
    #CairoPlot.bar_plot( 'sugars.svg', dataList, 500, 350,
    #                    border = 13
    #                  , grid   = True
    #                  , rounded_corners = True
    #                  )

  

#####
# EOF
