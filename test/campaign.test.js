const assert = require('assert');
const ganach = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganach.provider());

const compiledFactory = require('../etherum/build/CampaignFactory.json');
const compiledCampaign = require('../etherum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
	accounts = await web3.eth.getAccounts();
	factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
		.deploy({ data: compiledFactory.bytecode })
		.send({ from: accounts[0], gas: '1000000'});

	await factory.methods.createCampaign('100').send({
		from: accounts[0],
		gas: '1000000'
	});

	[campaignAddress] = await factory.methods.getDeployedCampaign().call();

	campaign = await new web3.eth.Contract(
		JSON.parse(compiledCampaign.interface),
		campaignAddress
	);
});

describe('Campaign', () => {
	it('deploys factory and campaign contract', () => {
		assert.ok(factory.options.address);
		assert.ok(campaign.options.address);
	});

	it('marks caller as the campaign manager', async () => {
		const manager = await campaign.methods.manager().call();
		assert.equal(accounts[0], manager);
	});

	it('allow people contribute to campaign and mark them as approvers', async () => {
		await campaign.methods.contribute().send({
			value: '200',
			from: accounts[1]
		});
		const isApprover = await campaign.methods.approvers(accounts[1]).call();
		assert(isApprover);
	});

	it('requires a minimum amount to contribute', async () => {
		try{
			await campaign.methods.contribute().send({
				value: '50',
				from: accounts[2]
			});
			assert(false);
		} catch(err){
			assert(err);
		}
	});

	it('manager can call for a payment request', async () => {
		await campaign.methods.createRequest("Buy Lamborgini","10000",accounts[2]).send({
			from: accounts[0],
			gas: '1000000'
		});
		const request = await campaign.methods.requests(0).call();
		assert.equal("Buy Lamborgini", request.description);
	});

	it('sending the fund', async () => {
		await campaign.methods.contribute().send({
			value: web3.utils.toWei('10','ether'),
			from: accounts[0]
		});

		await campaign.methods.createRequest("Buy RR",web3.utils.toWei('5','ether'),accounts[3]).send({
			from: accounts[0],
			gas: '1000000'
		});

		await campaign.methods.approveRequest(0).send({
			from: accounts[0],
			gas: '1000000'
		});

		await campaign.methods.finalizeRequest(0).send({
			from: accounts[0],
			gas: '1000000'
		});

		let balance = await web3.eth.getBalance(accounts[3]);
		balance = web3.utils.fromWei(balance, 'ether');
		balance = parseFloat(balance);
		assert(balance > 104);
		console.log(balance);
	});
});