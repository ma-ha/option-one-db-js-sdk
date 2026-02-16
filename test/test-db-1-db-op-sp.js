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
    let result = await client.connect()
    assert.equal( result._error, null )
    db = await client.db( TEST_DB )
    assert.equal( db._error, null )  
  })


  it( 'find equal', async () => {
    // let mochaColl = await db.collection( 'mocha-1' )
    // // console.log( 'coll', mochaColl )
    // assert.equal( mochaColl._error, null )
    // let cursor = mochaColl.find({ name: 'Tim' })
    // let result = await cursor.toArray()
    // console.log( 'find equal', result.length )
    // assert.equal( result.error, undefined )
    // assert.notEqual( result.length, 0 )
  })



})