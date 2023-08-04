import { Web3Button } from '@web3modal/react'
import Interact from '../components/Interact';


export default function Home() {


  return (
    <div className='pt-1'>
      <div className='flex justify-end'>
        <Web3Button className="" />
      </div>
      <Interact/>
    </div>
  );
}