import web3 from "./web3";
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0xc1a0FB61A5B86FE765d65926af05409b2a2e1893'
);

export default instance;