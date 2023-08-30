'use client';

import { Flex, Heading, Text, useColorMode } from '@chakra-ui/react';

interface Props {
  number?: string;
  heading: string;
  title: string;
  center?: boolean;
  className?: string;
}
const SecondaryHeading = ({
  number = '',
  heading,
  title,
  center,
  className,
}: Props) => {
  const { colorMode } = useColorMode();
  const textColor = colorMode === 'light' ? 'gray-800' : 'white';
  return (
    <>
      <Flex textAlign={center ? 'center' : 'left'} flexDir='column' gap={3}>
        <Heading className={className}>
          {number} {heading}{' '}
        </Heading>
        <Text className={`text-${textColor as string} text-sm`}>{title}</Text>
      </Flex>
    </>
  );
};

export default SecondaryHeading;
