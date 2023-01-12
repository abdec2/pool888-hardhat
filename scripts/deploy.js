// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  // pool array
  const pools = [
    {
      lpToken: '0xAE90A6e8470eCbB888b37Ec68E982D7507d7D3c8',
      allocPoint: '11450',
      depositFeeBp: '500',
      harvestInterval: '600'
    },
    {
      lpToken: '0x0950D64525706842a16c5BD73c14F38fBd610c9B',
      allocPoint: '7634',
      depositFeeBp: '500',
      harvestInterval: '600'
    },
    {
      lpToken: '0x62446C95F971D62FD66998688e4C58475C9943C5',
      allocPoint: '3817',
      depositFeeBp: '500',
      harvestInterval: '600'
    },
    {
      lpToken: '0xB10AB37b7220e267a903b193212278266Ff7CC10',
      allocPoint: '3817',
      depositFeeBp: '500',
      harvestInterval: '600'
    }
  ];

  // payment splitter args
  const paymentSplitterAddresses = ["0x5baA0f14D09864929c5fC8AbDfDc466dcb72be9d", "0x64DC48F2Ae171f7Ae966f15844eF2f8751665110"];
  const paymentSplitterShares = [90, 10];

  // deploy 888 token
  // const TripleEight = await hre.ethers.getContractFactory("TripleEight");
  // const tripleEight = await TripleEight.deploy();
  const provider = hre.ethers.provider;
  const signer = provider.getSigner();
  const tripleEight = await hre.ethers.getContractAt('TripleEight', '0x1b1aF0A25E2a55e065F31cB7C58904AdB2Ae5d0C', signer);

  //deploy payment splitter
  const PaymentSplitter = await hre.ethers.getContractFactory('PaymentSplitter');
  const paymentSplitter = await PaymentSplitter.deploy(paymentSplitterAddresses, paymentSplitterShares);

  // deploy referral contract
  const T8Refferal = await hre.ethers.getContractFactory('T8Referral');
  const t8Refferal = await T8Refferal.deploy();

  // await tripleEight.deployed();
  await paymentSplitter.deployed();
  await t8Refferal.deployed();


  // deploy masterchef staking contract
  const Masterchef = await hre.ethers.getContractFactory('MasterChef');
  const masterchef = await Masterchef.deploy(tripleEight.address, 34352, paymentSplitter.address)

  await masterchef.deployed();


  const updateOperator = await t8Refferal.updateOperator(masterchef.address, true);
  await updateOperator.wait();

  console.log('updateOperator', updateOperator)

  const setT8Referral = await masterchef.setT8Referral(t8Refferal.address);
  await setT8Referral.wait();

  console.log('setT8Referral', setT8Referral)

  const MINTER_ROLE = await tripleEight.MINTER_ROLE();
  const grantRole = await tripleEight.grantRole(MINTER_ROLE, masterchef.address);
  await grantRole.wait();

  console.log('grant role ', grantRole)

  const tx1 = await masterchef.add(pools[0].allocPoint, pools[0].lpToken, pools[0].depositFeeBp, pools[0].harvestInterval, true);
  await tx1.wait();
  console.log('add pool', tx1);

  const tx2 = await masterchef.add(pools[1].allocPoint, pools[1].lpToken, pools[1].depositFeeBp, pools[1].harvestInterval, true);
  await tx2.wait();
  console.log('add pool', tx2);

  const tx3 = await masterchef.add(pools[2].allocPoint, pools[2].lpToken, pools[2].depositFeeBp, pools[2].harvestInterval, true);
  await tx3.wait();
  console.log('add pool', tx3);

  const tx4 = await masterchef.add(pools[3].allocPoint, pools[3].lpToken, pools[3].depositFeeBp, pools[3].harvestInterval, true);
  await tx4.wait();
  console.log('add pool', tx4);

  console.log(`tripleEight deployed to ${tripleEight.address}`);
  console.log(`paymentSplitter deployed to ${paymentSplitter.address}`);
  console.log(`masterchef deployed to ${masterchef.address}`);
  console.log(`t8Refferal deployed to ${t8Refferal.address}`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
