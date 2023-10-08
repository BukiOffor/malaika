'use client';
import CardComponent from '@/components/CardComponent';
import Container from '@/components/Container';
import CustomButton from '@/components/CustomButton';
import CustomHeading from '@/components/CustomHeading';
import GridContent from '@/components/GridContent';
import ScrollToTopButton from '@/components/ScrollToTop';
import SecondaryHeading from '@/components/SecondaryHeading';
import Image from 'next/image';
import heroImg from '../../public/bgImage.svg';
import Link from 'next/link';
import { useColorMode } from '@chakra-ui/react';
import server from '../../src/server';
import { useState, useEffect } from 'react';
import { getAccount } from '@wagmi/core';

export default function Home() {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === 'light' ? 'white' : 'slate.800';
  const btnBgColor = colorMode === 'light' ? 'black' : 'white';
  const textColor = colorMode === 'light' ? 'black' : 'white';

  const [Marketplace, setMarkeplace] = useState([]);
  const [DynamicData, setDynamicData] = useState('');
  const [Items, setItems] = useState([]);
  const { isConnected } = getAccount();

  async function getMarket() {
    const {
      data: { data },
    } = await server.get('docsAll');
    if (data != undefined) {
      setMarkeplace(data);
      setItems(data.slice(0, 3));
      console.log(data);
      return data;
    } else {
      console.log('bad response');
    }
  }

  useEffect(() => {
    async function updateUI() {
      if (isConnected) {
        const response = await getMarket();
        console.log('marketplace are ', response);
        //@ts-ignore
        //const amount: any = await getSingle()
        console.log(amount);
      }
    }
    updateUI();
  }, [isConnected]);

  return (
    <main className='relative overflow-hidden'>
      <p className='absolute top-20 animate-marquee whitespace-nowrap w-full '>
        Welcome to Malaika, please connect your wallet for a full experience
      </p>
      <CustomHeading
        className={`text-${textColor as string} bg-${bgColor as string} pt-28`}
        primaryHeading='Unleash the Power of Your Purpose: Crowdfund with Malaika!'
        description='The Blockchain Powered Crowdfunding Platform that Rewards Backers and Fuels Dreams'
        leftButton='Create a project'
        rightButton='Support a project'
        leftBtnBgColor={btnBgColor as string}
        rightBtnTextColor={textColor as string}
        rightBtnClassName='hover:font-semibold'
        leftBtnClassName='hover:font-semibold'
      />
      <Container className={`pb-16 bg-${bgColor as string}`}>
        <Image
          className='object-cover rounded-lg'
          src={heroImg}
          width={1920}
          height={1080}
          alt='Hero Image'
          priority
          blurDataURL='data:image/svg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhQJ/6t8QOwAAAABJRU5ErkJggg=='
          placeholder='blur'
        />
      </Container>
      <GridContent
        className={`py-16 text-${textColor as string} bg-${bgColor as string}`}
        mainH='How Malaika Works'
        mainT={`Whether you're an individual with a brilliant idea, a group with a collective mission, or an organization with  a cause to champion, Malaika provides you with a user-friendly platform to set up your campaign. Share your story, define your funding target, and showcase your vision to the world `}
        priH='Create Your Vision'
        priT={`Get started by crafting your project with a compelling description and visuals, and defining your funding goal and reward tokens `}
        secH='Rally Support and Achieve Success'
        secT={`Launch your campaign on Malaika's blockchain-powered platform, share it widely, and witness global backers rally to support your cause, driving your project to success `}
        terH='Reward Your Backers and Bring Your Vision to Life'
        terT={`Show appreciation to backers with unique tokens, bring your projects to life, provide updates, and build lasting relations through Malaika's rewarding platform`}
      />
      <Container
        className={`pt-16 pb-10 bg-${bgColor as string} text-${
          textColor as string
        }`}
      >
        <SecondaryHeading
          center
          heading='Featured Projects'
          title={`The Malaika platform is the best way to invest in projects and get rewarded for your support. `}
        />
      </Container>
      <Container className=''>
        {Items.map((item) => (
          <CardComponent
            key={item}
            contractaddr={item['_id']}
            title={item['title']}
            description={item['description']}
            howMuch={item['howMuch']}
            minimum={item['minimum']}
            name={item['name']}
          />
        ))}
        {/* <CardComponent />
        <CardComponent />
        <CardComponent /> */}
      </Container>
      <Container className='py-12 text-center'>
        <Link
          href='/marketplace'
          className=' text-lg font-[600] border border-black rounded-full px-8 py-4 transition duration-300 hover:bg-black hover:text-white'
        >
          Explore More
        </Link>
      </Container>
      <GridContent
        className={`py-16 text-${textColor as string} bg-${bgColor as string}`}
        mainH='Why Malaika?'
        mainT={`Malaika Empowering creators, rewarding backers. A blockchain-powered crowdfunding platform where creators break free from limits, and backers earn tokens for meaningful support. Together, we ignite innovation and make a difference`}
        priH='Empowering Dreams'
        priT={`Malaika offers a platform where creators can showcase their innovative ideas, passion projects, and social causes, enabling them to raise funds and turn their dreams into reality`}
        secH='Blockchain Security'
        secT={`With Malaika built on the blockchain, both creators and backers benefits from enhanced security and transparency. Smart contracts ensure that funds are securely managed, and backers can trust in the authenticity of projects`}
        terH='Rewards and Impact'
        terT={`Backers on Malaika not only support meaningful projects but also receive rewards in returns, making their contributions even more fulfilling. Join Malaika to be a part of a positive impact on the projects and causes you care about`}
      />
      <Container className={`p-10 text-${textColor as string} bg-gray-800`}>
        <CustomHeading
          className={`py-8 mx-auto bg-${
            bgColor as string
          } rounded-md shadow-custom`}
          secondaryHeading='With Malaika'
          primaryHeading='Boost Your Impact'
          description='As a backer, you can earn rewards for helping to fund projects. Support the projects you believe in and get rewarded for it!'
          leftButton='Create a project'
          rightButton='Support a project'
          rightBtnTextColor={textColor as string}
          leftBtnBgColor={btnBgColor as string}
          rightBtnClassName='hover:font-semibold'
          leftBtnClassName='hover:font-semibold'
        />
      </Container>
      <ScrollToTopButton />
    </main>
  );
}
