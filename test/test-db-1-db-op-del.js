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

  it( 'get db', async () => {
    db = await client.db( TEST_DB )
    assert.equal( db._error, null )
  })


  it( 'delCollection', async () => {
    let result = await db.dropCollection( 'mocha-1' )
    assert.equal( result._error, null )
  })
  

  it( 'drop db', async () => {
    let result = await db.dropDatabase()
    assert.equal( result._error, null )
  })


})