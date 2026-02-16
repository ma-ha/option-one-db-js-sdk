const assert = require( 'assert' )

const { DbClient } = require( '../db-sdk' )

const TEST_DB = 'mocha-test-db1'

describe( 'Test DB: Create', () => { 

  let client = null
  let db = null

  before( async () => {
    client = new DbClient(
      'http://localhost:9000/db',
      { accessId: process.env.DB_ACCESS_ID, accessKey: process.env.DB_ACCESS_KEY }
    )
  })

  it( 'client connect', async () => {
    let result = await client.connect()
    assert.equal( result._error, null )
  })

  it( 'create db', async () => {
    db = await client.db( TEST_DB )
    assert.equal( db._error, null )
  })

  // it( 'databaseName', async () => {
  //   let name = db.databaseName()
  //   assert.equal( name, TEST_DB )
  // })

  it( 'createCollection', async () => {
    let result = await db.createCollection( 'mocha-1', { primaryKey: ['xy'] } )
    assert.equal( result._error, null )
  })
  
  it( 'createIndex', async () => {
    let coll = await db.collection( 'mocha-1' )
    let result = await coll.createIndex( 'abc' )
    assert.equal( result._error, null )
  })
  
  // let mochaColl = null
  // it( 'get collection' , async () => {
  //   mochaColl = await db.collection( 'mocha-1' )
  //   assert.equal( mochaColl._error, null )
  // })

  // it( 'get all collections', async () => {
  //   let result = await db.collections( )
  //   assert.equal( result._error, null )
  //   assert.equal( result[0], 'mocha-1' )
  // })

  // it( 'drop db', async () => {
  //   let result = await db.dropDatabase()
  //   assert.equal( result._error, null )
  // })


})