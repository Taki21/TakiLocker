import { useRouter } from "next/router";
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import Wallet from '../../components/Wallet'
import Web3 from 'web3'
import { useWeb3React } from '@web3-react/core'
import { useState, useEffect } from 'react'

import { LockerContract, LockerABI } from '../../components/contracts/Locker'
import { USDC, USDCABI } from '../../components/contracts/USDC'
import { PAIRABI } from '../../components/contracts/Pair'

const Index = () => {
    const router = useRouter();
    const { pair, owner } = router.query;

    const [amt, setAmt] = useState("");
    const [time, setTime] = useState();
    const [addr, setAddr] = useState('');
    const [invalid, setInvalid] = useState(false);
    const [bal, setBal] = useState(0);
    const [pBal, setPBal] = useState(0);
    const [lockedArray, setLockedArray] = useState([]);
    const [t, setT] = useState(0.0);
    const [name, setName] = useState('');

    const { active, account, library, connector, activate, deactivate } = useWeb3React()

    const now = new Date((new Date().getTime()) + (time*86400000));

    async function lock(i) {
        if(active) {
        const ca = new library.eth.Contract(LockerABI, LockerContract);
        try {
            await ca.methods.extendLock(pair, time, i).send({from: account});
        } catch { setInvalid(true) }
        }
    }

    async function unlock(a, i) {
        if(active) {
            const ca = new library.eth.Contract(LockerABI, LockerContract);
            try {
                await ca.methods.withdraw(pair, a, i).send({from: account});
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

    async function getTotalSupply() {
        if(active) {
            const token = new library.eth.Contract(PAIRABI, pair);
            setT(await token.methods.totalSupply().call({from: account}));
        }
    }

    async function getName() {
        if(active) {
            const token = new library.eth.Contract(PAIRABI, pair);
            setName(await token.methods.name().call({from: account}));
        }
    }

    useEffect(() => {
        if(active) {
            const loadLocks = async () => {
                const ca = new library.eth.Contract(LockerABI, LockerContract);
                setLockedArray(await ca.methods.getLocks(owner, pair).call({from: account}))
            }
            loadLocks();
            getTotalSupply();
            getName();
        }
    }, [active])

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-bl bg-[#f2f2f2] font-Main">
            <Head>
                <title>DreamLocker</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex flex-col">
                <div className='flex w-full items-center justify-between py-4 px-64 bg-[#ffffff]'>
                    <div className='flex items-center'>
                        <img src="../logo.png" className='w-8'/>
                        <h1 className='mt-1 ml-2 text-2xl font-extrabold bg-gradient-to-r from-[#4c1860] to-[#8d298d] bg-clip-text text-transparent'>DreamLocker</h1>
                    </div>
                    
                    <div className='flex'>
                        <Link href='../../'>
                            <a>
                                <h1 className='mr-8 hover:text-[#7c65bc] transition-all'>Locker</h1>
                            </a>    
                        </Link>
                        <Link href='../../pools'>
                            <a>
                                <h1 className='mr-8 hover:text-[#7c65bc] transition-all text-[#8d298d] font-bold'>Pool</h1>
                            </a>    
                        </Link>
                        <Link href='../../staking'>
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
                    <div className='flex flex-col self-center w-1/4 mt-12 bg-gradient-to-r from-[#4c1860] to-[#8d298d] rounded-xl'>
                    <h1 className='bg-gradient-to-r from-[#ffffff] to-[#ffddff] bg-clip-text text-transparent p-8 text-2xl font-bold self-center'>Locked Liquidity for {name}</h1>
                </div>
                
                <div className="flex flex-col items-center justify-center mt-2">
                    {active ? (
                        lockedArray.map((i, j) => (
                          <div className="flex flex-col w-1/4 bg-gradient-to-br p-8 from-[#e4ccf8] to-[#e4a9e4] rounded-xl mt-4">
                            <div className="flex items-center">
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="2em" width="2em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"></path><path d="M14 2a8 8 0 0 1 3.292 15.293A8 8 0 1 1 6.706 6.707 8.003 8.003 0 0 1 14 2zm-3 7H9v1a2.5 2.5 0 0 0-.164 4.995L9 15h2l.09.008a.5.5 0 0 1 0 .984L11 16H7v2h2v1h2v-1a2.5 2.5 0 0 0 .164-4.995L11 13H9l-.09-.008a.5.5 0 0 1 0-.984L9 12h4v-2h-2V9zm3-5a5.985 5.985 0 0 0-4.484 2.013 8 8 0 0 1 8.47 8.471A6 6 0 0 0 14 4z"></path></g></svg>
                                <h1 className="font-bold text-[#202020] text-xl ml-1">UNI-V2 Pair</h1>
                            </div>
                            <div className="flex justify-between mt-6">
                                <h1>Amount:</h1>
                                <h1 className="font-bold">{library.utils.fromWei(i[0], 'ether')} UNI-V2</h1>
                            </div>
                            <div className="flex justify-between mt-2">
                                <h1>Unlock Date:</h1>
                                <h1 className="font-bold">{new Date((i[1]*1000)).toUTCString()}</h1>
                            </div>
                            <div className="flex justify-between mt-2">
                                <h1>Percentage:</h1>
                                <h1 className="font-bold">{(i[0] / t)*100}%</h1>
                            </div>
                            {/*<div className='flex'>
                                <button className='p-4 mt-4 bg-[#7a479f] rounded-2xl w-1/2 text-white' onClick={approveUSDC}>Approve USDC</button>
                                <button className='p-4 mt-4 bg-[#7a479f] rounded-2xl w-1/2 ml-6 text-white' onClick={() => lock(j)}>Extend Lock</button>
                            </div>*/}
                          </div>  
                        ))
                    ) : <Wallet/>}
                </div>
                
            </main>

        </div>
    )
}

export default Index