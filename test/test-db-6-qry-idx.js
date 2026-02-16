const assert = require( 'assert' )

const { DbClient } = require( '../db-sdk' )

const TEST_DB = 'mocha-test-db'

describe( 'Test DB: Prep Find Data', () => { 

  let client = null
  let db = null
  let coll = null

  before( async () => {
    client = new DbClient( 
      'http://localhost:9000/db',
      { accessId: process.env.DB_ACCESS_ID, accessKey: process.env.DB_ACCESS_KEY }
    )
    let result = await client.connect()
    assert.equal( result._error, null )
    db = await client.db( TEST_DB )
    assert.equal( db._error, null )  
    coll = await db.collection( 'mocha-qry1' )
    assert.equal( coll._error, null )
  })

  // -------------------------------------------------------

  it( 'find equal', async () => {
    let cursor = coll.find({ str: 'test1' })
    let result = await cursor.toArray()
    //console.log( 'find equal', result )
    assert.equal( result.error, undefined )
    assert.equal( result.length, 1 )
    assert.equal( result[0].no, 10001 )
  })

  it( 'find equal sub', async () => {
    let cursor = coll.find({ 'sub.str': 'test2' })
    let result = await cursor.toArray()
    // console.log( 'find equal', result )
    assert.equal( result.error, undefined )
    assert.equal( result.length, 1 )
    assert.equal( result[0].no, 10002 )
  })

  it( 'find $lt' , async () => {
    let cursor = coll.find({ i: { $lt : 124 } })
    let result = await cursor.toArray()
    // console.log( 'find $lt', result )
    assert.equal( result.error, undefined )
    assert.equal( result.length, 1 )
    assert.equal( result[0].no, 10001 )
  })

  it( 'find $le' , async () => {
    let cursor = coll.find({ i: { $le : 123 } })
    let result = await cursor.toArray()
    // console.log( 'find $le', result )
    assert.equal( result.error, undefined )
    assert.equal( result.length, 1 )
    assert.equal( result[0].no, 10001 )
  })
  
  it( 'find $gt' , async () => {
    let cursor = coll.find({ i: { $gt : 11005 } })
    let result = await cursor.toArray()
    // console.log( 'find $gt', result )
    assert.equal( result.error, undefined )
    assert.equal( result.length, 4 )
  })

  it( 'find $ge' , async () => {
    let cursor = coll.find({ i: { $ge : 11008 } })
    let result = await cursor.toArray()
    assert.equal( result.error, undefined )
    assert.equal( result.length, 2 )
  })

  it( 'find $eq', async () => {
    let cursor = coll.find({ i: { $eq : 123 } })
    let result = await cursor.toArray()
    assert.equal( result.error, undefined )
    assert.equal( result.length, 1 )
    assert.equal( result[0].no, 10001 )
  })

  it( 'find $ne', async () => {
    let cursor = coll.find({ txt: { $ne : 'Blubber' } })
    let result = await cursor.toArray()
    assert.equal( result.error, undefined )
    assert.equal( result.length, 2 )
    assert.equal( result[0].no, 10001 )
  })

  it( 'find $in', async () => {
    let cursor = coll.find({ 'sub.i': { $in : [11005,11006] } })
    let result = await cursor.toArray()
    // console.log( 'find $in', result )
    assert.equal( result.error, undefined )
    assert.equal( result.length, 2 )
  })

  it( 'find $nin', async () => {
    let cursor = coll.find({ i: { $nin :  [11000,11001]  } })
    let result = await cursor.toArray()
    // console.log( 'find $nin', result )
    assert.equal( result.error, undefined )
    assert.equal( result.length, 10 )
  })

  it( 'find $like', async () => {
    let cursor = coll.find({ 'sub.txt': { $like : 'Bla' } })
    let result = await cursor.toArray()
    // console.log( 'find $nin', result )
    assert.equal( result.error, undefined )
    assert.equal( result.length, 2 )
  })

  // // - - -  - - -  - - -  - - -  - - -  - - -  - - -  - - -  - - -  - - - 

  it( 'find equal $and', async () => {
    let cursor = coll.find({ $and: [ { txt: 'Bla bla' }, { i : 123 } ] })
    let result = await cursor.toArray()
    // console.log( 'find $nin', result )
    assert.equal( result.error, undefined )
    assert.equal( result.length, 1 )
    assert.equal( result[0].no, 10001 )
  })

  it( 'find equal $not', async () => {
    let cursor = coll.find({ $not: [ { txt: 'Bla bla' }, { i : 11002 } ] })
    let result = await cursor.toArray()
    // console.log( 'find $nin', result )
    assert.equal( result.error, undefined )
    assert.equal( result.length, 9 )
  })

  it( 'find equal $nor', async () => {
    let cursor = coll.find({ $nor:[ { txt: 'Bla bla' }, { i : 11002 } ] })
    let result = await cursor.toArray()
    // console.log( 'find $nin', result )
    assert.equal( result.error, undefined )
    assert.equal( result.length, 9 )
  })

  it( 'find equal $or', async () => {
    let cursor = coll.find({ $or: [ {str: 'test2' }, { i : 123 } ] })
    let result = await cursor.toArray()
    // console.log( 'find $nin', result )
    assert.equal( result.error, undefined )
    assert.equal( result.length, 2 )
  })


  it( 'find equal $or + $and + $not', async () => {
    let cursor = coll.find({ $or: [ 
      { $and : [ { txt: 'Bla bla' }, { i : 123 } ] },
      { $not : [ { str: 'test2'   }, { i : 234 } ] } 
    ] })
    let result = await cursor.toArray()
    // console.log( 'find $nin', result )
    assert.equal( result.error, undefined )
    assert.equal( result.length, 11 )
  })
})