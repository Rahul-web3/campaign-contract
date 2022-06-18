import React from "react";
import { Component } from "react/cjs/react.development";
import { Button, Card, Grid, GridColumn, GridRow } from "semantic-ui-react";
import ContributeFrom from "../../components/ContributeForm";
import Layout from "../../components/Layout";
import Campaign from "../../etherum/campaign";
import web3 from "../../etherum/web3";
import { Link } from "../../routes";

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);

    const summery = await campaign.methods.getSummery().call();

    return {
      address: props.query.address,
      minimumContribution: summery[0],
      balance: summery[1],
      requestCount: summery[2],
      approversCount: summery[3],
      manager: summery[4],
    };
  }

  renderCard() {
    const {
      balance,
      manager,
      minimumContribution,
      requestCount,
      approversCount,
    } = this.props;

    const items = [
      {
        header: manager,
        meta: "Address of manager",
        description:
          "This campaign is created by this manager. He can create request for fund and after approverd he can transfer required fund",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribute amount (wei)",
        description:
          "You have to contribute atleast this amount of wei to be an approver of this campaign",
        style: { overflowWrap: "break-word" },
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign remaing Balance (ether) ",
        description: "This much balance till left in this campaign",
        style: { overflowWrap: "break-word" },
      },
      {
        header: requestCount,
        meta: "Total number of requests",
        description: "This much request is made by manager",
        style: { overflowWrap: "break-word" },
      },
      {
        header: approversCount,
        meta: "Total number of approvers",
        description:
          "Total this much contributers of this campaign is approve some request",
        style: { overflowWrap: "break-word" },
      },
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Campaign Details</h3>
          <Grid>
            <GridRow>
              <GridColumn width={10}>{this.renderCard()}</GridColumn>

              <GridColumn width={6}>
                <ContributeFrom address={this.props.address} />
              </GridColumn>
            </GridRow>

            <GridRow>
              <GridColumn>
                <Link route={`/campaign/${this.props.address}/requests`}>
                  <a>
                    <Button primary> Show Requests </Button>
                  </a>
                </Link>
              </GridColumn>
            </GridRow>
          </Grid>
        </div>
      </Layout>
    );
  }
}

export default CampaignShow;
