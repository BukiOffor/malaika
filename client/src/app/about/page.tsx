'use client';

import AboutHeading from '@/components/AboutHeading';
import Container from '@/components/Container';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';
import {
  additionalEnhancementDocs,
  executionDocs,
  technicalLandscapeDocs,
} from '../../../docs/docs';

export default function AboutPage() {
  return (
    <>
      <Container className='pt-28'>
        <Stack spacing={5}>
          <AboutHeading
            title='About project Malaika:'
            description=' Welcome to Project Malaika, an innovative initiative designed to
        revolutionize crowdfunding and empower creators and backers in a new
        way. Our platform is a dynamic ecosystem that bridges project funding,
        community engagement, and shared success. At its core, Project Malaika
        aims to facilitate crowdfunding for various projects while ensuring
        transparency, accountability, and mutual benefit.'
          />
          <AboutHeading
            title='Overview'
            description="Project Malaika offers a novel approach to crowdfunding,
              particularly focused on supporting creative ventures, both on
              blockchain and off-chain. Our platform introduces a comprehensive
              framework that merges the worlds of fundraising and shared
              rewards. Let's dive into the intricate details of how Project
              Malaika operates and how it can transform the way projects are
              funded and appreciated."
          />

          <Box as='div'>
            <Heading
              size={{
                base: 'md',
                md: 'lg',
              }}
              my={3}
            >
              Execution:
            </Heading>
            <ol className='ml-6 space-y-3'>
              {executionDocs.map((doc) => (
                <li key={doc.title}>
                  <Text className=' font-[600]'>{doc.title}:</Text>
                  <Text>{doc.description}</Text>
                </li>
              ))}
            </ol>
          </Box>
          <Box as='div' pb={4}>
            <Heading
              size={{
                base: 'md',
                md: 'lg',
              }}
              my={3}
            >
              Additional Enhancements:
            </Heading>
            <ol className='ml-6 space-y-3'>
              {additionalEnhancementDocs.map((doc) => (
                <li key={doc.title}>
                  <Text className=' font-[600]'>{doc.title}:</Text>
                  <Text>{doc.description}</Text>
                </li>
              ))}
            </ol>
          </Box>

          <AboutHeading
            title='Technical Landscape:'
            description='To realize our vision, Project Malaika encompasses three key elements:'
          />
          <ol className='ml-6 space-y-3 list-alphaUpper'>
            {technicalLandscapeDocs.map((doc) => (
              <li key={doc.title}>
                <Text className=' font-[600]'>{doc.title}:</Text>
                <Text>{doc.description}</Text>
              </li>
            ))}
          </ol>
          <Text>
            In addition, we employ an off-chain database to manage promoter
            details and contract addresses, ensuring efficient BackEnd
            operations. The marketplaces highlight projects, and a decentralized
            governance approach empowers token holders. <br />
            <br />
            In conclusion, Project Malaika redefines crowdfunding with a
            holistic approach that benefits creators, backers, and the community
            at large. By combining innovative concepts, robust technology, and
            shared success principles, we aspire to be a beacon of change in the
            world of crowdfunding. <br />
            <br />
            Discover the journey of mutual empowerment and shared rewards with
            Project Malaika. Welcome to the future of crowdfunding.
          </Text>
        </Stack>
      </Container>
    </>
  );
}
