// 'use client'

// import { Flex, Grid, GridItem, Input, Text } from '@chakra-ui/react'
// import ButtonType from './Button'
// import Headings from './Headings'
// import Link from 'next/link'
// import { getAccount,getNetwork,getWalletClient } from '@wagmi/core'



// const ProfileContainer = () => {
  
//   async function upload() {
//     const account = getAccount() 
//     const { chain, chains } = getNetwork()
//     const walletClient = await getWalletClient()

//     console.log(walletClient)

//     if (!account.isConnected) {
//       alert("Please Connect your Wallet")
//     }
//     else if (chain?.id !== 1287) {
//       alert("Please connect to Moonbean Alpha network")
//     }
//     else {
//       await walletClient?.writeContract({
        
//       })
//       console.log(account.isConnected)
//       console.log(chain?.name)
//       console.log(walletClient)

//     }
//   }

//   return (
//     <>
//       {/* Side Navbar */}
//       <Grid minH='100vh' gridTemplateColumns='repeat(12,1fr)'>
//         <GridItem className=' bg-slate-200 pt-28 pb-0 flex flex-col justify-start gap-6 items-center md:px-10 md:pb-10 text-center px-4' colSpan={{
//           base: 12,
//           md: 4,
//           xl: 3,
//         }}>
//           <ButtonType label='My Profile' color='white' bgColor='bg-blue-500' bgModified='blue.500' />
//           <Link className=' font-semibold' href='/market'>
//             Market Place
//           </Link>
//           <ButtonType label='Upload a new content' color='purple' bgColor='bg-transparent' border='purple' />
//         </GridItem>
//         {/* Main Content */}
//         <GridItem className=' pt-1 pb-10 md:pt-28' colSpan={{
//           base: 12,
//           md: 8,
//           xl: 9,
//         }} >
//           <Flex justifyContent='flex-end' className='px-4'>
//             <ButtonType className=' ' label='Publish' color='white' bgColor='bg-blue-500' bgModified='blue.500' onClick={async () => {
//               console.log("clicked")
//               upload()
//             }} />
//           </Flex>
//           <Headings>
//             <Flex flexWrap='wrap'>
//               <Input type='file' />
//               <Text>Click here to upload or drag here</Text>
//             </Flex>
//           </Headings>
//         </GridItem>
//       </Grid>
//     </>
//   )
// }

// export default ProfileContainer