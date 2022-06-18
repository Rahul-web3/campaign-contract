const hdWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new hdWalletProvider(
	'indicate rough bottom resemble suffer enjoy extra bird want hunt shadow habit',
	'https://rinkeby.infura.io/v3/18d8fa36b0d74425bc76b173362f003c'
);

const web3 = new Web3(provider);

const deploy = async () => {
	const accounts = await web3.eth.getAccounts();
	console.log('Trying to deploy the contract using account ',accounts[0]);
	const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
		.deploy({ data: compiledFactory.bytecode })
		.send({ from: accounts[0], gas:'1000000' });

	console.log('Contract Deployed at ', result.options.address);
}

deploy();