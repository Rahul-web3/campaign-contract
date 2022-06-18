import React from "react";
import { Component } from "react/cjs/react.development";
import { Button, Grid, GridColumn, GridRow, Table } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import { Link } from "../../../routes";
import Campaign from "../../../etherum/campaign";
import RequestRow from "../../../components/RequestRow";

class RequestIndex extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    const campaign = Campaign(address);
    const requestCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();
    const requests = await Promise.all(
      Array(parseInt(requestCount))
        .fill()
        .map((element, index) => {
          return campaign.methods.requests(index).call();
        })
    );

    return { address, requests, requestCount, approversCount };
  }

  RenderRow() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={this.props.address}
          approversCount={this.props.approversCount}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <Grid>
          <GridRow>
            <GridColumn width={10}>
              <h3>Pending Requests List</h3>
            </GridColumn>

            <GridColumn width={6}>
              <Link route={`/campaign/${this.props.address}/requests/new`}>
                <a>
                  <Button
                    floated="right"
                    content="Add Request"
                    icon="add"
                    labelPosition="left"
                    primary
                  />
                </a>
              </Link>
              <Link route={`/campaign/${this.props.address}/`}>
                <a>
                  <Button
                    floated="right"
                    content="Back"
                    icon="left arrow"
                    labelPosition="left"
                  />
                </a>
              </Link>
            </GridColumn>
          </GridRow>
        </Grid>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount (Ether)</HeaderCell>
              <HeaderCell>Recepient (Address)</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>{this.RenderRow()}</Body>
        </Table>
        <h3>Total {this.props.requestCount} request found.</h3>
      </Layout>
    );
  }
}

export default RequestIndex;
