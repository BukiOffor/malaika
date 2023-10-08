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

export default function UserDashboard() {
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
          Portfolio projects(3)
        </Heading>
        <Card className='shadow-primary'>
          <CardHeader>
            <Flex className='items-center justify-between gap-2 w-[58%] md:w-[90%]'>
              <Heading as='h4' size='sm'>
                Name
              </Heading>
              <Heading as='h4' size='sm' className='md:-ml-[2.5rem]'>
                Amount staked
              </Heading>
              <Heading as='h4' size='sm'>
                Progress
              </Heading>
            </Flex>
          </CardHeader>
          <CardBody className=''>
            {/* 1ST AVATAR CONTAINER */}
            <Flex
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
            </Flex>
          </CardBody>
        </Card>
      </Container>
    </>
  );
}
