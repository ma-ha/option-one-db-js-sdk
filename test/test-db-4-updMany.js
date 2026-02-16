const assert = require( 'assert' )

const { DbClient } = require( '../db-sdk' )

const TEST_DB = 'mocha-test-db'

const docA = { 'xy': 'wellKnownId', color:'red', text: 'test' }
const docAbyId = { xy: docA.xy }

const docB = { 'xy': randomChar( 5 ), color:'red', text: 'willi' }

const docC = { 'xy': randomChar( 5 ), color:'blue', text: 'not red' }

const docD = { 'xy': randomChar( 5 ), color:'red'}


describe( 'Test DB: updateMany', () => { 

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

    let collResult = await db.createCollection(  'mocha-u', { primaryKey: ['xy'] })
    assert.equal( collResult._error, null )

    mochaColl = await db.collection( 'mocha-u' )
    assert.equal( mochaColl._error, null )

    await mochaColl.insertOne( docA ) // ignore errors
    await mochaColl.insertOne( docB ) // ignore errors
    await mochaColl.insertOne( docC ) // ignore errors
    await mochaColl.insertOne( docD ) // ignore errors

  })

  let txt = randomChar( 5 )
  

  it( 'updateMany fail with not found' )// , async () => { 
  //   let result = mochaColl.updateMany( { xy: xz }, { $set: { text: 'blah' } } )

  //   assert.equal( result._error, "not found" )
  // })


  it( 'updateMany $set one field', async () => { 
    let result = await mochaColl.updateMany( { color: 'red' }, { $set: { text: txt } } )
    assert.equal( result._error, null )
    assert.equal( result._ok, true )
    assert.notEqual( result._okCnt, 0 )
    let check = await mochaColl.find( { text:  txt }  )
    // console.log( check )
    assert.equal( check._error, null )
    // assert.equal( check.text, txt )    
  })

  it( 'updateMany $set one non existing path should fail' )// , async () => { 
  //   let result = await mochaColl.updateMany( docAbyId, { $set: { 'blah.text': txt } } )
  //   assert.notEqual( result._error, null )
  // })

  it( 'updateMany $set multi' )//, async () => { 
  //   let result = await mochaColl.updateMany( 
  //     docAbyId, { 
  //       $set: { 
  //         text  : 'blub', 
  //         descr : txt, 
  //         sub   : { cnt: 1 },
  //         arrX  : [],
  //         arr   : ['a','b','c']
  //       } 
  //     } 
  //   )
  //   assert.equal( result._error, null )
  //   assert.equal( result._ok, true )
  //   let check = await mochaColl.findOne( docAbyId  )
  //   // console.log( check )
  //   assert.equal( check._error, null )
  //   assert.equal( check.descr, txt )
  //   assert.equal( check.text, 'blub' )    
  //   assert.equal( check.sub.cnt, 1 )    
  // })

  it( 'updateMany $set multi option.readConcern=available' )//, async () => { 
  //   let result = await mochaColl.updateMany( 
  //     docAbyId, 
  //     { 
  //       $set: { 
  //         text  : 'blub', 
  //         descr : txt, 
  //         sub   : { cnt: 1 },
  //         arrX  : [],
  //         arr   : ['a','b','c']
  //       } 
  //     },
  //     { readConcern: 'available' }
  //   )
  //   assert.equal( result._error, null )
  //   assert.equal( result._ok, true )
  //   let check = await mochaColl.findOne( docAbyId, { readConcern: 'available' } )
  //   // console.log( check )
  //   assert.equal( check._error, null )
  //   assert.equal( check.descr, txt )
  //   assert.equal( check.text, 'blub' ) 
  //   assert.equal( check.sub.cnt, 1 )    
  // })

  it( 'updateMany $inc' )// , async () => { 
  //   let result = await mochaColl.updateMany( docAbyId, { $inc: { 'sub.cnt': 1 } } )
  //   assert.equal( result._error, null )
  //   assert.equal( result._ok, true )
  //   let check = await mochaColl.findOne( docAbyId  )
  //   // console.log( check )
  //   assert.equal( check._error, null )
  //   assert.equal( check.sub.cnt, 2 )    
  // })


  it( 'updateMany $min' )//, async () => { 
  //   let result = await mochaColl.updateMany( docAbyId, { $min: { 'sub.cnt': 10 } } )
  //   assert.equal( result._error, null )
  //   assert.equal( result._ok, true )
  //   let check = await mochaColl.findOne( docAbyId  )
  //   // console.log( check )
  //   assert.equal( check.sub.cnt, 2 )  

  //   result = await mochaColl.updateMany( docAbyId, { $min: { 'sub.cnt': 1 } } )
  //   assert.equal( result._error, null )
  //   assert.equal( result._ok, true )
  //   check = await mochaColl.findOne( docAbyId  )
  //   // console.log( check )
  //   assert.equal( check.sub.cnt, 1 )    
  // })

  it( 'updateMany $max' )//, async () => { 
  //   let result = await mochaColl.updateMany( docAbyId, { $max: { 'sub.cnt': 10 } } )
  //   assert.equal( result._error, null )
  //   assert.equal( result._ok, true )
  //   let check = await mochaColl.findOne( docAbyId  )
  //   // console.log( check )
  //   assert.equal( check.sub.cnt, 10 )  

  //   result = await mochaColl.updateMany( docAbyId, { $max: { 'sub.cnt': 1 } } )
  //   assert.equal( result._error, null )
  //   assert.equal( result._ok, true )
  //   check = await mochaColl.findOne( docAbyId  )
  //   // console.log( check )
  //   assert.equal( check.sub.cnt, 10 )    
  // })


  it( 'updateMany $unset' )//, async () => { 
  //   let result = await mochaColl.updateMany( docAbyId, { $unset: { 'sub.cnt': 1 } } )
  //   assert.equal( result._error, null )
  //   assert.equal( result._ok, true )
  //   let check = await mochaColl.findOne( docAbyId  )
  //   // console.log( check )
  //   assert.equal( check.sub.cnt, null )    
  // })

  it( 'updateMany $push' )//, async () => { 
  //   let result = await mochaColl.updateMany( docAbyId, { $push: { 'arr': 'd' } } )
  //   assert.equal( result._error, null )
  //   assert.equal( result._ok, true )
  //   let check = await mochaColl.findOne( docAbyId  )
  //   // console.log( check )
  //   assert.deepEqual( check.arr, ['a','b','c','d'] )    
  // })

  it( 'updateMany $push $each' )//, async () => { 
  //   let result = await mochaColl.updateMany( docAbyId, { $push: { 'arr': { $each: ['a','b'] } } } )
  //   assert.equal( result._error, null )
  //   assert.equal( result._ok, true )
  //   let check = await mochaColl.findOne( docAbyId  )
  //   // console.log( check )
  //   assert.deepEqual( check.arr, ['a','b','c','d','a','b'] )
  // })
  
  it( 'updateMany $addToSet no' )//, async () => { 
  //   let result = await mochaColl.updateMany( docAbyId, { $addToSet: { 'arr': 'a' } } )
  //   assert.equal( result._error, null )
  //   assert.equal( result._ok, true )
  //   let check = await mochaColl.findOne( docAbyId  )
  //   // console.log( check )
  //   assert.deepEqual( check.arr, ['a','b','c','d','a','b'] )
  // })
  it( 'updateMany $addToSet yes' )//, async () => { 
  //   let result = await mochaColl.updateMany( docAbyId, { $addToSet: { 'arr': 'x' } } )
  //   assert.equal( result._error, null )
  //   assert.equal( result._ok, true )
  //   let check = await mochaColl.findOne( docAbyId  )
  //   // console.log( check )
  //   assert.deepEqual( check.arr, ['a','b','c','d','a','b','x'] )
  // })
  
  it( 'updateMany $addToSet $each' )//, async () => { 
  //   let result = await mochaColl.updateMany( docAbyId, { $addToSet: { 'arr': { $each: ['a','y'] } } } )
  //   assert.equal( result._error, null )
  //   assert.equal( result._ok, true )
  //   let check = await mochaColl.findOne( docAbyId )
  //   // console.log( check )
  //   assert.deepEqual( check.arr, ['a','b','c','d','a','b','x','y'] )
  // })
  
  it( 'updateMany $pop last' )//, async () => { 
  //   let result = await mochaColl.updateMany( docAbyId, { $pop: { 'arr': 1 } } )
  //   assert.equal( result._error, null )
  //   assert.equal( result._ok, true )
  //   let check = await mochaColl.findOne( docAbyId  )
  //   // console.log( check )
  //   assert.deepEqual( check.arr, ['a','b','c','d','a','b','x'] )
  // })
  it( 'updateMany $pop first' )//, async () => { 
  //   let result = await mochaColl.updateMany( docAbyId, { $pop: { 'arr': -1 } } )
  //   assert.equal( result._error, null )
  //   assert.equal( result._ok, true )
  //   let check = await mochaColl.findOne( docAbyId  )
  //   // console.log( check )
  //   assert.deepEqual( check.arr, ['b','c','d','a','b','x'] )
  // })
  
  it( 'updateMany $rename should fail if field exits' )//, async () => { 
  //   let result = await mochaColl.updateMany( docAbyId, { $rename: { 'arr': 'arrX' } } )
  //   assert.notEqual( result._error, null )
  // })
  
  it( 'updateMany $rename' )//, async () => { 
  //   await mochaColl.updateMany( docAbyId, { $unset: { 'arrX': 1 } } )
  //   let result = await mochaColl.updateMany( docAbyId, { $rename: { 'arr': 'arrX' } } )
  //   assert.equal( result._error, null )
  //   assert.equal( result._ok, true )
  //   let check = await mochaColl.findOne( docAbyId  )
  //   // console.log( check )
  //   assert.deepEqual( check.arrX, ['b','c','d','a','b','x'] )
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