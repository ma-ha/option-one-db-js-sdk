const assert = require( 'assert' )

const { DbClient } = require( '../db-sdk' )

const TEST_DB   = 'mocha-test-db'
const TEST_COLL = 'mocha-3' 

const docA = { 'xy': randomChar( 5 ), abc: 'test' }

const docB = { 'xy': randomChar( 5 ), abc: 'willi' }

const docC = { 'xy': randomChar( 5 ), abc: 't' }

const docD = { 'xy': randomChar( 5 ) }


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
    mochaColl = await db.collection( TEST_COLL )
    assert.equal( mochaColl._error, null )
  })

  
  it( 'updateMany' // , async () => { }
  )
  
  it( 'countDocument' // , async () => { }
  )
  
  it( 'deleteMany' // , async () => { }
  )


  after( async () => {
    console.log( 'drop coll')
    let result = await db.dropCollection( TEST_COLL )
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