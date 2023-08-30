'use client';

import { Grid } from '@chakra-ui/react';
import SecondaryHeading from './SecondaryHeading';
import Container from './Container';
interface Props {
  [key: string]: string;
}
const GridContent = ({
  mainH,
  mainT,
  priH,
  priT,
  secH,
  secT,
  terH,
  terT,
  className,
}: Props) => {
  return (
    <>
      <Container className={`${className}`}>
        <Grid
          gridTemplateColumns={{
            base: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
            xl: '2fr 1fr 1fr 1fr',
          }}
          gap={8}
        >
          {/* Main */}
          <SecondaryHeading
            className='text-3xl '
            heading={mainH}
            title={mainT}
          />
          {/* Primary */}
          <SecondaryHeading
            className='text-lg '
            heading={priH}
            number='1:'
            title={priT}
          />
          {/* Secondary */}
          <SecondaryHeading
            className='text-lg '
            heading={secH}
            number='2:'
            title={secT}
          />
          {/* Tertiary */}
          <SecondaryHeading
            className='text-lg '
            heading={terH}
            number='3:'
            title={terT}
          />
        </Grid>
      </Container>
    </>
  );
};

export default GridContent;
