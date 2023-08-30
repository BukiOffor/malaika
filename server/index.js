import express from 'express';
import cors from 'cors';
import OrbitDB from 'orbit-db'
import { create } from 'ipfs-http-client' 
import 'dotenv/config';

const app = express()
app.use(cors())
app.use(express.json())


const uri = process.env.uri;


async function getVariables() {
  const ipfs = create(uri)
  const orbitdb = await OrbitDB.createInstance(ipfs)
  const collection = "/orbitdb/zdpuAuAH2hiMZ7yDnC8vahmNHqsKusPhtXKfMsmcQsV3vfw2R/projects"
  const db = await orbitdb.docs(collection, { overwrite: false, create: false, })//{indexBy:'name'}
  return { ipfs, orbitdb, collection, db };
}


app.post("/docsAppend/:address", (req,res) => {
  async function insertpackage() {
    console.log(req.body)
    const { address } = req.params;
    console.log(address)
    const { name, title, description, category, howMuch, minimum, percentage, upload, stake, creator } = req.body;
    const ipfs = create(uri)
  const orbitdb = await OrbitDB.createInstance(ipfs)
  const collection = "/orbitdb/zdpuAuAH2hiMZ7yDnC8vahmNHqsKusPhtXKfMsmcQsV3vfw2R/projects"
  const db = await orbitdb.docs(collection, { overwrite: false, create: false, })//{indexBy:'name'}
   // const { db, orbitdb } = await getVariables()
    await db.load()
    const hash = await db.put({
      _id: address, name: name, title: title, description: description, category: category,
      howMuch: howMuch, minimum: minimum, percentage: percentage, upload: upload, stake: stake, creator:creator
  });   
  await orbitdb.disconnect()
  res.send(true)
} insertpackage()
})

app.get("/docsAll", (req,res) => {
  async function getAll() {
    //const {db,orbitdb} = await getVariables()
    const ipfs = create(uri)
    const orbitdb = await OrbitDB.createInstance(ipfs)
    const collection = "/orbitdb/zdpuAuAH2hiMZ7yDnC8vahmNHqsKusPhtXKfMsmcQsV3vfw2R/projects"
    const db = await orbitdb.docs(collection, { overwrite: false, create: false, })//{indexBy:'name'}
    await db.load()
    const data = await db.get('')
    console.log("value is ", data)
    await orbitdb.disconnect()
    res.send({data:data})
}getAll()
})

app.get('/docsGet/:address', (req,res)=>{
  async function getMyPackage(){
    const { address } = req.params;
    //const {db,orbitdb} = await getVariables()
    const ipfs = create(uri)
  const orbitdb = await OrbitDB.createInstance(ipfs)
  const collection = "/orbitdb/zdpuAuAH2hiMZ7yDnC8vahmNHqsKusPhtXKfMsmcQsV3vfw2R/projects"
  const db = await orbitdb.docs(collection, { overwrite: false, create: false, })//{indexBy:'name'}
    await db.load()
    const data = await db.get(address);
    await orbitdb.disconnect()
    res.send({data:data})
  }getMyPackage()
})


async function get(key) {
    const ipfs = create(uri)
    const orbitdb = await OrbitDB.createInstance(ipfs)
    const db2 = '/orbitdb/zdpuB2uo9AHAAz3dMFoKpXuwjUxA4MKnLyeLXvWsaDcF9ggez/test-db'
    const db = await orbitdb.open(db2,{overwrite:false,create:false,type:'keyvalue'});
    await db.load()
    const value = await db.get(key)
    //const value = await db.all
    console.log("value is ", value)
  await orbitdb.disconnect()
  return value
  }
 


app.delete("/docsDel/:contractAddr", (req, res) => {
  async function erase() {
    const { contractAddr } = req.params;
    const ipfs = create(uri)
    const orbitdb = await OrbitDB.createInstance(ipfs)
    const collection = "/orbitdb/zdpuAuAH2hiMZ7yDnC8vahmNHqsKusPhtXKfMsmcQsV3vfw2R/projects"
    const db = await orbitdb.docs(collection, { overwrite: false, create: false, })//{indexBy:'name'}
    await db.load()
    const hash = await db.del(contractAddr)
    console.log(hash)
    await orbitdb.disconnect()
  }erase()
})

app.get("/projects", (req, res) => {
    async function getAll() {
        const ipfs = await create(uri)
        const orbitdb = await OrbitDB.createInstance(ipfs)
        const db2 = '/orbitdb/zdpuB2uo9AHAAz3dMFoKpXuwjUxA4MKnLyeLXvWsaDcF9ggez/test-db'
        const db = await orbitdb.open(db2,{overwrite:true,create:false,type:'keyvalue'});
        await db.load()
        const data = await db.all
        await orbitdb.disconnect()
        res.send({data:data})
    }getAll()
})


app.post('/update/:address',(req,res)=>{
  async function insertpackage() {
      console.log(req.body)
      const { address } = req.params;
    console.log(address)
    const ipfs = await create(uri)
    const orbitdb = await OrbitDB.createInstance(ipfs)
    const db2 = '/orbitdb/zdpuB2uo9AHAAz3dMFoKpXuwjUxA4MKnLyeLXvWsaDcF9ggez/test-db'
    const { name, title, description, category, howMuch, minimum, percentage, upload, stake,creator } = req.body;
    console.log("address is ", address)
    const db = await orbitdb.open(db2,{overwrite:true,create:false,type:'keyvalue'})
    await db.load()
    await db.put(creator, [name, title, description, category, howMuch, minimum, percentage, upload, stake,address], { pin: true })
    console.log(db.get(address))
    await orbitdb.disconnect()
    res.send(true)
  } insertpackage()
})


app.get('/package/:address', (req,res)=>{
    async function getMyPackage(){
        const { address } = req.params;
        const data = await get(address);
        res.send({data:data})
    }getMyPackage()
})

app.post('/append/:address',(req,res)=>{
  async function insertpackage() {
      console.log(req.body)
      const { address } = req.params;
    console.log(address)
    const ipfs = await create(uri)
    const orbitdb = await OrbitDB.createInstance(ipfs)
    const db2 = '/orbitdb/zdpuB2uo9AHAAz3dMFoKpXuwjUxA4MKnLyeLXvWsaDcF9ggez/test-db'
    const { name, title, description, category, howMuch, minimum, percentage, upload, stake,creator } = req.body;
    console.log("address is ", address)
    const db = await orbitdb.open(db2,{overwrite:true,create:false,type:'keyvalue'})
    await db.load()
    await db.put(creator, [name, title, description, category, howMuch, minimum, percentage, upload, stake,address],{pin:true}) //{pin:true}
    ///////////////////////////////////////////////////////////////////////////////////
  // const collection = "/orbitdb/zdpuAuAH2hiMZ7yDnC8vahmNHqsKusPhtXKfMsmcQsV3vfw2R/projects"
  // const Docsdb = await orbitdb.docs(collection, { overwrite: false, create: false, })//{indexBy:'name'}
  //  // const { db, orbitdb } = await getVariables()
  //   await Docsdb.load()
  //   const hash = await Docsdb.put({
  //     _id: address, name: name, title: title, description: description, category: category,
  //     howMuch: howMuch, minimum: minimum, percentage: percentage, upload: upload, stake: stake
  // });   
    
    await orbitdb.disconnect()
    res.send(true)
  } insertpackage()
})

app.delete("/del/:address", (req,res) => {
  async function del() {
    const { address } = req.params;
    console.log(address)
    const ipfs = await create(uri)
    const orbitdb = await OrbitDB.createInstance(ipfs)
    const db2 = '/orbitdb/zdpuB2uo9AHAAz3dMFoKpXuwjUxA4MKnLyeLXvWsaDcF9ggez/test-db'
    const db = await orbitdb.open(db2,{overwrite:false})
    const hash = await db.del(address)
    console.log(hash)
    await orbitdb.disconnect()  
  } del()
})

const port = 8000
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}!.`)
})
