'use client';
import Link from 'next/link';
import { GiHamburgerMenu } from 'react-icons/gi';
import { AiOutlineClose } from 'react-icons/ai';
import { useCallback, useState, useEffect } from 'react';
import classNames from 'classnames';
import Logo from './Logo';
import { usePathname } from 'next/navigation';
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
} from '@chakra-ui/react';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { useWeb3Modal } from '@web3modal/react';
import { getAccount } from '@wagmi/core';
import { IoIosMoon } from 'react-icons/io';
import { IoIosSunny } from 'react-icons/io';

interface MenuItems {
  [key: string]: string;
}

const menuItems: MenuItems[] = [
  { item: 'About', link: '/about' },
  { item: 'Projects', link: '/createproject' },
  { item: 'Market', link: '/marketplace' },
];

const dashboardItems: MenuItems[] = [
  { item: 'Creator Dashboard', link: '/creator-dashboard' },
  { item: 'Backer Dashboard', link: '/user-dashboard' },
];

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = colorMode === 'light' ? 'white' : 'slate-900';
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const handleMenu = useCallback((action: boolean) => {
    setIsMenuOpen(action);
  }, []);
  const [buttonText, setButtonText] = useState('Wallet Connect');
  const { open } = useWeb3Modal();
  const { isConnected, address } = getAccount();

  useEffect(() => {
    if (isConnected) {
      //@ts-ignore
      const sliceAddr = `${address.slice(0, 5)}...${address.slice(-4)}`;
      setButtonText(sliceAddr);
    } else {
      setButtonText('Wallet Connect');
    }
  }, [isConnected, address]);

  return (
    <header
      className={classNames(
        `flex bg-${
          bgColor as string
        } border-b border-b-${bgColor} shadow-primary items-center justify-between md:px-4 lg:px-8 fixed w-full z-[1]`
      )}
    >
      {/* Logo to show on Desktop view */}
      <div className={classNames(`pl-4 py-5 `, {})}>
        <Logo />
      </div>

      {/* Mobile Menu */}
      <div
        className={classNames(
          `
      absolute z-[4] pt-[1.3rem] md:pt-0 drop-shadow-2xl bg-${
        bgColor as string
      } shadow-primary border-b border-b-${bgColor} flex items-center justify-between md:hidden w-[70%] transform transition duration-300`,
          {
            '-translate-x-full': !isMenuOpen,
            'translate-x-0': isMenuOpen,
          }
        )}
      >
        {/* Logo to show on mobile view */}
        <div className={classNames(`pb-[0.9rem]   pl-4`)}>
          <Logo onClose={() => handleMenu(false)} />
        </div>
        <span
          onClick={() => handleMenu(false)}
          className={classNames(`pb-[0.9rem]   cursor-pointer pr-4`)}
        >
          {' '}
          <AiOutlineClose size={24} />{' '}
        </span>
      </div>

      {/* OverLay */}
      <div
        onClick={() => handleMenu(false)}
        className={classNames(
          `absolute z-[2] bg-gray-500/50 inset-0 transform transition min-h-screen duration-300 md:hidden`,
          {
            'translate-x-0': isMenuOpen,
            '-translate-x-full': !isMenuOpen,
          }
        )}
      ></div>

      {/* Nav Links */}
      <nav
        className={classNames(
          `flex flex-col pt-10 md:pt-0 absolute top-[3.6rem] md:top-0 bottom-0 min-h-screen md:min-h-fit bg-${
            bgColor as string
          }  md:bg-transparent z-[3] w-[70%] md:w-fit transform md:translate-x-0 transition duration-300 md:relative md:flex-row md:flex md:space-x-4`,
          {
            'translate-x-0': isMenuOpen,
            '-translate-x-full': !isMenuOpen,
          }
        )}
      >
        {menuItems.map((item, i) => (
          <Link
            onClick={() => handleMenu(false)}
            href={item.link}
            key={item.item}
            className={classNames(`nav__link`, {
              'bg-slate-500 font-semibold': pathname === item.link,
            })}
          >
            {item.item}
          </Link>
        ))}

        {/* DropDown Menu */}
        <Menu>
          {({ isOpen }) => (
            <>
              <div className='px-4 md:px-0'>
                <MenuButton
                  className='mt-4 font-normal'
                  bg='transparent'
                  _active={{ bg: 'transparent' }}
                  _focus={{ bg: 'transparent' }}
                  _hover={{ bg: 'transparent' }}
                  isActive={isOpen}
                  as={Button}
                  rightIcon={isOpen ? <BiChevronUp /> : <BiChevronDown />}
                >
                  Dashboard
                </MenuButton>
              </div>
              <MenuList>
                {dashboardItems.map((item, _) => (
                  <MenuItem
                    className={classNames(``, {
                      'bg-slate-300 font-semibold': pathname === item.link,
                    })}
                    key={item.item}
                  >
                    <Link onClick={() => handleMenu(false)} href={item.link}>
                      {item.item}
                    </Link>
                  </MenuItem>
                ))}
              </MenuList>
            </>
          )}
        </Menu>
        {/* End of DropDown Menu */}
        <Button className='mt-4 ml-auto w-fit' onClick={toggleColorMode}>
          {colorMode === 'light' ? <IoIosMoon /> : <IoIosSunny />}
        </Button>
        <div className='px-4 shrink-0'>
          <button
            className='px-4  py-3 transition duration-300 tracking-wider rounded w-full mt-[10rem] md:mt-3 bg-slate-500 font-semibold hover:bg-gray-400'
            onClick={async () => {
              await open();
            }}
          >
            {buttonText}
          </button>
        </div>
      </nav>

      {/* Hamburger Menu */}
      <span
        onClick={() => handleMenu(true)}
        className={classNames(`md:hidden cursor-pointer pr-4`, {
          hidden: isMenuOpen,
        })}
      >
        <GiHamburgerMenu size={24} />
      </span>
    </header>
  );
}
