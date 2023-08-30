import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  ButtonGroup,
  Stack,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Input,
  Heading,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';

interface Props {
  children: React.ReactNode;
  icon: IconType;
  iconLabel: string;
  primaryText?: string;
  secondaryText?: string;
  address?: string;
  addressNumber?: string;
  iconClassName?: string;
  isOpen: boolean;
  onClose(): void;
  motionPreset?: 'slideInBottom' | 'slideInRight' | 'scale' | 'none';
  leastDestructiveRef: any;
  isCentered: boolean;
  placeholder?: string;
  hasInputField?: boolean;
  hasTextField?: boolean;
  addressText?: string;
  footerEl?: React.ReactNode;
}

export default function CustomModal({
  children,
  icon: Icon,
  iconLabel,
  primaryText,
  secondaryText,
  address,
  addressNumber,
  iconClassName,
  isOpen,
  onClose,
  motionPreset,
  leastDestructiveRef,
  isCentered,
  footerEl,
  placeholder,
  hasInputField,
  hasTextField,
  addressText,
}: Props) {
  return (
    <>
      <AlertDialog
        size='sm'
        motionPreset={motionPreset}
        leastDestructiveRef={leastDestructiveRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered={isCentered}
      >
        <AlertDialogOverlay />

        <AlertDialogContent className='mx-auto'>
          <AlertDialogHeader>
            <Stack className='text-center'>
              <Flex className='items-center mx-auto gap-2 text-[1rem]'>
                <Icon className={iconClassName} aria-label={iconLabel} />
                <span>{iconLabel}</span>
              </Flex>
              <Text as='p' className='text-sm font-normal text-slate-500'>
                {secondaryText}
              </Text>
              <Text className='text-sm'>
                <span className=' text-gray-500'>{address} </span>
                <strong>{addressNumber}</strong>
              </Text>
            </Stack>
            {hasTextField && (
              <>
                <Heading size='sm' className='pt-8 pb-2'>
                  {primaryText}
                </Heading>
                <Text className='text-sm font-normal text-slate-500 break-all'>
                  {addressNumber}
                </Text>
              </>
            )}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>{children}</AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
