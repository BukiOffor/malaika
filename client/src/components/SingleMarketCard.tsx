"use client";

import {
  Card,
  CardBody,
  CardFooter,
  Heading,
  Progress,
  Stack,
  Text,
  Box,
  Image,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import Link from "next/link";
import { LuChevronDown } from "react-icons/lu";
import CustomButton from "./CustomButton";
import { getAccount, readContract, } from '@wagmi/core';
import { factoryAbi, malaikaAbi } from '@/constants';
import { prepareWriteContract, writeContract, waitForTransaction } from '@wagmi/core';
import { useState, useEffect } from "react";
import { parseEther } from 'viem';
import { useRouter } from 'next/navigation';
import { usePathname, useSearchParams } from 'next/navigation'




export default function SingleMarketCard() {
  const [Donaters, setDonaters] = useState([]) // see the array to loop through to display contributors
  const { isConnected } = getAccount()
  const [AmountDonated, setAmountDonated] = useState('0');

  //const params = useRouter();
  
  const params = useSearchParams();

  const contractaddr = params!.get('contractaddr');
  const title = params!.get('title');
  const description = params!.get('description');
  const howMuch = params!.get('howMuch');
  const minimum = params!.get('minimum');
  const name = params!.get('name');

  
  
  async function donate(amount:string) {
    if (isConnected) {
      const request = await prepareWriteContract({  
        //@ts-ignore
        address: contractaddr,
        abi: malaikaAbi,
        functionName: 'donate',
        args: [],
        value: parseEther(amount.toString())
      });
      console.log('value is ', request);
      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        confirmations: 1,
        hash,
      });
      console.log(hash);
      if (data.status == 'success') {
        console.log(data);
        alert("your donation was succesfull")
        return true;
      } else {
        alert("Your transaction could not be processed, please try again")
      }
    }
  }

  async function getHolders() {
    const receipt = await readContract({
      //@ts-ignore
      address: contractaddr,
      abi: malaikaAbi,
      functionName: 'getHoldersArray',
      args: [],
    });
    //@ts-ignore
    setDonaters(receipt)
    return receipt
  } 
  async function getAmount() {
    const receipt = await readContract({
      //@ts-ignore
      address: contractaddr,
      abi: malaikaAbi,
      functionName: 'getRemainderBalance',
      args: [],
    });
    // const response = await readContract({
    //   //@ts-ignore
    //   address: contractaddr,
    //   abi: malaikaAbi,
    //   functionName: 'getAmountNeeded',
    //   args: [],
    // });
    //@ts-ignore
    const request = BigInt(howMuch) - receipt
    console.log('getter is', request)
    setAmountDonated(request.toString());
    return request
  }
  useEffect(() => {
    async function updateUI() {
      if (isConnected) {
        const holders = await getHolders();
        console.log("holders are ", holders);
        //@ts-ignore
        //setDonaters(holders)
        const amount: any = await getAmount()
        console.log('amount is',amount)
      }
    }  
    updateUI();
  }, [isConnected]);


  
  
  
  return (
    <>
      <Box className="px-4 pt-32 mx-auto lg:px-12 md:px-8">
        <Box>
          <Heading as="h3" mb={2}>
            The {title}
          </Heading>
          <Text>
            You are supporting this <Text as="strong">{title}</Text>. Your
            support matters
          </Text>

          <Card
            className="mt-5 border shadow-primary border-slate-400"
            overflow="hidden"
          >
            <Image
              className="object-fill"
              src="https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fHRoZSUyMG1vb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=80"
              alt="Green double couch with wooden legs"
              height="auto"
            />
            <CardBody>
              <Stack mt="6" spacing="3">
                <Text>Created by { name }</Text>
                <Heading size="lg">{title}</Heading>
                <Text>
                 {description}
                </Text>
                <Box mt="4">
                  <Progress
                    className="mb-2 font-semibold rounded-full"
                    value={60}
                    size="md"
                    colorScheme="green"
                  />

                  <Text className="font-semibold" fontSize="md">
                    <span className="text-slate-600">${AmountDonated} raised of</span>{" "}
                    ${howMuch}
                  </Text>
                </Box>
              </Stack>
              <Stack spacing={3}>
                <Heading size="md" mt={6}>
                  Current backers({Donaters.length})
                </Heading>
                {/** list of donators */}
                
                <ul>
              {Donaters.map((item) => (
                <li key={item} className="mt-3">
                  <Text className="text-sm ">
                  {item}
                  <span className="block font-bold"></span>
                </Text>
                </li>
              ))}
            </ul>

                
                <span className="block pb-8 font-bold border-b border-slate-600"></span>
              </Stack>
            </CardBody>
            <CardFooter className="flex flex-col items-start justify-between -mt-8 lg:flex-row ">
              <Stack>
                <Heading size="md" mt={6}>
                  Enter how much you&apos;re pledging
                </Heading>
                <Formik
                  initialValues={{
                    howMuch: "",
                  }}
                  onSubmit={async(values) => await donate(values.howMuch)}
                >
                  {({ handleSubmit, errors, touched, isSubmitting }) => (
                    <Form onSubmit={handleSubmit}>
                      <FormControl
                        isInvalid={!!errors.howMuch && touched.howMuch}
                      >
                        <FormLabel htmlFor="howMuch">
                          Minimum buy-in for this project is ${minimum}
                          {/* <Link
                            className="underline transition duration-300 hover:no-underline"
                            href="/marketplace/marketId/learnmore"
                          >
                            Learn More
                          </Link> */}
                        </FormLabel>
                        <Box border="1px solid gray" borderRadius="md">
                          <InputGroup>
                            <InputLeftElement>
                              <Text>$</Text>
                            </InputLeftElement>
                            <Field
                              className={`pl-8 pr-20`}
                              as={Input}
                              name="howMuch"
                              id="howMuch"
                              placeholder={minimum}
                              type="number"
                              variant="outline"
                              validate={(value: string) => {
                                let error;
                                if (!value) {
                                  error = "Please enter an amount";
                                }
                                return error;
                              }}
                            />
                            <InputRightElement>
                              <span className="mr-4 -ml-10"> USD </span>
                              <LuChevronDown color="green.500" />
                            </InputRightElement>
                          </InputGroup>
                        </Box>

                        <FormErrorMessage>{errors.howMuch}</FormErrorMessage>
                      </FormControl>
                      <CustomButton
                        type="submit"
                        className="mt-6 w-fit hover:font-semibold"
                        title="Buy-in"
                        bgColor="black"
                        textColor="white"
                      />
                    </Form>
                  )}
                </Formik>
              </Stack>
              <Stack>
                <Heading size="md" mt={6}>
                  Contact address
                </Heading>
                <Text className="text-sm break-all ">
                  {contractaddr}
                  <Link
                    className="underline transition block font-[500] hover:no-underline duration-300"
                    href={`https:/sepolia.etherscan.io/address/${contractaddr}`}
                  >
                    View on etherscan
                  </Link>
                </Text>
              </Stack>
            </CardFooter>
          </Card>
        </Box>
      </Box>
    </>
  );
}
