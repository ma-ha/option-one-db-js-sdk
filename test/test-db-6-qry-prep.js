const assert = require( 'assert' )

const { DbClient } = require( '../db-sdk' )

const TEST_DB = 'mocha-test-db'

describe( 'Test DB: Prep Find Data', () => { 

  let client = null
  let db = null

  before( async () => {
    client = new DbClient(
      'http://localhost:9000/db',
      { accessId: process.env.DB_ACCESS_ID, accessKey: process.env.DB_ACCESS_KEY }
    )
    let result = await client.connect()
    assert.equal( result._error, null )
    db = await client.db( TEST_DB )
    assert.equal( db._error, null )  
  })

  let mochaColl = null

  it( 'createCollection', async () => {
    let result = await db.createCollection( 'mocha-qry1', { primaryKey: ['no'] } )
    assert.notEqual( result._ok, undefined )
  })



  it( 'connect tst-find', async () => {
    mochaColl = await db.collection( 'mocha-qry1' )
    assert.equal( mochaColl._error, null )
  })

  it( 'cre index "str"', async () => {
    let result = await mochaColl.createIndex( "str" ) 
    assert.notEqual( result._ok, undefined )
  })

  it( 'cre index "txt"', async () => {
    let result = await mochaColl.createIndex( "txt", { "msbLen":16 } ) 
    assert.notEqual( result._ok, undefined )
  })

  it( 'cre index "i"', async () => {
    let result = await mochaColl.createIndex( "i" ) 
    assert.notEqual( result._ok, undefined )
  })

  it( 'drop index "str"', async () => {
    let result = await mochaColl.dropIndex( "str" ) 
    console.log( result )
    assert.notEqual( result._ok, undefined )
  })
  
  it( 'insert doc 1', async () => { 
    let result = await mochaColl.insertOne({ 
      no: 10001, 
      str: 'test1', 
      txt: 'Bla bla',
      b: false,
      i: 123, 
      f: 12.34,
      sub : {
        str: 'test1', 
        txt: 'Bla bla',
        b: false,
        i: 123, 
        f: 12.34,
      }
    })
    assert.equal( result._ok, true )
  })

  it( 'insert doc 2', async () => {
    let result = await mochaColl.insertOne({ 
      no: 10002, 
      str: 'test2', 
      txt: 'Bla bla',
      b: true,
      i: 234, 
      f: 43.21,
      sub : {
        str: 'test2', 
        txt: 'Bla bla',
        b: true,
        i: 234, 
        f: 43.21,
      }
    })
    assert.equal( result._ok, true )
  })

  it( 'insert other docs', async () => {
    for ( let no of [11000,11001,11002,11003,11004,11005,11006,11007,11008,11009] ) {
      let result = await mochaColl.insertOne({ 
        no: no, 
        str: 'test '+no, 
        txt: 'Blubber',
        b: false,
        i: no, 
        f: 543.21,
        sub : {
          str: 'test '+no, 
          txt: 'Blubber',
          b: false,
          i: no, 
          f: 543.21,
        }
      })
      assert.equal( result._ok, true )
    }
  })

})