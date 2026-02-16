const assert = require( 'assert' )

const { DbClient } = require( '../db-sdk' )

const TEST_DB = 'mocha-test-db1'

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
    let result = await db.createCollection( 'mocha-find', { primaryKey: ['no'] } )
    assert.notEqual( result._ok, undefined )
  })

  it( 'connect tst-find', async () => {
    mochaColl = await db.collection( 'mocha-find' )
    assert.equal( mochaColl._error, null )
  })

  let i = 0
  const testVal = ['ab','cd','ef','gh','ij']

  it( 'insert 100x doc1', async () => { 
    for ( let j = 0; j < 500; j++ ) {
      let test = testVal[ i % 5 ]
      let result = await mochaColl.insertOne( { 'no': i, t: 'test1', f: test, c: Math.random() + 100 } )
      assert.equal( result._ok, true )
      i++
    }
  })

  it( 'insert 10x doc2', async () => { 
    for ( let j = 0; j < 10; j++ ) {
      let test = testVal[ i % 5 ]
      let result = await mochaColl.insertOne( { 'no': i, t: 'test2', f: test, c: Math.random() + 100, b: true } )
      assert.equal( result._ok, true )
      i++
    }
  })

  it( 'insert 20x doc3', async () => { 
    for ( let j = 0; j < 20; j++ ) {
      let test = testVal[ i % 5 ]
      let result = await mochaColl.insertOne( { 'no': i, t: 'test3', f: test, c: Math.random() + 100, b: false } )
      assert.equal( result._ok, true )
      i++
    }
  })

  it( 'insert 20x doc4', async () => { 
    for ( let j = 0; j < 20; j++ ) {
      let test = testVal[ i % 5 ]
      let result = await mochaColl.insertOne( { 'no': i, t: 'test4', s: { f: test }, c: Math.random() + 100 } )
      assert.equal( result._ok, true )
      i++
    }
  })

})