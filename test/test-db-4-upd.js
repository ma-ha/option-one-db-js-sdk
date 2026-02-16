const assert = require( 'assert' )

const { DbClient } = require( '../db-sdk' )

const TEST_DB = 'mocha-test-db'

const docA = { 'xy': 'wellKnownId', color:'red', text: 'test' }
const docAbyId = { xy: docA.xy }

const docB = { 'xy': randomChar( 5 ), color:'red', text: 'willi' }

const docC = { 'xy': randomChar( 5 ), color:'blue', text: 'not red' }

const docD = { 'xy': randomChar( 5 ), color:'red'}


describe( 'Test DB: updateOne', () => { 

  let client = null
  let db = null
  let mochaColl = null

  before( async () => {
    client = new DbClient(
      'http://localhost:9000/db',
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
  })

  let txt = randomChar( 5 )
  

  it( 'updateOne fail with not found' , async () => { 
    let result = await mochaColl.updateOne( { xy: 'wrong id' }, { $set: { text: 'blah' } } )
    // console.log( result )
    assert.notEqual( result._error, null)
  })

  let id = null
  it( 'updateOne $set one field' , async () => { 
    let result = await mochaColl.updateOne( docAbyId, { $set: { text: txt } } )
    assert.equal( result._error, null )
    assert.equal( result._ok, true )
    let check = await mochaColl.findOne( docAbyId  )
    // console.log( check )
    assert.equal( check._error, null )
    assert.equal( check.text, txt )
    id = check._id
  })

  it( 'replaceOne', async () => { 
    docA._id = id
    docA.a = 42
    let result = await mochaColl.replaceOne( docA )
    // console.log( 'replaceOne', result )
    assert.equal( result._error, null )
    assert.equal( result._ok, true )
    let check = await mochaColl.findOne( docAbyId  )
    // console.log( 'replaceOne', check )
    assert.equal( check._error, null )
    assert.equal( check.a, 42 )    
  })

  it( 'replaceOne fail id invalid', async () => { 
    let doc = JSON.parse( JSON.stringify( docA ) )
    doc.xy += 'x'
    let result = await mochaColl.replaceOne( doc )
    // console.log( 'replaceOne id invalid', result )
    assert.notEqual( result._error, null )
  })


  it( 'updateOne $set one non existing path should not fail' , async () => { 
    let result = await mochaColl.updateOne( docAbyId, { $set: { 'blah.text': txt } } )
    // console.log( result )
    assert.equal( result._error, null )
  })

  it( 'updateOne $set multi' , async () => { 
    let result = await mochaColl.updateOne( 
      docAbyId, { 
        $set: { 
          text  : 'blub', 
          descr : txt, 
          sub   : { cnt: 1 },
          arrX  : [],
          arr   : ['a','b','c']
        } 
      } 
    )
    // console.log( result )
    assert.equal( result._error, null )
    assert.equal( result._ok, true )
    let check = await mochaColl.findOne( docAbyId  )
    // console.log( 'check', check )
    assert.equal( check._error, null )
    assert.equal( check.descr, txt )
    assert.equal( check.text, 'blub' )    
    assert.equal( check.sub.cnt, 1 )    
  })

  it( 'updateOne $set multi option.readConcern=available' , async () => { 
    let result = await mochaColl.updateOne( 
      docAbyId, 
      { 
        $set: { 
          text  : 'blub', 
          descr : txt, 
          sub   : { cnt: 1 },
          arrX  : [],
          arr   : ['a','b','c']
        } 
      },
      { readConcern: 'available' }
    )
    assert.equal( result._error, null )
    assert.equal( result._ok, true )
    let check = await mochaColl.findOne( docAbyId, { readConcern: 'available' } )
    // console.log( check )
    assert.equal( check._error, null )
    assert.equal( check.descr, txt )
    assert.equal( check.text, 'blub' ) 
    assert.equal( check.sub.cnt, 1 )    
  })

  it( 'updateOne $inc' , async () => { 
    let result = await mochaColl.updateOne( docAbyId, { $inc: { 'sub.cnt': 1 } } )
    assert.equal( result._error, null )
    assert.equal( result._ok, true )
    let check = await mochaColl.findOne( docAbyId  )
    // console.log( check )
    assert.equal( check._error, null )
    assert.equal( check.sub.cnt, 2 )    
  })


  it( 'updateOne $min', async () => { 
    let result = await mochaColl.updateOne( docAbyId, { $min: { 'sub.cnt': 10 } } )
    assert.equal( result._error, null )
    assert.equal( result._ok, true )
    let check = await mochaColl.findOne( docAbyId  )
    // console.log( check )
    assert.equal( check.sub.cnt, 2 )  

    result = await mochaColl.updateOne( docAbyId, { $min: { 'sub.cnt': 1 } } )
    assert.equal( result._error, null )
    assert.equal( result._ok, true )
    check = await mochaColl.findOne( docAbyId  )
    // console.log( check )
    assert.equal( check.sub.cnt, 1 )    
  })

  it( 'updateOne $max', async () => { 
    let result = await mochaColl.updateOne( docAbyId, { $max: { 'sub.cnt': 10 } } )
    assert.equal( result._error, null )
    assert.equal( result._ok, true )
    let check = await mochaColl.findOne( docAbyId  )
    // console.log( check )
    assert.equal( check.sub.cnt, 10 )  

    result = await mochaColl.updateOne( docAbyId, { $max: { 'sub.cnt': 1 } } )
    assert.equal( result._error, null )
    assert.equal( result._ok, true )
    check = await mochaColl.findOne( docAbyId  )
    // console.log( check )
    assert.equal( check.sub.cnt, 10 )    
  })


  it( 'updateOne $unset' , async () => { 
    let result = await mochaColl.updateOne( docAbyId, { $unset: { 'sub.cnt': 1 } } )
    assert.equal( result._error, null )
    assert.equal( result._ok, true )
    let check = await mochaColl.findOne( docAbyId  )
    // console.log( check )
    assert.equal( check.sub.cnt, null )    
  })

  it( 'updateOne $push', async () => { 
    let result = await mochaColl.updateOne( docAbyId, { $push: { 'arr': 'd' } } )
    assert.equal( result._error, null )
    assert.equal( result._ok, true )
    let check = await mochaColl.findOne( docAbyId  )
    // console.log( check )
    assert.deepEqual( check.arr, ['a','b','c','d'] )    
  })

  it( 'updateOne $push $each', async () => { 
    let result = await mochaColl.updateOne( docAbyId, { $push: { 'arr': { $each: ['a','b'] } } } )
    assert.equal( result._error, null )
    assert.equal( result._ok, true )
    let check = await mochaColl.findOne( docAbyId  )
    // console.log( check )
    assert.deepEqual( check.arr, ['a','b','c','d','a','b'] )
  })
  
  it( 'updateOne $addToSet no', async () => { 
    let result = await mochaColl.updateOne( docAbyId, { $addToSet: { 'arr': 'a' } } )
    assert.equal( result._error, null )
    assert.equal( result._ok, true )
    let check = await mochaColl.findOne( docAbyId  )
    // console.log( check )
    assert.deepEqual( check.arr, ['a','b','c','d','a','b'] )
  })
  it( 'updateOne $addToSet yes', async () => { 
    let result = await mochaColl.updateOne( docAbyId, { $addToSet: { 'arr': 'x' } } )
    assert.equal( result._error, null )
    assert.equal( result._ok, true )
    let check = await mochaColl.findOne( docAbyId  )
    // console.log( check )
    assert.deepEqual( check.arr, ['a','b','c','d','a','b','x'] )
  })
  
  it( 'updateOne $addToSet $each', async () => { 
    let result = await mochaColl.updateOne( docAbyId, { $addToSet: { 'arr': { $each: ['a','y'] } } } )
    assert.equal( result._error, null )
    assert.equal( result._ok, true )
    let check = await mochaColl.findOne( docAbyId )
    // console.log( check )
    assert.deepEqual( check.arr, ['a','b','c','d','a','b','x','y'] )
  })
  
  it( 'updateOne $pop last', async () => { 
    let result = await mochaColl.updateOne( docAbyId, { $pop: { 'arr': 1 } } )
    assert.equal( result._error, null )
    assert.equal( result._ok, true )
    let check = await mochaColl.findOne( docAbyId  )
    // console.log( check )
    assert.deepEqual( check.arr, ['a','b','c','d','a','b','x'] )

  })
  it( 'updateOne $pop first', async () => { 
    let result = await mochaColl.updateOne( docAbyId, { $pop: { 'arr': -1 } } )
    assert.equal( result._error, null )
    assert.equal( result._ok, true )
    let check = await mochaColl.findOne( docAbyId  )
    // console.log( check )
    assert.deepEqual( check.arr, ['b','c','d','a','b','x'] )
  })
  
  it( 'updateOne $rename should fail if field exits', async () => { 
    let result = await mochaColl.updateOne( docAbyId, { $rename: { 'arr': 'arrX' } } )
    assert.notEqual( result._error, null )
  })
  
  it( 'updateOne $rename', async () => { 
    await mochaColl.updateOne( docAbyId, { $unset: { 'arrX': 1 } } )
    let result = await mochaColl.updateOne( docAbyId, { $rename: { 'arr': 'arrX' } } )
    assert.equal( result._error, null )
    assert.equal( result._ok, true )
    let check = await mochaColl.findOne( docAbyId  )
    // console.log( check )
    assert.deepEqual( check.arrX, ['b','c','d','a','b','x'] )
  })
  

  // after( async () => {
  //   console.log( 'drop coll')
  //   let result = await db.dropCollection( 'mocha-u' )
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