import OrbitDB from 'orbit-db'
import { create } from 'ipfs-http-client' 
//const { create } = await import('ipfs-core')


const ipfs = create('/ip4/34.123.59.34/tcp/5001')
const orbitdb = await OrbitDB.createInstance(ipfs)
const db2 = '/orbitdb/zdpuB2uo9AHAAz3dMFoKpXuwjUxA4MKnLyeLXvWsaDcF9ggez/test-db'



async function main() {
  //await createDB()
  //await put()
  await get('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
  //await del()
}

async function del(){
  const db = await orbitdb.open(db2,{overwrite:false})
  const hash = await db.del('del')
  await orbitdb.disconnect()

}




async function put() {
  const db = await orbitdb.open(db2,{overwrite:false,create:false,type:'keyvalue'})
  //await db.access.grant('write', '*') // grant access to database2
  await db.load()
  await db.put('Signer', ["0x012", '0x022', "0x032", '0x58'],) //{pin:true}
  //await db.put('signer', ["0x01", '0x02', "0x03"])

  
  await orbitdb.disconnect() 
}



async function get(key) {

  const db = await orbitdb.open(db2, { overwrite: false, create: false, type: 'keyvalue' });
  await db.load()
  //const value = await db.get(key)
  const value = await db.all
  console.log("value is ", value)
  await orbitdb.disconnect()
}

async function createDB () {
  // Create IPFS instance
  //const ipfsOptions = { repo : './ipfs', }
  // ipfs = await create(ipfsOptions)
  // run your ipfs command with this

  //const ipfs = create('/ip4/127.0.0.1/tcp/5001')
  // Create OrbitDB instance
  //const orbitdb = await OrbitDB.createInstance(ipfs)
  const db = await orbitdb.keyvalue('test-db')
  console.log(await db) // convert the database address object to a string with the toString() method.
  await orbitdb.disconnect()
}

main()