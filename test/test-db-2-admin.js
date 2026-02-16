const assert = require( 'assert' )

const { DbClient } = require( '../db-sdk' )

const TEST_DB = 'mocha-test-db'

describe( 'Test DB: User Admin (sync to all nodes)', () => { 

  let client = null


  before( async () => {
    client = new DbClient(
      'http://localhost:9000/db',
      { accessId: process.env.DB_ACCESS_ID, accessKey: process.env.DB_ACCESS_KEY }
    )
    let result = await client.connect()
    assert.equal( result._error, null )
    // await client.addUser( 'mocha', 'test', 'm@t.de', null, true  )
  })

  let xz = randomChar( 5 )
  let pwd = randomChar( 12 )

  it( 'add admin user fail lousy password '+xz, async () => { 
    let result = await client.addUser( xz+'admin', 'Test', 'm@t.de', null, true  )
    assert.equal( result._ok, null )
  })

  it( 'add admin user '+xz, async () => { 
    let result = await client.addUser( xz+'admin', pwd, 'm@t.de', null, true  )
    assert.equal( result._error, null )
  })

  it( 'add user '+xz, async () => { 
    let result = await client.addUser( xz, pwd, 'm@t.de', TEST_DB, false )
    assert.equal( result._error, null )
  })

  it( 'change password '+xz )

  it( 'add autz '+xz )

  it( 'rm autz '+xz )

  it( 'rm user '+xz )

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