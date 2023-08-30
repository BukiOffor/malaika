'use client';
import {
  Card,
  CardFooter,
  CardHeader,
  Flex,
  Stack,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import { IconType } from 'react-icons';

interface Props {
  icon: IconType;
  iconLabel: string;
  currencyValue: string;
  footerText?: string;
  link?: string;
  bgColor?: string;
}

const DashboardCard = ({
  icon: Icon,
  iconLabel,
  currencyValue,
  footerText,
  link,
  bgColor,
}: Props) => {
  return (
    <Card bg={bgColor} className='w-[20rem] border border-black shadow-primary'>
      <Stack>
        <CardHeader>
          <Stack spacing={4}>
            <Flex className='gap-2 item-center'>
              <Icon className='-ml-1' size={24} />
              <Text className='font-bold text-md '>{iconLabel}</Text>
            </Flex>
            <Text className='font-bold text-md'>{currencyValue}</Text>
          </Stack>
        </CardHeader>
        <CardFooter>
          {footerText && (
            <Text className='text-sm font-bold '>{footerText}</Text>
          )}
          {link && (
            <Link
              href='/dashboard/viewall'
              className='text-sm font-medium underline hover:no-underline'
            >
              {link}
            </Link>
          )}
        </CardFooter>
      </Stack>
    </Card>
  );
};

export default DashboardCard;
