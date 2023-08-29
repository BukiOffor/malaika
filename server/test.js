import OrbitDB from 'orbit-db'
import { create } from 'ipfs-http-client' 
//const { create } = await import('ipfs-core')


async function main () {
  // Create IPFS instance
  //const ipfsOptions = { repo : './ipfs', }
  // ipfs = await create(ipfsOptions)

  // run your ipfs command with this :---> ipfs daemon --enable-pubsub-experiment

   const ipfs = create('/ip4/127.0.0.1/tcp/5001')

//   // Create OrbitDB instance
   const orbitdb = await OrbitDB.createInstance(ipfs)
//   const db = await orbitdb.keyvalue('test-db')
//   console.log(await db) // convert the database address object to a string with the toString() method.
    
    const DBname = '/orbitdb/zdpuAwpWDjTxLJCPhCeZz47sssJydALoyA2NSQ9ZDHonxRErX/test-db'
    const db = await orbitdb.open(DBname)
   const response = await db.put("test", { name: "poppins" })
   console.log(response)
   await orbitdb.disconnect()

}


main()





