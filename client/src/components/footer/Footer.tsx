'use client';

interface FooterMenuItemsProps {
  [key: string]: string;
}

const footerMenuItems: FooterMenuItemsProps[] = [
  { name: 'FAQs', href: '/' },
  { name: 'Contact', href: '/contact' },
  { name: 'About', href: '/about' },
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms of Use', href: '/terms-of-use' },
  { name: 'Cookies Settings', href: '/cookies-settings' },
];

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  Flex,
  Heading,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import Container from '../Container';
import Logo from '../Logo';
import Link from 'next/link';
import { faqsDocs } from '../../../docs/docs';

const Footer = () => {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === 'light' ? 'white' : 'slate-900';
  const textColor = colorMode === 'light' ? 'slate-800' : 'white';
  return (
    <>
      <Container
        className={`py-20 bg-${bgColor as string} text-${textColor as string}`}
      >
        <Heading
          size={{
            base: 'md',
            md: 'lg',
          }}
          pt={3}
        >
          Frequently Asked Questions (FAQs) - Project Malaika
        </Heading>
        <Accordion py={6} allowToggle>
          {faqsDocs.map((doc) => (
            <AccordionItem key={doc.title}>
              <h2>
                <AccordionButton>
                  <Box
                    className={` text-${textColor as string} font-[500]`}
                    as='span'
                    flex='1'
                    textAlign='left'
                  >
                    {doc.title}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel className='text-sm ' pb={4}>
                {doc.description}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
        <Text>
          We hope this FAQ section addresses your questions about Project
          Malaika. If you have any additional queries, feel free to reach out to
          our support team for further assistance.
        </Text>
        <Center pb={16} pt={20}>
          <Flex className='flex-col items-center gap-6'>
            <Logo />
            <Flex
              className={`items-center gap-8 font-semibold text-${
                textColor as string
              } `}
            >
              {footerMenuItems.slice(0, 3).map((item, i) => (
                <Link
                  className='transition-all duration-300 ease-in-out hover:text-slate-700 hover:underline'
                  key={i}
                  href={item.href}
                >
                  {item.name}
                </Link>
              ))}
            </Flex>
          </Flex>
        </Center>
        <Flex
          pt={8}
          flexDir={{
            base: 'column',
            md: 'row',
          }}
          className='items-center justify-between gap-4 text-sm border-t border-t-slate-800'
        >
          <Text>
            © {new Date().getFullYear()} Malaika. All rights reserved.
          </Text>
          <Flex className='items-center justify-between gap-2 '>
            {footerMenuItems.slice(3, 6).map((item, i) => (
              <Link
                className={`text-${
                  textColor as string
                } underline transition-all duration-300 ease-in-out hover:text-slate-700 hover:no-underline`}
                key={i}
                href={item.href}
              >
                {item.name}
              </Link>
            ))}
          </Flex>
        </Flex>
      </Container>
    </>
  );
};

export default Footer;
