import OrbitDB from 'orbit-db'
import { create } from 'ipfs-http-client' 
//const { create } = await import('ipfs-core')


const ipfs = create('/ip4/34.123.59.34/tcp/5001')
const orbitdb = await OrbitDB.createInstance(ipfs)
const collection = "/orbitdb/zdpuAuAH2hiMZ7yDnC8vahmNHqsKusPhtXKfMsmcQsV3vfw2R/projects"
const db = await orbitdb.docs(collection, { overwrite: false, create: false, })//{indexBy:'name'}


async function getVariables() {
  const ipfs = create('/ip4/34.123.59.34/tcp/5001')
  const orbitdb = await OrbitDB.createInstance(ipfs)
  const collection = "/orbitdb/zdpuAuAH2hiMZ7yDnC8vahmNHqsKusPhtXKfMsmcQsV3vfw2R/projects"
  const db = await orbitdb.docs(collection, { overwrite: false, create: false, })//{indexBy:'name'}
  return { ipfs, orbitdb, collection, db };
}

async function main() {
    //await createDB()
    await docsGet("0x34567a87d0a09b")
    //await erase('0xa436585577918a038df63116216331258b19017d')
    //await docsPut()    
}
    
async function docsPut(address,name,title,description,category,howMuch,minimum,percentage,upload,stake) {

    await db.load()
    const hash = await db.put({
        _id: address, name: name, title: title, description: description, category: category,
        howMuch: howMuch, minimum: minimum, percentage: percentage, upload: upload, stake: stake
    });
    console.log(hash)
    await orbitdb.disconnect()

}

async function erase (value){  
    await db.load()
    const hash = await db.del(value)
    console.log(hash)
    await orbitdb.disconnect()

}

async function docsGet(key) {
    
    await db.load()
    //const value = db.get(key)
    const value = db.get(''); // returns all the records
    console.log(value)
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
    const db = await orbitdb.docs('projects')//{indexBy:'name'}
    console.log(await db) // convert the database address object to a string with the toString() method.
    await orbitdb.disconnect()
}
  
main().catch((err) => {
    console.log(err)
})
