const assert = require( 'assert' )

const { DbClient } = require( '../db-sdk' )

const TEST_DB = 'mocha-test-db'

const docA = { 'xy': 'wellKnownId', color:'red', text: 'test' }
const docAbyId = { xy: docA.xy }

const docB = { 'xy': randomChar( 5 ), color:'red', text: 'willi' }

const docC = { 'xy': randomChar( 5 ), color:'blue', text: 'not red' }

const docD = { 'xy': randomChar( 5 ), color:'red'}


describe( 'Test DB: update simple', () => { 

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

    let collResult = await db.createCollection(  'mocha-u', { primaryKey: ['xy'] })
    //console.log( 'createCollection', collResult )
    assert.equal( collResult._error, null )

    mochaColl = await db.collection( 'mocha-u' )
    assert.equal( mochaColl._error, null )

    // let insResult = 
    await mochaColl.insertMany( [ docA /*, docB, docC, docD */] ) // ignore errors
    // console.log( 'insertMany', insResult )
  })

  let xz = randomChar( 5 )
  

  it( 'updateOne fail with "not found"' 
  // , async () => { 
  //   let result = await mochaColl.updateOne( { xy: xz }, { $set: { text: 'blah' } } )
  //   // console.log( result )
  //   assert.equal( result._error, "Not found" )
  // }
  )

  it( 'updateOne $set' 
  // , async () => { 
  //   let result = await mochaColl.updateOne( docAbyId, { $set: { text: 'blah' } } )
  //   assert.equal( result._error, null )
  // }
  )

  it( 'updateOne $set multi'
  // , async () => { 
  //   let result = await mochaColl.updateOne( docAbyId, { $set: { text: 'blub', descr: 'blub blub' } } )
  //   assert.equal( result._error, null )
  // }
  )

  it( 'updateMany $set' // , async () => { }
  )
  
  
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