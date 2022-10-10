import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import Wallet from '../components/Wallet'
import Web3 from 'web3'
import { useWeb3React } from '@web3-react/core'
import { useState, useEffect } from 'react'

import { LockerContract, LockerABI } from '../components/contracts/Locker'
import { USDC, USDCABI } from '../components/contracts/USDC'
import { PAIRABI } from '../components/contracts/Pair'

const Index = () => {
    const [amt, setAmt] = useState("");
    const [time, setTime] = useState();
    const [addr, setAddr] = useState('');
    const [invalid, setInvalid] = useState(false);
    const [bal, setBal] = useState(0);
    const [pBal, setPBal] = useState(0);

    const { active, account, library, connector, activate, deactivate } = useWeb3React()

    const now = new Date((new Date().getTime()) + (time*86400000));

    async function lock() {
        if(active) {
        const ca = new library.eth.Contract(LockerABI, LockerContract);
        try {
            await ca.methods.lockTokens(addr, library.utils.toWei(amt), time).send({from: account});
        } catch { setInvalid(true) }
        }
    }

    async function approve() {
        if(active) {
        const token = new library.eth.Contract(PAIRABI, addr);
        await token.methods.approve("0xB26B9Ab803FdB32f306c815e798c5C4C45Ab7137", library.utils.toWei(amt)).send({from: account});
        }
    }

    async function approveUSDC() {
        if(active) {
        const token = new library.eth.Contract(USDCABI, USDC);
        await token.methods.approve("0xB26B9Ab803FdB32f306c815e798c5C4C45Ab7137", "69000000").send({from: account});
        }
    }

    useEffect(() => {
        if(active) {
        const balances = async () => {
            try {
            const token = new library.eth.Contract(PAIRABI, addr);
            let b = await token.methods.balanceOf(account).call({from: account});
            setBal(b);
            setPBal(library.utils.fromWei(b, 'ether'));
            setInvalid(false);
            } catch { 
            setInvalid(true);
            setBal(0);
            setPBal(0);
            }
        }
        balances();
        }
    }, [addr])

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-bl bg-[#f2f2f2] font-Main">
            <Head>
                <title>DreamLocker</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex flex-col">
                <div className='flex w-full items-center justify-between py-4 px-64 bg-[#ffffff]'>
                <div className='flex items-center'>
                    <img src="logo.png" className='w-8'/>
                    <h1 className='mt-1 ml-2 text-2xl font-extrabold bg-gradient-to-r from-[#4c1860] to-[#8d298d] bg-clip-text text-transparent'>DreamLocker</h1>
                </div>
                
                <div className='flex'>
                    <Link href='../../'>
                        <a>
                            <h1 className='mr-8 hover:text-[#7c65bc] transition-all'>Locker</h1>
                        </a>    
                    </Link>
                    <Link href='/pools'>
                        <a>
                            <h1 className='mr-8 hover:text-[#7c65bc] transition-all text-[#8d298d] font-bold'>Pool</h1>
                        </a>    
                    </Link>
                    <Link href='/staking'>
                        <a>
                            <h1 className='mr-8 hover:text-[#7c65bc] transition-all'>Staking</h1>
                        </a>    
                    </Link>
                </div>
                
                <Wallet/>
                </div>
                <div className='flex'>
                {/*<button className='p-4 my-4 bg-white rounded-2xl' onClick={approveToken}>approve token</button>*/}
                </div>
                <div className='flex flex-col self-center w-1/4 mt-12 bg-white rounded-xl'>
                    <h1 className='bg-gradient-to-r from-[#4c1860] to-[#8d298d] bg-clip-text text-transparent p-8 pb-0 text-2xl font-bold self-center'>Search Pools</h1>        
                    <div className="flex flex-col p-4 pb-6 self-center bg-white rounded-lg font-Main text-[#585858] w-full">
                        <h1 className='flex self-center'>Search by Token Pair Address</h1>
                        {invalid ? <h1 className='flex self-center text-[#b12b2b] font-bold bg-red-100 px-4 py-1 my-1 rounded-lg'>Invalid Pair Address!</h1> : <></>}
                        <input onChange={(e) => setAddr(e.target.value)} placeholder="Input Address Here" className="bg-[#e9e9e9] mt-2 py-2 pr-2 outline-none focus:outline-none text-[#585858] w-full text-center text-xs rounded-xl font-bold"/>
                        <Link href={'/' + addr}>
                            <a className='py-3 my-3 mb-0 text-white bg-[#7a479f] rounded-2xl self-center w-full text-center'>View Token Details</a>
                        </Link>
                    </div>
                </div>
            </main>

        </div>
    )
}

export default Index