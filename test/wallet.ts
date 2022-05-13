import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { balance } from '@openzeppelin/test-helpers';
import { Wallet__factory, Wallet } from '../typechain'


describe('Wallet', () => {
    let wallet: Wallet;
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;
    let others: SignerWithAddress[];

    beforeEach( async () => {
        [owner, addr1, addr2, ...others] = await ethers.getSigners();
        const WalletFactory = (await ethers.getContractFactory('Wallet')) as Wallet__factory;
    
        wallet = await WalletFactory.deploy([owner.address, addr1.address, addr2.address], 2);

        await owner.sendTransaction({
            to: wallet.address,
            value: ethers.utils.parseEther("1.0") // 1 ether
        })
    })

    it('should have correct approvers and quorum', async () => {
        const approvers = await wallet.getApprovers();
        const quorum = await wallet.quorum();

        expect(approvers.length).to.equal(3)
        expect(approvers[0]).to.equal(owner.address)
        expect(approvers[1]).to.equal(addr1.address)
        expect(approvers[2]).to.equal(addr2.address)
//console.log(quorum)
        expect(quorum).to.equal(2)
    })

    it('should create transfers', async () => {
        await wallet.createTransfer(100, addr1.address, {from: owner.address})
        const transfers = await wallet.getTransfers();

        expect(transfers.length).to.equal(1)
        expect(transfers[0].id).to.equal(0);
        expect(transfers[0].amount).to.equal(100)
        expect(transfers[0].to).to.equal(addr1.address)
        expect(transfers[0].approvals).to.equal(0)
        expect(transfers[0].sent).to.equal(false)
    })

    it('should not create transfers if not called by an approver', async () => {
        await expect(
            wallet.connect(others[0]).createTransfer(100, addr1.address)
            ).to.be.revertedWith('only approver allowed')
        const transfers = await wallet.getTransfers();

        expect(transfers.length).to.equal(0)
    })

    it('should increment approvals', async () => {
        await wallet.createTransfer(100, addr1.address, {from: owner.address})
        await wallet.connect(addr1).approveTransfer(0)
        const transfers = await wallet.getTransfers()
        const contractBalance = await balance.current(wallet.address)

        // console.log(contractBalance.toString())

        expect(transfers[0].approvals).to.equal(1)
        expect(transfers[0].sent).to.equal(false)
        expect(contractBalance.toString()).to.equal(ethers.utils.parseEther("1.0"))
    })

    it('should transfer if quorum is reached', async () => {
        const balanceBefore = await balance.current(others[0].address);

        console.log({ balanceBefore: balanceBefore.toString() });
        await wallet.createTransfer(100, others[0].address, {from: owner.address});
        await wallet.connect(owner).approveTransfer(0);
        await wallet.connect(addr1).approveTransfer(0);

        const balanceAfter = await balance.current(others[0].address);

        console.log({ balanceAfter: balanceAfter.toString()})
        console.log({ res: balanceAfter.sub(balanceBefore).toNumber() })
        expect(balanceAfter.sub(balanceBefore).toNumber()).to.equal(100)
    })

    it('should not approve transfer if sender is not approved', async () => {
        await wallet.createTransfer(100, others[0].address, {from: owner.address});

        await expect(wallet.connect(others[0]).approveTransfer(0)).to.be.revertedWith('only approver allowed')
    })

    it('should not approve if transfer is already sent', async () => {
        await wallet.createTransfer(100, others[0].address, {from: owner.address});
        await wallet.connect(owner).approveTransfer(0);
        await wallet.connect(addr1).approveTransfer(0);
        
        await expect(wallet.connect(addr2).approveTransfer(0)).to.be.revertedWith('transfer already sent')
    })

    it('should not approve if siner already signed', async () => {
        await wallet.createTransfer(100, others[0].address, {from: owner.address});
        await wallet.connect(addr1).approveTransfer(0);
        
        await expect(wallet.connect(addr1).approveTransfer(0)).to.be.revertedWith('already signed')
    })
})