const assert = require( 'assert' )

const { DbClient } = require( '../db-sdk' )

const TEST_DB = 'mocha-test-db1'

describe( 'Test DB: Collection', () => { 

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
    mochaColl = await db.collection( 'mocha-1' )
    assert.equal( mochaColl._error, null )
  })

  let xz = randomChar( 5 )

  it( 'insertOne '+xz, async () => { 
    let result = await mochaColl.insertOne( { 'xy': xz, abc: 'test' } )
    assert.equal( result._error, null )
  })
  
  let id = '?'
  it( 'findOne '+xz , async () => { 
    let result = await mochaColl.findOne( { 'xy': xz } )
    // console.log( '>>', result )
    assert.equal( result._error, null )
    assert.equal( result.xy, xz )
    id =  result._id
  })

  it( 'findById '+id , async () => { 
    let result = await mochaColl.findOne( { '_id': id } )
    // console.log( '>>', result )
    assert.equal( result._error, null )
    assert.equal( result.xy, xz )
  })

  it( 'updateOne by PK' , async () => { 
    let result = await mochaColl.updateOne( { 'xy': xz }, { $set: { text: 'blah' } } )
    assert.equal( result._error, null )
  })

  it( 'updateOne by id' , async () => { 
    let result = await mochaColl.updateOne( { '_id': id }, { $set: { text: 'blah' } } )
    // console.log( '>>', result )
    assert.equal( result._error, null )
  })

  it( 're-check '+xz , async () => { 
    let result = await mochaColl.findOne( { 'xy': xz } )
    // console.log( 'doc', result.data )
    assert.equal( result._error, null )
    assert.equal( result.text, 'blah' )
  })

  
  it( 'delete by id' , async () => {
    let result = await mochaColl.deleteOne( { '_id': id } )
    // console.log( '>>', result )
    assert.equal( result._error, null )
  })

  it( 're-check '+xz , async () => { 
    let result = await mochaColl.findOne( { 'xy': xz } )
    // console.log( 'doc', result )
    assert.equal( result._error, 'Not found' )
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