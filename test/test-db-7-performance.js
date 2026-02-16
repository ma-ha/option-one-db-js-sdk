const assert = require( 'assert' )

const { DbClient } = require( '../db-sdk' )

const TEST_DB = 'mocha-test-db'

describe( 'Test DB: Collection', () => { 

  let client = null
  let db = null
  let mochaColl = null

  before( async () => {
    client = new DbClient(
      'http://localhost:9000/db',
      { accessId: process.env.DB_ACCESS_ID, accessKey: process.env.DB_ACCESS_KEY }
    )
    let result = await client.connect()
    assert.equal( result._error, null )
    db = await client.db( TEST_DB )
    assert.equal( db._error, null )  
    mochaColl = await db.collection( 'mocha-1' )
    assert.equal( mochaColl._error, null )
  })

  let ids = []

  it( '100x insertOne', async () => { 
    for (let index = 0; index < 100; index++) {
      let xz = randomChar( 5 )
      ids.push( xz )
      let result = await mochaColl.insertOne( { 'xy': xz, abc: 'test' } )
      assert.equal( result._error, null )        
    }
  })
  
  // it( 'findOne '+xz , async () => { 
  //   let result = await mochaColl.findOne( { 'xy': xz } )
  //   // console.log( '>>', result )
  //   assert.equal( result._error, null )
  //   assert.equal( result.abc, 'test' )
  // })
  
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