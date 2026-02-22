const assert = require( 'assert' )

const { DbClient } = require( '../db-sdk' )

const TEST_DB = 'mocha-test-db1'

describe( 'Test DB: Create', () => { 

  let client = null
  let db = null

  before( async () => {
    client = new DbClient(
      process.env.DB_URL,
      { accessId: process.env.DB_ADMIN_ACCESS_ID, accessKey: process.env.DB_ADMIN_ACCESS_KEY }
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

  it( 'databaseName', async () => {
    name = db.databaseName()
    assert.equal( name, TEST_DB )
  })

  it( 'createCollection invalid name ""', async () => {
    let result = await db.createCollection( '' )
    assert.notEqual( result._error, null )
  })

  it( 'createCollection invalid name "xz;xz"', async () => {
    let result = await db.createCollection( 'xz;xz' )
    assert.notEqual( result._error, null )
  })
  it( 'createCollection invalid name "xz/z"', async () => {
    let result = await db.createCollection( 'xz/z' )
    assert.notEqual( result._error, null )
  })
  it( 'createCollection invalid name "xz:xz"', async () => {
    let result = await db.createCollection( 'xz:xz' )
    assert.notEqual( result._error, null )
  })

  it( 'createCollection', async () => {
    let result = await db.createCollection( 'mocha-1', { primaryKey: ['xy'] } )
    assert.equal( result._error, null )
  })
  
  let mochaColl = null
  it( 'get collection' , async () => {
    mochaColl = await db.collection( 'mocha-1' )
    assert.equal( mochaColl._error, null )
  })

  it( 'get all collections', async () => {
    let result = await db.collections( )
    assert.equal( result._error, null )
    // assert.equal( result[0], 'mocha-1' )
  })

})