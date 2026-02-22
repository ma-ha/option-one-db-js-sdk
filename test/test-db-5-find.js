const assert = require( 'assert' )

const { DbClient } = require( '../db-sdk' )

const TEST_DB = 'mocha-test-db1'

describe( 'Test DB: Prep Find Data', () => { 

  let client = null
  let db = null
  let mochaColl = null

  before( async () => {
    client = new DbClient(
      process.env.DB_URL,
      { accessId: process.env.DB_ACCESS_ID, accessKey: process.env.DB_ACCESS_KEY }
    )
    let result = await client.connect()
    assert.equal( result._error, null )
    db = await client.db( TEST_DB )
    assert.equal( db._error, null )  
    mochaColl = await db.collection( 'mocha-find' )
    assert.equal( mochaColl._error, null )
  })

  it( 'find equal', async () => {
    let cursor = mochaColl.find({ f: 'ab' })
    let result = await cursor.toArray()
    console.log( 'find equal', result.length )
    assert.equal( result.error, undefined )
    assert.notEqual( result.length, 0 )
  })

  it( 'find equal sub', async () => {
    let cursor = mochaColl.find({ 's.f': 'ab' })
    let result = await cursor.toArray()
    console.log( 'find equal', result.length )
    assert.equal( result.error, undefined )
    assert.notEqual( result.length, 0 )
  })

  // it( 'find lt' /* , async () => {
  //   let cursor = mochaColl.find({ c: { $lt : 50} })
  //   let result = await cursor.toArray()
  //   assert.notEqual( result._ok, true )
  // } */)
  // it( 'find le'/* , async () => {
  //   let cursor = mochaColl.find({ c: { $le : 50} })
  //   let result = await cursor.toArray()
  //   assert.notEqual( result._ok, true )
  // } */)
  
  // it( 'find gt'/* , async () => {
  //   let cursor = mochaColl.find({ c: { $gt : 50} })
  //   let result = await cursor.toArray()
  //   assert.notEqual( result._ok, true )
  // } */)

  // it( 'find ge'/* , async () => {
  //   let cursor = mochaColl.find({ c: { $ge : 50} })
  //   let result = await cursor.toArray()
  //   assert.notEqual( result._ok, true )
  // } */)

})