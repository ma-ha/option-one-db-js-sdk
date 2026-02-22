const assert = require( 'assert' )

const { DbClient } = require( '../db-sdk' )

const TEST_DB = 'mocha-test-db1'

describe( 'Test DB: Perf', () => { 

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
    result = await db.createCollection(  'mocha-perf'  )

    mochaColl = await db.collection( 'mocha-perf' )
    assert.equal( mochaColl._error, null )
  })

  let ids = []

  it( 'cre idx no', async () => { 
    let result1 = await mochaColl.createIndex( 'no' )
  })

  it( 'cre idx c', async () => { 
  let result2 = await mochaColl.createIndex( 'c', { "msbLen": 6 } )
  })

  it( 'cre idx xy', async () => { 
    let result3 = await mochaColl.createIndex( 'xy' )
  })

  it( '100x insertOne', async () => { 
    for (let index = 0; index < 100; index++) {
      let xy = randomChar( 5 )
      ids.push( xy )
      let result = await mochaColl.insertOne({ 
        no : index, 
        xy  : xy, 
        t   : randomChar( 4 ), 
        c   : Math.random() * 100 
      })
      // let result = await mochaColl.insertOne( { 'xy': xz, abc: 'test' } )
      assert.equal( result._error, null )        
    }
  })

  it( '100x insertMany', async () => { 
    let docs = []
    for (let index = 0; index < 100; index++) {
      let xy = randomChar( 5 )
      ids.push( xy )
      docs.push({ 
        no : index, 
        xy  : xy, 
        t   : randomChar( 4 ), 
        c   : Math.random() * 100 
      })
      // let result = await mochaColl.insertOne( { 'xy': xz, abc: 'test' } )
    }
    let result = await mochaColl.insertMany( docs )
    assert.equal( result._error, null )        
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