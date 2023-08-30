"use client";
import { Text, SimpleGrid, GridItem, Box, Grid, Heading } from "@chakra-ui/react";
import Container from "./Container";
import MarketCard from "./MarketCard";
import server from "../server"
import { getAccount } from "@wagmi/core";
import { useState, useEffect } from "react";



export default function MarketList() {
  const [Marketplace, setMarkeplace] = useState([]);
  const [DynamicData, setDynamicData] = useState('');
  const { isConnected } = getAccount();


  async function getMarket() {
    const { data: { data } } = await server.get('docsAll');
    if (data != undefined ) {
      setMarkeplace(data)
      console.log(data)

    } else {
      return data
    }

  }

  // async function getSingle(address:string) {
  //   const { data: { data } } = await server.get(`/docsGet/${address}`);
  //   if (data != undefined ) {
  //     setDynamicData(JSON.parse(data))
  //   } else {
  //     console.log(data)
  //     return false
  //   }
  // }
  

  useEffect(() => {
    async function updateUI() {
      if (isConnected) {
        const response = await getMarket();
        console.log("marketplace are ", response);
        //@ts-ignore
        //const amount: any = await getSingle()
        console.log(amount)
      }
    }  
    updateUI();
  }, [isConnected]);

  
  return (
    <>
      <Container className="pt-28">
        <Heading size={{
          base: "sm",
          md: "md",
          lg: "lg",
        }} className="font-bold text-center">
          The Malaika&apos;s Marketplace
        </Heading>
        <Text className="py-3 text-sm text-center md:text-md" >Explore and support projects that you care about.</Text>
        <Text className="py-3 pt-20 text-lg font-semibold">Trending projects</Text>
       <Box  className="p-2 mx-auto border rounded-lg md:p-6 shadow-primary border-slate-300">
      <Grid gridTemplateColumns={{
        base: "repeat(1, 1fr)",
        md: "repeat(2, 1fr)",
        lg: "repeat(3, 1fr)",
          }} gap={5} >
            {Marketplace.map((item) => (
              <GridItem key={item}>
                <MarketCard
                  contractaddr={item["_id"]}
                  title={item["title"]}
                  description={item["description"]}
                  howMuch={item["howMuch"]}
                  minimum={item['minimum']}
                  name={item['name']}
                />
              </GridItem>
            ))}
        
        
      </Grid>
       </Box>
      </Container>
    </>
  );
}
