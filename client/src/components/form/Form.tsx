'use client';

import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Radio,
  Textarea,
  Text,
  Stack,
  RadioGroup,
  Center,
  VisuallyHidden,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  ButtonGroup,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useColorMode,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import Image from 'next/image';
import CustomButton from '../CustomButton';
import imgPlaceholder from '../../../public/fileplaceholder.png';
import { LuChevronDown } from 'react-icons/lu';
import {
  prepareWriteContract,
  writeContract,
  getAccount,
  waitForTransaction,
  watchContractEvent
} from '@wagmi/core';
import { factoryAbi } from '../../constants/index';
import { parseEther } from 'viem';
import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment } from 'react';
import { useWeb3Modal } from '@web3modal/react';
import { useRouter } from 'next/navigation';
import { publicClient } from '../../providers/client'

import server from "../../server"

const FormPage = () => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address, isConnected } = getAccount();
  const { open, close } = useWeb3Modal();

  const sepoliapriceFeed = '0x694AA1769357215DE4FAC081bf1f309aDC325306';
  const localhostFeed = '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e';
  const localhostAddr = '0xd3924Aed3dbE4bdBC12FBc5917bBa7202141FE6F';
  const sepolia = '0xAa08e1fdc5c1b62343088a123173692F70f9930C';

  let [isOpened, setIsOpened] = useState(false);
  let [completed, setCompleted] = useState(false);

  // modal to ask users to connect
  function closeModal() {
    setIsOpened(false);
  }
  // modal to ask users to connect
  function openModal() {
    setIsOpened(true);
  }




//---------------------------watch contract event ---------------------------

//---------------------------unwatch contract event ---------------------------


  //@ts-ignore
  async function createProject(amount, minAmount, percentage, stake, values) {
    if (isConnected) {
     
      const request = await prepareWriteContract({
        address: sepolia,
        abi: factoryAbi,
        functionName: 'CreateCrowdSource',
        value: parseEther(stake.toString()),
        args: [amount, minAmount, sepoliapriceFeed, address, percentage],
      });
      console.log('value is ', amount, minAmount);
      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        confirmations: 1,
        hash,
      });
      console.log(hash);
      if (data.status == 'success') {
        
        const unwatch = watchContractEvent(
          {
            address: sepolia,
            abi: factoryAbi,
            eventName: 'CrowdSourceCreated',
          },
          //@ts-ignore
          (log) => console.log('log is', log.args.contractAddress),
        )
        console.log(data);
        setCompleted(true);
        const Contractbyte = data.logs[1].topics[1]?.slice(-40)
        const contractAddress = `0x${Contractbyte}`
        console.log(contractAddress);
        await server.post(`docsAppend/${contractAddress}`, values)
        await server.post(`append/${contractAddress}`, values) 
        onOpen();
        unwatch()
        return true;
      }
    } else {
      openModal();
    }
  }

  return (
    <>
      {/**------------------------------------------------------> WEB MODAL<------------------------------------------------------ */}
      <Transition appear show={isOpened} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex items-center justify-center min-h-full p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-medium leading-6 text-gray-900'
                  >
                    Connect Wallet
                  </Dialog.Title>
                  <div className='mt-2'>
                    <p className='text-sm text-gray-500'>
                      Opps!! did you forget to connect your wallet?. please
                      connect your wallet to continue with Transaction
                    </p>
                  </div>

                  <div className='mt-4'>
                    <button
                      type='button'
                      className='inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                      onClick={async () => {
                        await open();
                        isConnected ? closeModal : null;
                      }}
                    >
                      connect wallet
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/** <---------------------------------------End Modal Pop Up -----------------------------------------------------------> */}

      <Grid
        minH='auto'
        px={{
          base: 1,
          md: 4,
        }}
        overflowY='auto'
        maxW={{
          base: 'full',
          md: '70%',
          lg: '60%',
          xl: '50%',
        }}
        marginX='auto'
        pt={20}
        pb={10}
      >
        <Box p={6} borderRadius='md'>
          <Formik
            initialValues={{
              name: '',
              title: '',
              description: '',
              category: '',
              howMuch: '',
              minimum: '',
              percentage: '',
              upload: '',
              stake: '',
              creator: address
            }}
            onSubmit={async (values) =>
              await createProject(
                values.howMuch,
                values.minimum,
                values.percentage,
                values.stake,
                values
              )
            }
          >
            {({ handleSubmit, errors, touched, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <FormControl isInvalid={!!errors.name && touched.name}>
                    <FormLabel htmlFor='name'>Your nickname</FormLabel>
                    <Box border='1px solid gray' borderRadius='md'>
                      <Field
                        as={Input}
                        name='name'
                        id='name'
                        type='text'
                        variant='outline'
                        validate={(value: string) => {
                          let error;
                          if (!value) {
                            error = 'Nickname is required';
                          }
                          return error;
                        }}
                      />
                    </Box>
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  </FormControl>
                  {/* Title Field */}
                  <FormControl isInvalid={!!errors.name && touched.name}>
                    <FormLabel htmlFor='title'>Your project title</FormLabel>
                    <Box border='1px solid gray' borderRadius='md'>
                      <Field
                        as={Input}
                        name='title'
                        id='title'
                        type='text'
                        variant='outline'
                        validate={(value: string) => {
                          let error;
                          if (!value) {
                            error = 'Project title is required';
                          }
                          return error;
                        }}
                      />
                    </Box>
                    <FormErrorMessage>{errors.title}</FormErrorMessage>
                  </FormControl>
                  {/* TextArea Field */}
                  <FormControl isInvalid={!!errors.name && touched.name}>
                    <FormLabel htmlFor='description'>
                      Your project description
                    </FormLabel>
                    <Box border='1px solid gray' borderRadius='md'>
                      <Field
                        as={Textarea}
                        name='description'
                        id='description'
                        type='text'
                        placeholder='Describe your project and why you need a support'
                        variant='outline'
                        validate={(value: string) => {
                          let error;
                          if (!value) {
                            error = 'Project description is required';
                          }
                          return error;
                        }}
                      />
                    </Box>
                    <FormErrorMessage>{errors.description}</FormErrorMessage>
                  </FormControl>
                  {/* Radio Items */}
                  <Text>Your project&apos;s category</Text>
                  <RadioGroup py={4} fontSize='sm' name='category'>
                    <Grid templateColumns='repeat(2, 1fr)' gap={4}>
                      <GridItem>
                        <Stack spacing={4}>
                          <Field
                            as={Radio}
                            name='category'
                            value='realEstate'
                            id='realEstate'
                            colorScheme='whatsapp'
                            variant='filled'
                          >
                            Real Estate
                          </Field>
                          <Field
                            as={Radio}
                            name='category'
                            value='blockChain'
                            id='blockChain'
                            colorScheme='whatsapp'
                            variant='filled'
                          >
                            Blockchain
                          </Field>
                          <Field
                            as={Radio}
                            name='category'
                            value='DeFi'
                            id='DeFi'
                            colorScheme='whatsapp'
                            variant='filled'
                          >
                            DeFi
                          </Field>
                        </Stack>
                      </GridItem>
                      <GridItem>
                        <Stack spacing={4}>
                          <Field
                            as={Radio}
                            name='category'
                            value='poppins'
                            id='poppins'
                            colorScheme='whatsapp'
                            variant='filled'
                          >
                            Poppins
                          </Field>
                          <Field
                            as={Radio}
                            name='category'
                            value='gaming'
                            id='gaming'
                            colorScheme='whatsapp'
                            variant='filled'
                          >
                            Gaming
                          </Field>
                          <Field
                            as={Radio}
                            name='category'
                            value='other'
                            id='other'
                            colorScheme='whatsapp'
                            variant='filled'
                          >
                            Other
                          </Field>
                        </Stack>
                      </GridItem>
                    </Grid>
                  </RadioGroup>
                  {/* How Much */}
                  <FormControl isInvalid={!!errors.name && touched.name}>
                    <FormLabel htmlFor='howMuch'>
                      How much would you like to raise?
                    </FormLabel>
                    <Box border='1px solid gray' borderRadius='md'>
                      <InputGroup>
                        <InputLeftElement>
                          <Text>$</Text>
                        </InputLeftElement>
                        <Field
                          className={`pl-8`}
                          as={Input}
                          name='howMuch'
                          id='howMuch'
                          type='number'
                          variant='outline'
                          validate={(value: string) => {
                            let error;
                            if (!value) {
                              error = 'Please enter an amount';
                            }
                            return error;
                          }}
                        />
                        <InputRightElement>
                          <LuChevronDown color='green.500' />
                        </InputRightElement>
                      </InputGroup>
                    </Box>

                    <FormErrorMessage>{errors.howMuch}</FormErrorMessage>
                  </FormControl>
                  {/* Minimum Buy */}
                  <FormControl isInvalid={!!errors.name && touched.name}>
                    <FormLabel htmlFor='minimum'>Minimum Buy-in?</FormLabel>
                    <Box border='1px solid gray' borderRadius='md'>
                      <InputGroup>
                        <InputLeftElement>
                          <Text>$</Text>
                        </InputLeftElement>
                        <Field
                          className={`pl-8`}
                          as={Input}
                          name='minimum'
                          id='minimum'
                          type='number'
                          variant='outline'
                          validate={(value: string) => {
                            let error;
                            if (!value) {
                              error = 'Please specify a minimum Buy-in';
                            }
                            return error;
                          }}
                        />
                        <InputRightElement>
                          <LuChevronDown color='green.500' />
                        </InputRightElement>
                      </InputGroup>
                    </Box>
                    <FormErrorMessage>{errors.minimum}</FormErrorMessage>
                  </FormControl>
                  {/* Percentage */}
                  <FormControl isInvalid={!!errors.name && touched.name}>
                    <FormLabel htmlFor='percentage'>
                      ROI to take on project?
                    </FormLabel>
                    <Box border='1px solid gray' borderRadius='md'>
                      <InputGroup>
                        <InputLeftElement>
                          <Text>%</Text>
                        </InputLeftElement>
                        <Field
                          className={`pl-8`}
                          as={Input}
                          name='percentage'
                          id='percentage'
                          type='number'
                          variant='outline'
                          validate={(value: string) => {
                            let error;
                            if (!value) {
                              error = 'Please provide a percentage';
                            }
                            return error;
                          }}
                        />
                        <InputRightElement>
                          <LuChevronDown color='green.500' />
                        </InputRightElement>
                      </InputGroup>
                    </Box>
                    <FormErrorMessage>{errors.percentage}</FormErrorMessage>
                  </FormControl>

                  {/* Stake Amount */}
                  <FormControl isInvalid={!!errors.name && touched.name}>
                    <FormLabel htmlFor='percentage'>Amount to stake?</FormLabel>
                    <Box border='1px solid gray' borderRadius='md'>
                      <InputGroup>
                        <InputLeftElement>
                          <Text>$</Text>
                        </InputLeftElement>
                        <Field
                          className={`pl-8`}
                          as={Input}
                          name='stake'
                          id='stake'
                          type='text'
                          variant='outline'
                          validate={(value: string) => {
                            let error;
                            if (!value) {
                              error = 'Please provide a stake';
                            }
                            return error;
                          }}
                        />
                        <InputRightElement>
                          <LuChevronDown color='green.500' />
                        </InputRightElement>
                      </InputGroup>
                    </Box>
                    <FormErrorMessage>{errors.stake}</FormErrorMessage>
                  </FormControl>

                  {/* Upload Content */}
                  <Center textAlign='center'>
                    <Stack>
                      <FormControl isInvalid={!!errors.name && touched.name}>
                        <FormLabel htmlFor='upload' cursor='pointer'>
                          <Image
                            className='mx-auto '
                            src={imgPlaceholder}
                            alt='File upload Image'
                          />
                        </FormLabel>
                        <VisuallyHidden>
                          <Field
                            as={Input}
                            name='upload'
                            id='upload'
                            type='file'
                          />
                        </VisuallyHidden>
                      </FormControl>
                      <Text>Project photo/video</Text>
                      <Text mb={3}>A high quality photo is required</Text>
                      <CustomButton
                        className='hover:font-semibold'
                        title='Upload'
                        textColor={colorMode === 'light' ? 'black' : 'white'}
                        border
                      />
                    </Stack>
                  </Center>
                  {/* Next Button */}
                  <CustomButton
                    onClick={async () => {
                      // isSubmitting ?
                      //   null :
                      // completed&&onOpen();
                    }}
                    type='submit'
                    title='Submit'
                    bgColor='black'
                    textColor='white'
                    className='hover:font-semibold hover:bg-slate-900'
                  />
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      </Grid>
      {/* Modal Popup */}
      <Modal
        size='xs'
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset='slideInBottom'
      >
        <ModalOverlay />
        <ModalContent p={8}>
          <Center>
            <Stack spacing={20}>
              <Text textAlign='center' as='strong'>
                Congratulations! <br />
                Your project has been listed successfully.{' '}
              </Text>
              <ButtonGroup gap={2} flexDirection='column'>
                <CustomButton
                  onClick={() => {
                    onClose();
                    setCompleted(false);
                    router.push('/creator-dashboard');
                  }}
                  title='Continue to dashboard'
                  bgColor='black'
                  textColor='white'
                  className='hover:font-semibold hover:bg-slate-900'
                />
                <CustomButton
                  title='Share project'
                  border
                  textColor='black'
                  className='hover:font-semibold'
                />
              </ButtonGroup>
            </Stack>
          </Center>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FormPage;
