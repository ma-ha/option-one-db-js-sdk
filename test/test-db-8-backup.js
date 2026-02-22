const assert = require( 'assert' )

const { DbClient } = require( '../db-sdk' )

const TEST_DB = 'mocha-test-db'

describe( 'Test DB: Delete', () => { 

  let client = null
  let db = null

  before( async () => {
    client = new DbClient(
      process.env.DB_URL,
      { accessId: process.env.DB_ACCESS_ID, accessKey: process.env.DB_ACCESS_KEY }
    )
    let result = await client.connect()
    assert.equal( result._error, null )
    db = await client.db( TEST_DB )
  })


  it( 'delete backup schedule' )
  it( 'cre backup schedule' )
  it( 'delete backup schedule' )

  it( 'backup all' )
  it( 'backup db' )
  it( 'backup db collection' )

  it( 'dropDatabase', async () => {
    let result = await db.dropDatabase( TEST_DB )
    assert.equal( result._error, null )
  })


})