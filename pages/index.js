import React, { Component } from "react";
import { Card, Button, Advertisement } from "semantic-ui-react";
import Layout from "../components/Layout";
import factory from "../etherum/factory";
import { Link } from "../routes";

class CampaignIndex extends Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaign().call();

    return { campaigns };
  }

  renderCampaign() {
    const items = this.props.campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link route={`/campaign/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
        style: { overflowWrap: 'break-word' },
      };
    });
    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <Advertisement
            unit="banner"
            centered
            test="Open Campaigns"
            style={{ margin: "10px" }}
          />
          <Link route="/campaign/new">
            <a>
              <Button
                floated="right"
                content="Create Campaign"
                icon="add circle"
                labelPosition="left"
                primary
              />
            </a>
          </Link>
          {this.renderCampaign()}
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
