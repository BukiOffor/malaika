'use client';
import {
  Avatar,
  AvatarGroup,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Progress,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import moonImg from '../../public/cardImg.svg';
import Image from 'next/image';
import CustomButton from './CustomButton';
import { GiCardExchange } from 'react-icons/gi';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import CustomModal from './CustomModal';
import { useRef,useState } from 'react';
import { getAccount, prepareWriteContract, writeContract, waitForTransaction } from '@wagmi/core'
import { factoryAbi, malaikaAbi } from '@/constants'
import server from '@/server';



const CardAvatar = ({ contractAddress, title, goal, providers, AmountRemaining }:
  { contractAddress: string, title: string, goal: string, providers: string, AmountRemaining: string }) => {
  console.log("Avatar contract is ",contractAddress); // Output: "My contract"

  const progress = 0 || (parseInt(AmountRemaining) * 100) / parseInt(goal)
  const {
    isOpen: IsOpen1,
    onClose: OnClose1,
    onOpen: OnOpen1,
  } = useDisclosure();
  const {
    isOpen: IsOpen2,
    onClose: OnClose2,
    onOpen: OnOpen2,
  } = useDisclosure();
  const cancelRef = useRef();

  const { address, isConnected } = getAccount();

  async function cancelContract() {
    const request = await prepareWriteContract({
      //@ts-ignore
      address: contractAddress,
      abi: malaikaAbi,
      functionName: 'revertDonations',
      args: []
    })
    console.log('value is ', request)
      const { hash } = await writeContract(request)
      const data = await waitForTransaction({
        confirmations: 1,
        hash,
      })
      console.log(hash);
      if (data.status == 'success') {
        //delete contract from database
        await server.delete(`del/${address}`)
        await server.delete(`docsDel/${contractAddress}`)
        console.log(data);
        alert("Contract has been cancelled and donations reverted")
        return true
      }

  }

  async function withdraw() {
    const request = await prepareWriteContract({
      //@ts-ignore
      address: contractAddress,
      abi: malaikaAbi,
      functionName: 'withdraw',
      args: []
    })
    console.log('value is ', request)
      const { hash } = await writeContract(request)
      const data = await waitForTransaction({
        confirmations: 1,
        hash,
      })
      console.log(hash);
      if (data.status == 'success') {
        console.log(data);
        alert("Withdrawal was succesfull")

        return true
      } else {
        alert("Withdrawal was not succesfull, please try again")

      }

  }


  return (
    <>
      {/* Custom dialog 1*/}
      <CustomModal
        hasTextField
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={OnClose1}
        isOpen={IsOpen1}
        isCentered
        iconClassName='text-blue-600'
        icon={GiCardExchange}
        iconLabel='Withdraw funds'
        address='Wallet address:'
        addressText='000XA...0Xe'
        primaryText='Confirm wallet address'
        addressNumber='0xaB6B4...14E'
      >
        <CustomButton
          title='Withdraw'
          textColor='white'
          bgColor='black'
          shadow
          className='hover:bg-gray-900 hover:font-medium mt-6 ml-[35%]'
          onClick={async()=>{await withdraw()}}
        />
      </CustomModal>
      {/* Custom dialog 2*/}
      <CustomModal
        hasTextField
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={OnClose2}
        isOpen={IsOpen2}
        isCentered
        iconClassName='text-rose-600'
        icon={IoIosCloseCircleOutline}
        iconLabel='Cancel project'
        secondaryText='You will no longer have access to this project after canceling. Funds will be automatically transferred to all backers.'
      >
        <ButtonGroup className='flex-col gap-2 ml-[30%] '>
          <CustomButton
            title='Cancel project'
            textColor='white'
            bgColor='red.500'
            shadow
            className='hover:bg-rose-600 hover:font-medium'
            onClick={async()=>{await cancelContract()}}
        />
          <CustomButton
            onClick={OnClose2}
            title='Go Back'
            textColor='black'
            shadow
            border
            className=' hover:font-medium'
          />
        </ButtonGroup>
      </CustomModal>
      <Heading
        as='h3'
        size={{
          base: 'md',
          lg: 'lg',
        }}
        mb='2'
      >
        Published project
      </Heading>
      <Card className='shadow-primary'>
        <CardHeader>
          <Flex className=' items-center gap-2 justify-between w-[58%]'>
            <Heading as='h4' size='sm'>
              Name
            </Heading>
            <Heading as='h4' size='sm' className='md:-ml-[2.5rem]'>
              Goal
            </Heading>
            <Heading as='h4' size='sm'>
              Progress
            </Heading>
            <Heading as='h4' size='sm'>
              Backers
            </Heading>
          </Flex>
        </CardHeader>
        <CardBody className=''>
          {/* 1ST AVATAR CONTAINER */}
          <Flex
            alignItems='center'
            className='w-full mb-4 overflow-auto border border-black rounded-md bg-slate-900'
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
                <Text ml='2'>{ title}</Text>
              </Flex>
              <Text className=''>${goal}</Text>
              <Progress
                className='rounded-full'
                value ={progress}
                w={80}
                size='sm'
                colorScheme='green'
              />
              <Stack direction='row' pr='1rem' spacing={2} alignItems='center'>
                <AvatarGroup size='sm'>
                  <Avatar name='Kent Dodds' src='https://bit.ly/kent-c-dodds' />
                  <Avatar
                    name='Prosper Otemuyiwa'
                    src='https://bit.ly/prosper-baba'
                  />
                  <Avatar
                    name='Christian Nwamba'
                    src='https://bit.ly/code-beast'
                  />
                </AvatarGroup>
                <Text className='shrink-0'>{providers} backers.</Text>
              </Stack>
            </Flex>
            <ButtonGroup spacing={8} className='px-4 py-2 bg-white'>
              <CustomButton
                onClick={OnOpen1}
                iconClassName='text-blue-600'
                icon={GiCardExchange}
                textColor='black'
                border
                title='Withdraw funds'
              />
              <CustomButton
                onClick={OnOpen2}
                iconClassName='text-rose-600'
                icon={IoIosCloseCircleOutline}
                textColor='black'
                border
                title='Cancel project'
              />
            </ButtonGroup>
          </Flex>
        </CardBody>
      </Card>
    </>
  );
};

export default CardAvatar;
