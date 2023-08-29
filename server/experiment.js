const theirdb = await orbitdb.open('/orbitdb/zdpuAuK3BHpS7NvMBivynypqciYCuy2UW77XYBPUYRnLjnw13')
for await (let record of theirdb.iterator()) {
  console.log(record)
}


const [mydata, setMydata] = useState("");


  
  async function getPackage(id) {  
    const {data:{data}} =  await server.get(`package/${id}`)
    if (data != undefined ) {
      setChecker(true)
      setMydata(JSON.parse(data))
    } else {
      console.log(data)
      setSpinner(false)
      return false
    }
  }