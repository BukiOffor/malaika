'use client';
import {
  Heading,
  Card,
  CardHeader,
  Flex,
  CardBody,
  Progress,
  Stack,
  AvatarGroup,
  Avatar,
  Text,
  ButtonGroup,
} from '@chakra-ui/react';
import Image from 'next/image';
import moonImg from './../../public/cardImg.svg';
import Container from './Container';
import AboutHeading from './AboutHeading';
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
import { getAccount, readContract } from '@wagmi/core';
import { factoryAbi, malaikaAbi } from '@/constants';
import { useEffect, useState } from 'react';
import { parseEther } from 'viem';



const sepoliaAddress = '0xAa08e1fdc5c1b62343088a123173692F70f9930C';
export default function UserDashboard() {

  const [details, setDetails] = useState([])
  const { isConnected, address } = getAccount();

  async function _isDonater(contractaddress: string) {
    const details = await readContract({
      //@ts-ignore
      address: contractaddress,
      abi: malaikaAbi,
      functionName: 'isDonater',
      args: [address],
    });
    return details;
}

  async function isDonater() {
    const marketplace = await readContract({
      address: sepoliaAddress,
      abi: factoryAbi,
      functionName: 'getMarketPlace',
      args: [],
    });
    console.log(marketplace);
    const contracts = [];
    for (let i = 0; i < marketplace.length; i++){
      //@ts-ignore
      const details = await _isDonater(marketplace[i]);
      //@ts-ignore
      if (details[0]) {
        contracts.push([marketplace[i],details[1]]);
      }
    }
    return contracts;
  }

  useEffect(() => {
    async function updateDetails() {
      if (isConnected) {
        //@ts-ignore
        const details = await isDonater();
        //@ts-ignore
        setDetails(details);
        console.log('details is ', details);
      }
    }
    updateDetails();
  }, [isConnected,address]);

  
  
  return (
    <>
      <Container className='pt-28'>
        <AboutHeading
          className='pb-16'
          title='Hello Poppings,'
          description='You can manage your projects and do much more here'
        />
        <Heading
          className='pt-8 border-t border-slate-700'
          as='h3'
          size={{
            base: 'md',
            lg: 'lg',
          }}
          mb='6'
        >
          Portfolio projects({details.length})
        </Heading>
        <Card className='shadow-primary'>
          <CardHeader>
            <Flex className='items-center justify-between gap-2 w-[58%] md:w-[90%]'>
              <Heading as='h4' size='sm'>
                Address
              </Heading>
              <Heading as='h4' size='sm' className='md:-ml-[2.5rem]'>
                Amount staked(ETH)
              </Heading>
              <Heading as='h4' size='sm'>
                Progress
              </Heading>
            </Flex>
          </CardHeader>
          <CardBody className=''>
{/* ---------------------------------------------NEW IMPLEMENTATION FROM CHANGE------------------------------------------------------ */}

            {
              details.map((item) => (
                <Flex key={item}
                alignItems='center'
                className='w-full py-3 mb-4 overflow-auto border border-black rounded-md bg-slate-900'
              >
                <Flex className='items-center justify-between flex-1 gap-2 px-6 text-white'>
                  <Flex alignItems='center ' className='shrink-0 '>
                    <Image
                      className='object-cover rounded-full '
                      width={25}
                      height={25}
                      src={moonImg}
                      alt='The moon Image'
                    />
                      <Text ml='2'>{item[0]}</Text>
                  </Flex>
                    <Text className=''>{item[1]}</Text>
                  <Progress
                    className='rounded-full'
                    value={70}
                    w={80}
                    size='sm'
                    colorScheme='green'
                  />
                </Flex>
              </Flex>
              ))
            }
            
{/* ---------------------------------------------1ST AVATAR CONTAINER------------------------------------------------------ */}
            {/* <Flex
              alignItems='center'
              className='w-full py-3 mb-4 overflow-auto border border-black rounded-md bg-slate-900'
            >
              <Flex className='items-center justify-between flex-1 gap-2 px-6 text-white'>
                <Flex alignItems='center ' className='shrink-0 '>
                  <Image
                    className='object-cover rounded-full '
                    width={25}
                    height={25}
                    src={moonImg}
                    alt='The moon Image'
                  />
                  <Text ml='2'>The Moon</Text>
                </Flex>
                <Text className=''>$500</Text>
                <Progress
                  className='rounded-full'
                  value={70}
                  w={80}
                  size='sm'
                  colorScheme='green'
                />
              </Flex>
            </Flex> */}


{/* ------------------------------------------------2ND AVATAR CONTAINER------------------------------------------------- */}


            {/* <Flex
              alignItems='center'
              className='w-full py-3 mb-4 overflow-auto border border-black rounded-md bg-slate-900'
            >
              <Flex className='items-center justify-between flex-1 gap-2 px-6 text-white'>
                <Flex alignItems='center ' className='shrink-0 '>
                  <Image
                    className='object-cover rounded-full '
                    width={25}
                    height={25}
                    src={moonImg}
                    alt='The moon Image'
                  />
                  <Text ml='2'>The Moon</Text>
                </Flex>
                <Text className=''>$500</Text>
                <Progress
                  className='rounded-full'
                  value={70}
                  w={80}
                  size='sm'
                  colorScheme='green'
                />
              </Flex>
            </Flex> */}

{/* ------------------------------------------------3RD AVATAR CONTAINER------------------------------------------------- */}

            {/* <Flex
              alignItems='center'
              className='w-full py-3 mb-4 overflow-auto border border-black rounded-md bg-slate-900'
            >
              <Flex className='items-center justify-between flex-1 gap-2 px-6 text-white'>
                <Flex alignItems='center ' className='shrink-0 '>
                  <Image
                    className='object-cover rounded-full '
                    width={25}
                    height={25}
                    src={moonImg}
                    alt='The moon Image'
                  />
                  <Text ml='2'>The Moon</Text>
                </Flex>
                <Text className=''>$500</Text>
                <Progress
                  className='rounded-full'
                  value={70}
                  w={80}
                  size='sm'
                  colorScheme='green'
                />
              </Flex>
            </Flex> */}

{/* ------------------------------------------------END AVATAR CONTAINER------------------------------------------------- */}            
          </CardBody>
        </Card>
      </Container>
    </>
  );
}
