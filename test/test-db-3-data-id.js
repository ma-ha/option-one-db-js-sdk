const assert = require( 'assert' )

const { DbClient } = require( '../db-sdk' )

const TEST_DB = 'mocha-test-db'

describe( 'Test DB: Collection', () => { 

  let client = null
  let db = null
  let mochaColl = null

  before( async () => {
    console.log( 'prep coll')
    client = new DbClient(
      'http://localhost:9000/db',
      { accessId: process.env.DB_ACCESS_ID, accessKey: process.env.DB_ACCESS_KEY }
    )
    let result = await client.connect()
    assert.equal( result._error, null )
    db = await client.db( TEST_DB )
    assert.equal( db._error, null )  
    result = await db.createCollection( 'mocha-id' )
    assert.equal( result._error, null )  
    mochaColl = await db.collection( 'mocha-id' )
    assert.equal( mochaColl._error, null )
  })

  let xz = randomChar( 5 )

  it( 'insertOne '+xz, async () => { 
    let result = await mochaColl.insertOne( { 'xy': xz, abc: 'test' } )
    assert.equal( result._error, null )
  })
  
  // it( 'insertOne '+xz, async () => { 
  //   let result = await mochaColl.insertOne( { 'xy': xz, abc: 'test' } )
  //   assert.equal( result._error, null )
  // })
  
  // it( 'insertOne '+xz, async () => { 
  //   let result = await mochaColl.insertOne( { 'xy': '', abc: '' } )
  //   assert.equal( result._error, null )
  // })
  
  
  // it( 'findOne '+xz , async () => { 
  //   let result = await mochaColl.findOne( { 'xy': xz } )
  //   // console.log( '>>', result )
  //   assert.equal( result._error, null )
  //   assert.equal( result.abc, 'test' )
  //   assert.notEqual( result._id, null )
  // })

  after( async () => {
    console.log( 'drop coll')
    let result = await db.dropCollection( 'mocha-id' )
    console.log( result )
    assert.equal( result._error, null )  
  })

})



function randomChar( len ) {
  var chrs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  var token =''
  for ( var i = 0; i < len; i++ ) {
    var iRnd = Math.floor( Math.random() * chrs.length )
    token += chrs.substring( iRnd, iRnd+1 )
  }
  return token
}