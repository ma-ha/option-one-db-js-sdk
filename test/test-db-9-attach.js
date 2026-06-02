const assert = require( 'assert' )

const { DbClient } = require( '../db-sdk' )

const TEST_DB = 'mocha-test-db'

const docA = { 'xy': 'wellKnownId', color:'red', text: 'test' }
const docAbyId = { xy: docA.xy }

const docB = { 'xy': randomChar( 5 ), color:'red', text: 'willi' }

const docC = { 'xy': randomChar( 5 ), color:'blue', text: 'not red' }

const docD = { 'xy': randomChar( 5 ), color:'red'}
let id = '?'

describe( 'Test DB: Attachments', () => { 

  let client = null
  let db = null
  let mochaColl = null

  before( async () => {
    client = new DbClient(
      process.env.DB_URL,
      { accessId: process.env.DB_ACCESS_ID, accessKey: process.env.DB_ACCESS_KEY }
    )
    // client = new DbClient( 'http://mocha:test@localhost:9000/db')
    let result = await client.connect()
    assert.equal( result._error, null )

    db = await client.db( TEST_DB )
    assert.equal( db._error, null )  

    let collResult = await db.createCollection(  'mocha-u', { primaryKey: ['xy'] })
    assert.equal( collResult._error, null )

    mochaColl = await db.collection( 'mocha-u' )
    assert.equal( mochaColl._error, null )

    result = await mochaColl.insertOne( docA )
    // console.log( JSON.stringify(result) )
    id = result.result[0].value.replyMsg[0]._id
    console.log( id ) 
  })

  let txt = randomChar( 5 )
  

  it( 'add attachment file' , async () => { 
    let result = await mochaColl.attachFile( id, 'white pic', './test/white.png' )
    // console.log( result )
    assert.equal( result._ok, true )
  })

  it( 'add attachment file' , async () => { 
    const buffer = Buffer.from("Hello, world!");
    let result = await mochaColl.attachFile( id, 'hello', 'hello.txt', buffer, 'text/plain' )
    // console.log( result )
    assert.equal( result._ok, true )
  })

  it( 'get attachments' , async () => { 
    let result = await mochaColl.listAttachments( id )
    // console.log( result )
    assert.equal( result._ok, true )
  })

  it( 'download attachment', async () => { 
    let result = await mochaColl.getAttachment( id, 'hello.txt' )
    // console.log( result )
    assert.equal( result._error, undefined )
  })

  it( 'delete attachment', async () => { 
    let result = await mochaColl.deleteAttachment( id, 'hello.txt' )
    // console.log( result )
    assert.equal( result._ok, true )
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