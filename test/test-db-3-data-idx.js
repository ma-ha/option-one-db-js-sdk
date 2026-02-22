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
      process.env.DB_URL,
      { accessId: process.env.DB_ACCESS_ID, accessKey: process.env.DB_ACCESS_KEY }
    )
    let result = await client.connect()
    assert.equal( result._error, null )
    db = await client.db( TEST_DB )
    assert.equal( db._error, null )  
    result = await db.createCollection( TEST_COLL  )

    mochaColl = await db.collection( TEST_COLL )
    assert.equal( mochaColl._error, null )
  })

  let xz = randomChar( 5 )


  it( 'create index', async () => {
    let result = await mochaColl.createIndex( 'abc' )
    assert.equal( result._error, null )
  })

  it( 'list indexes', async () => { 
    let result = await mochaColl.listIndexes( )
    // console.log( 'listIndexes', result )
    assert.equal( result._error, null )
    assert.notEqual( result['_PK'], null )
    assert.notEqual( result['abc'], null )
  })
  

  it( 'insertMany' , async () => { 
    let result = await mochaColl.insertMany([ 
      docA,  docB, docC, docD 
    ])
    assert.equal( result._error, null )
  })

  it( 'find all ' , async () => { 
    let cursor = mochaColl.find()
    assert.equal( cursor._error, null )
    let result = await cursor.toArray()
    assert.equal( result._error, null )
    assert.equal(  Array.isArray( result ), true )
    // console.log( result )
  })
  
  it( 'find all 2 ' , async () => { 
    let result = await mochaColl.find().toArray()
    // console.log( result )
    assert.equal( result._error, null )
    assert.equal(  Array.isArray( result ), true )
  })
  

  it( 'find abc=test' , async () => { 
    let result = await mochaColl.find( { 'abc': 'test' } )
    assert.equal( result._error, null )
  })
  
  
  
  it( 'updateMany' // , async () => { }
  )
  
  it( 'countDocument', async () => { 
    let result = await mochaColl.countDocuments()
    console.log( result )
    assert.equal( result._error, null )
  })
  
  it( 'deleteMany' // , async () => { }
  )


  // after( async () => {
  //   console.log( 'drop coll')
  //   let result = await db.dropCollection( TEST_COLL )
  //   console.log( result )
  //   assert.equal( result._error, null )  
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