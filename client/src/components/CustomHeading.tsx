'use client';

import { Box, ButtonGroup, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import classNames from 'classnames';
import CustomButton from './CustomButton';
import Container from './Container';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface Props {
  primaryHeading: string;
  secondaryHeading?: string;
  description: string;
  leftButton: string;
  rightButton: string;
  className?: string;
  colorScheme?: string;
  border?: string;
  bgColor?: string;
  textColor?: string;
  shadow?: boolean;
  leftBtnClassName?: string;
  rightBtnClassName?: string;
  leftColorScheme?: string;
  rightColorScheme?: string;
  leftBtnTextColor?: string;
  rightBtnTextColor?: string;
  leftBtnBgColor?: string;
  rightBtnBgColor?: string;
}

export default function CustomHeading({
  primaryHeading,
  secondaryHeading,
  description,
  leftButton,
  rightButton,
  leftBtnClassName,
  rightBtnClassName,
  leftColorScheme,
  rightColorScheme,
  leftBtnTextColor,
  rightBtnTextColor,
  leftBtnBgColor,
  rightBtnBgColor,
  className,
}: Props) {
  const router = useRouter();

  const routeHandler = useCallback(
    (route: string) => {
      router.push(route);
    },
    [router]
  );

  return (
    <>
      <Container className={classNames(` text-center pb-10 ${className}`)}>
        <Stack spacing={6}>
          {secondaryHeading && (
            <Text className='text-xl font-bold text-center'>
              {secondaryHeading}
            </Text>
          )}
          <Heading
            fontSize={{
              base: '2xl',
              md: '3xl',
              lg: '4xl',
              xl: '6xl',
            }}
            maxW={{
              base: 'full',
              md: '80%',
              lg: '70%',
            }}
            marginX='auto'
            className='font-bold '
          >
            {primaryHeading}{' '}
          </Heading>
          <Text
            fontSize={{
              base: 'sm',
              lg: 'md',
            }}
            maxW={{
              base: 'full',
              md: '50%',
            }}
            marginX='auto'
          >
            {description}
          </Text>

          <ButtonGroup
            gap={4}
            flexDir={{
              base: 'column',
              md: 'row',
            }}
            w={{
              base: 'full',
              md: 'auto',
            }}
            className='mx-auto'
          >
            {/* Left Button */}
            <CustomButton
              onClick={() => routeHandler('/createproject')}
              className={leftBtnClassName}
              colorScheme={leftColorScheme}
              title={leftButton}
              shadow
              textColor={leftBtnTextColor}
              border
              bgColor={leftBtnBgColor}
            />
            {/* Right Button */}
            <CustomButton
              onClick={() => routeHandler('/supportproject')}
              className={rightBtnClassName}
              colorScheme={rightColorScheme}
              title={rightButton}
              shadow
              bgColor={rightBtnBgColor}
              textColor={rightBtnTextColor}
              border
            />
          </ButtonGroup>
        </Stack>
      </Container>
    </>
  );
}
