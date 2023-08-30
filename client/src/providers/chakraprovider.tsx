'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript, ThemeConfig, extendTheme } from '@chakra-ui/react'

interface Props {
  children: React.ReactNode
}

const colors = {
  colorNavBtn: '#9e9e9e',
  rose: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e',
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
  },
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  limegreen: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#67ff32',
    500: '#32ff32',
    600: '#1adb1a',
    700: '#0f9917',
    800: '#0b7817',
    900: '#05600e',
  }
}





const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}




const theme = extendTheme({ colors, config })

export default function Providers({
  children
}: Props) {

  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        {children}
      </ChakraProvider>
    </CacheProvider>
  )
}