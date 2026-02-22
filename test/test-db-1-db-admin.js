const assert = require( 'assert' )

const { DbClient } = require( '../db-sdk' )

const TEST_DB = 'mocha-test-db2'
const TEST_COLL = 'test2' 

describe( 'Test DB: Create/Delete DB', () => { 

  let client = null
  let db = null

  before( async () => {
    client = new DbClient(
      process.env.DB_URL,
      { accessId: process.env.DB_ADMIN_ACCESS_ID, accessKey: process.env.DB_ADMIN_ACCESS_KEY }
    )
    let result = await client.connect()
    assert.equal( result._error, null )
  })

  it( 'create db', async () => {
    db = await client.db( TEST_DB )
    assert.equal( db._error, null )
  })

  it( 'createCollection', async () => {
    let result = await db.createCollection( TEST_COLL, { primaryKey: ['xy'] } )
    assert.equal( result._error, null )
  })

  it( 'delCollection', async () => {
    let result = await db.dropCollection( TEST_COLL )
    assert.equal( result._error, null )
  })
  
  it( 'drop db', async () => {
    let result = await db.dropDatabase()
    assert.equal( result._error, null )
  })

})