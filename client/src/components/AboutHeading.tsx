'use client';

import { Heading, Text } from '@chakra-ui/react';
interface Props {
  title: string;
  description: string;
  number?: string;
  bold?: boolean;
  className?: string;
}

export default function AboutHeading({
  number,
  title,
  description,
  bold,
  className,
}: Props) {
  return (
    <>
      <Heading
        size={{
          base: 'md',
          md: 'xl',
        }}
      >
        {title}
      </Heading>
      <Text className={`py-3 ${className}`}>{description}</Text>
    </>
  );
}
