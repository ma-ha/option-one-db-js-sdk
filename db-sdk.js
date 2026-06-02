// (c) Markus E. Harms 2026
// https://github.com/ma-ha/

const log   = require( 'npmlog' )
const axios = require( 'axios' )
const http  = require( 'http' )
const https = require( 'https' )

// for attachment upload
const FormData = require('form-data')
const fs = require( 'fs' )

//-----------------------------------------------------------------------------

class DbClient {
  dbURL = null
  dbOptions = null 
  connectOK = false 
  api = null 

  constructor ( url, options ) {
    this.dbURL     = url
    this.dbOptions = options
    this.api = new APIClient( url, options )
  }

  async connect() { // dummy
    return {}
  }

  async db( dbName ) {
    let dbList = await this.api.GET( '/db' )
    if ( dbList._error ) { 
      log.warn( 'ERROR: List DBs', dbList._error )
      return dbList 
    }
    if ( dbList.includes( dbName ) ) {
      return new Db( this.dbURL, dbName, this.dbOptions )
    }
    // try to create the DB
    let dbResult = await this.api.POST( '/db', { name: dbName } )
    if ( dbResult._error ) { 
      log.warn( 'ERROR: create DB', dbResult._error )
      return dbResult 
    }
    return new Db( this.dbURL, dbName, this.dbOptions )
  } 

}

module.exports = {
  DbClient
}

//-----------------------------------------------------------------------------

class Db {
  $url     = null
  $dbOpts  = null 
  $db      = null
  $api     = null 

  constructor ( url, db, options ) {
    this.$url    = url
    this.$dbOpts = options
    this.$db     = db
    this.$api    = new APIClient( url, options )
    // TODO add all collections - should i ?
  }

  databaseName() {
    return this.$db
  }

  async createCollection( coll, options = {} ) {
    if ( ! validName( coll ) ) { return { _error: 'Invalid collection name' } }
    let dta = {
      collection: coll, 
      options: ( options ? options : {} )
    }
    let result = await this.$api.POST( '/db/' + this.$db, dta )
    if ( result._error ) { 
      log.warn( 'ERROR: Create collection', result )
    }
    return result 
  }


  async collection( coll, options = {} ) {
    if ( ! validName( coll ) ) { return { _error: 'Invalid collection name' } }
    let dta = {
      collection: coll, 
      options: ( options ? options : {} )
    }
    let collArr = await this.collections()
    if ( collArr._error || ! Array.isArray( collArr )) { 
      log.warn( 'ERROR: Get all collections', collArr )
      return { _error: 'get collections failed' } 
    }
    if ( collArr.indexOf( coll ) == -1 ) {
      return { _error: 'Collection "'+coll+'" does not exist' } 
    }
    return new Collection( this.$url, this.$db, this.$dbOpts, coll, options ) 
  }


  async collections( options = {} ) {
    let result = await this.$api.GET( '/db/' + this.$db, { options: options } )
    if ( result._error ) { 
      log.warn( 'ERROR: Get all collections', result )
    }
    return result 
  }


  async dropCollection( coll, options  = {} ) {
    if ( ! validName( coll ) ) { return { _error: 'Invalid collection name' } }
    let dbResult = await this.$api.DELETE( '/db/' + this.$db +'/'+ coll +'/collection' )
    return dbResult
  }

  async dropDatabase( options  = {} ) {
    let dbResult = await this.$api.DELETE( '/db/' + this.$db )
    return dbResult
  }
}

//-----------------------------------------------------------------------------

class Collection {
  url      = null
  dbOpts   = null 
  db       = null
  coll     = null
  collOpts = null
  api      = null 
  dbColl   = null

  constructor ( url, db, dbOptions, coll, options ) {
    this.url     = url
    this.dbOpts  = dbOptions
    this.db      = db
    this.coll    = coll
    this.dbColl  = '/db/'+ db +'/'+ coll
    this.collOps = options
    this.api     = new APIClient( url, dbOptions )
  }


  async createIndex( field, options = {} ) {
    if ( ! validName( field ) ) { return { _error: 'Invalid index field name' } }
    let result = await this.api.POST( this.dbColl + '/index/' + field, { options: options } )
    if ( result._error ) { 
      log.verbose( 'ERROR: Create index', result )
    }
    return result 
  }

  async dropIndex( field ) {
    if ( ! validName( field ) ) { return { _error: 'Invalid index field name' } }
    let result = await this.api.DELETE( this.dbColl + '/index/' + field)
    if ( result._error ) { 
      log.verbose( 'ERROR: Drop index', result )
    }
    return result 
  }

  async listIndexes( options = {} ) {
    let result = await this.api.GET( this.dbColl + '/index', { options: options } )
    if ( result._error ) { 
      log.verbose( 'ERROR: listIndexes', result )
    }
    return result 
 
  }

  async insertOne( doc, options = {} ) {
    let result = await this.api.POST( this.dbColl, { doc: doc, options: options } )
    if ( result._error ) { 
      log.verbose( 'ERROR: insertOne', result )
    }
    return result 
  }

  async insertMany( docArr, options = {} ) {
    let result = await this.api.POST( this.dbColl, { doc: docArr, options: options } )
    if ( result._error ) { 
      log.verbose( 'ERROR: insertMany', result )
    }
    log.verbose( 'insertMany', result )
    return result 
  }


  find( filter = {}, projection = {}, options = {} ) {
    let cursor = new Cursor( this, filter, projection, options  )
    return cursor
  }

  async findOne( filter, options = {} ) {
    options.one = true
    let result = {}
    
    if ( filter._id ) {
      result = await this.api.GET( this.dbColl +'/'+ filter._id, {options: options } )
    } else {
      result = await this.api.GET( this.dbColl, { query: filter, options: options } )
    }
    
    if ( result._error ) { 
      log.verbose( 'ERROR: findOne', result )
      return result
    } else {
      if ( result.dataLength > 1 ) { 
        result._ok = false
        result._error = 'Found '+ result.dataLength
      }
    }
    log.verbose( 'find result', result )
    return result.data[0]
  }


  async findOneAndDelete( filter, options = {} ) {
    options.one = true
    log.warn( 'Collection: TODO findOneAndDelete not implemented' )
    return { _error: 'TODO'}
  }

  async findOneAndReplace( filter,replacement, options = {} ) {
    options.one = true
    log.warn( 'Collection: TODO findOneAndReplace not implemented' )
    return { _error: 'TODO'}
  }

  async findOneAndUpdate( filter, update, options = {} ) {
    options.one = true
    log.warn( 'Collection: TODO findOneAndUpdate not implemented' )
    return { _error: 'TODO'}
  }

  async countDocuments( filter ) {
    let result = await this.api.GET( this.dbColl + '/count', { query :filter } )
    if ( ! result._error ) {
      return result.count
    } else {
      return result
    }
  }

  async replaceOne( doc, options = {} ) {
    if ( ! doc._id ) { return { _error : 'doc._id is required' } }
    let result = await this.api.PUT( this.dbColl +'/'+ doc._id, doc )
    return result
  }

  async updateOne( filter, update, options = {} ) {
    log.verbose( 'updateOne', this.dbColl, filter, update )
    options.one = true
    let result = await this.api.PUT( this.dbColl, { filter: filter, update: update, options: options } )
    log.verbose( 'updateOne', result )
    return result
  }

  async updateMany( filter, update, options = {} ) {
    log.verbose( 'updateMany', this.dbColl, filter, update )
    let result = await this.api.PUT( this.dbColl, { filter: filter, update: update, options: options } )
    log.verbose( 'updateMany', result )
    return result 
  }

  async deleteOne( filter, options = {} ) {
    log.verbose( 'deleteOne', this.dbColl, filter, )
    options.one = true
    let result = await this.api.DELETE( this.dbColl, { filter: filter, options: options } )
    log.verbose( 'deleteOne', result )
    return result
  }

  async deleteMany( filter, options = {} ) {
    log.verbose( 'deleteMany', this.dbColl, filter, )
    let result = await this.api.DELETE( this.dbColl, { filter: filter, options: options } )
    log.verbose( 'deleteMany', result )
    return result
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  /** Attach file or update attachment for a document in this collection. 
   * You can pass the file content as Buffer. If its null,it will (try to) read the file. */
  async attachFile( docId, label, filename, buffer = null, mimeType ) {
    log.verbose( 'attachFile', this.dbColl, docId )
    let result = null
    try {
      const URL = this.dbColl + '/' + docId + '/attachment?label=' + label
      if ( buffer && Buffer.isBuffer( buffer ) ) {

        const attachment = new FormData()
        attachment.append( "file", buffer, {
          filename: filename,
          contentType: mimeType,
          knownLength: buffer.length,
        })
        result = await this.api.POST( URL, attachment )

      } else {

        const attachment = new FormData();
        attachment.append( 'file', fs.createReadStream( filename ) )
        result = await this.api.POST( URL, attachment )

      }
    } catch ( exc ) {
      log.verbose( 'attachFile', exc )
      result = { _error: exc.message }
    }
    log.verbose( 'attachFile', result )
    return result
  }

  async listAttachments( docId ) {
    log.verbose( 'attachFile', this.dbColl, docId )
    const URL = this.dbColl + '/' + docId + '/attachment'
    let result = await this.api.GET( URL )
    log.verbose( 'attachFile', result )
    return result
  }

  async getAttachment( docId, fileName ) {
    log.verbose( 'attachFile', this.dbColl, docId )
    const URL = this.dbColl + '/' + docId + '/attachment/' + fileName
    let result = await this.api.GET( URL )
    log.verbose( 'attachFile', result )
    return result
  }

  async deleteAttachment( docId, fileName ) {
    log.verbose( 'attachFile', this.dbColl, docId )
    const URL = this.dbColl + '/' + docId + '/attachment/' + fileName
    let result = await this.api.DELETE( URL )
    log.verbose( 'attachFile', result )
    return result
  }
}

//-----------------------------------------------------------------------------

class APIClient {
  dbURL = null
  dbUrlArr = []
  dbOptions = null 
  
  constructor ( url, options = {} ) {
    if ( url instanceof Array ) {
      this.dbUrlArr = url
    } else {
      this.dbURL = url
    }
    this.dbOptions = options
  }

  getReqURL( path ) {
    if ( this.dbURL ) {
      return  this.dbURL + path
    }
    let randomIdx =  Math.floor( Math.random() * this.dbUrlArr.length )
    let url = this.dbUrlArr[ randomIdx ]
    // log.info( 'URL', this.dbUrlArr.length, randomIdx, url )
    return url + path
  }

  getReqCfg() {
    let reqCfg = {}
    if ( this.dbOptions.accessId && this.dbOptions.accessKey ) {
      reqCfg.headers = {}
      reqCfg.headers.accessid  = this.dbOptions.accessId 
      reqCfg.headers.accesskey = this.dbOptions.accessKey 
    }
    reqCfg.httpAgent  = new http.Agent({ keepAlive: true })
    reqCfg.httpsAgent = new https.Agent({ keepAlive: true })
    return reqCfg
  }

  async GET( path, params) {
    try {
      let getOpt = this.getReqCfg()
      if ( params ){ getOpt.params = params }
      let url = this.getReqURL( path )
      log.verbose( 'GET '+ url, getOpt )
      const res = await axios.get( url, getOpt )
      log.verbose( 'GET res', res.statusText )
      if ( res.status >= 400 ) {
        log.verbose( 'GET error code', url, res )
        return { _error: res.status }
      } else {
        log.verbose( 'GET '+ url, res )
        return res.data 
      }
    } catch( exc ) { 
      log.verbose( 'GET', exc.message  ) 
      return { _error: exc.message }
    } 
  } 

  async POST( path, data ) {
    let txnId = dbgStart( 'POST' )
    try {
      let url = this.getReqURL( path )
      let reqCfg = this.getReqCfg()
      log.verbose( 'POST '+ url, data )
      const res = await axios.post( url, data, reqCfg )
      log.verbose( 'POST res', res.statusText )
      dbgEnd( 'POST', txnId )
      if ( data.options?.printDebugTimes ) { dbgPrint() }
      if ( res.status >= 400 ) {
        log.verbose( 'POST error code', url, res )
        return { _error: res.status }
      } else {
        log.verbose( 'POST '+ url, res.data )
        return res.data 
      }
    } catch( exc ) { 
      log.info( 'POST', exc.message  ) 
      dbgEnd( 'POST', txnId )
      return { _error: exc.message }
    } 
  }

  async PUT( path, data ) {
    try {
      let url = this.getReqURL( path )
      let reqCfg = this.getReqCfg()
      log.verbose( 'PUT '+ url, data )
      const res = await axios.put( url, data, reqCfg )
      log.verbose( 'PUT res', res.statusText )
      if ( res.status >= 400 ) {
        log.verbose( 'PUT error code', url, res )
        return { _error: res.status }
      } else {
        log.verbose( 'PUT '+ url, res.data )
        return res.data 
      }
    } catch( exc ) { 
      log.verbose( 'PUT', exc.message  ) 
      return { _error: exc.message }
    } 
  }

  async DELETE( path, params ) {
    log.verbose( 'DELETE', path )
    return new Promise( ( resolve, reject ) => {
      let url = this.getReqURL( path )
      let reqCfg = this.getReqCfg()
      if ( params ){ reqCfg.params = params }
      axios.delete( url, reqCfg ).then( req => {
        if ( req.request.res.statusCode >= 300 ) {
          log.verbose( 'DELETE error code', url, req.request.res )
          resolve({ _error: req.request.res.statusMessage })
        } else {
          log.verbose( 'DELETE '+ url, req.data )
          resolve( req.data )
        }
      }).catch( error => {
        log.error( 'DELETE error', url, error.message )
        resolve({ _error:error.message })
      })
    })
  }

}


class Cursor {
  cursorId   = null
  cursorPos  = 0 
  _error     = null
  filter     = null
  projection = null
  options    = null
  collection = null

  constructor ( coll, filter, projection, options ) {
    this.collection = coll
    this.filter     = filter
    this.projection = projection
    this.options    = options
  }

  async hasNext() {

  }
  
  async next() {
    
  }

  async forEach() {

  }

  async toArray() {
    log.verbose( 'filter',  JSON.stringify(this.filter ))
    let result = await this.collection.api.GET( 
      this.collection.dbColl, 
      { query      : JSON.stringify( this.filter ), 
        projection : this.projection,
        options    : this.options } 
    )
    if ( result._error ) { 
      log.warn( 'ERROR: toArray', result._error )
      return { error: result.error +'' }
    }
    if ( result._ok ) {
      return result.data
    } else {
      return { error: 'result not ok' }
    }
  }
}

//-----------------------------------------------------------------------------

function validName( name ) {
  if ( ! /^[a-zA-Z0-9-]+$/.test( name ) ) {
    return false
  } else {
    return true
  }
}


//=============================================================================

let dbgTimes = {}
let dbgTxnTS = {}

function dbgStart( method ) {
  let  txnId = 't'+ Math.random()
  dbgTxnTS[ txnId ] = Date.now()
  return txnId
}

function dbgEnd( method, txnId ) {
  let now = Date.now()
  if ( dbgTxnTS[ txnId ] ) {
    if ( ! dbgTimes[ method ] ) { dbgTimes[ method ] = { sum_ms: 0, cnt: 0 } }
    dbgTimes[ method ].sum_ms += now - dbgTxnTS[ txnId ] 
    dbgTimes[ method ].cnt ++
    delete dbgTxnTS[ txnId ]
  }
}

function dbgPrint() {
  console.log( 'dbgTimes', dbgTimes )
  dbgTimes = {}
  dbgTxnTS = {}
}