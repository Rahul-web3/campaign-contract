import React, { Component } from "react";
import { Button, Message, Table } from "semantic-ui-react";
import Campaign from "../etherum/campaign";
import web3 from "../etherum/web3";
import { Router } from "../routes";

class RequestRow extends Component {
  state = {
    loading: false,
    loading2: false,
  };

  onApprove = async () => {
    try {
      this.setState({ loading: true, errorMessage: "" });
      const campaign = Campaign(this.props.address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.approveRequest(this.props.id).send({
        from: accounts[0],
      });
      this.setState({ loading: false });
      Router.replaceRoute(`/campaign/${this.props.address}/requests`);
    } catch (err) {
      console.log(err.message);
    }
    this.setState({ loading: false });
  };

  onFinalize = async () => {
    try {
      this.setState({ loading2: true, errorMessage: "" });
      const campaign = Campaign(this.props.address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.finalizeRequest(this.props.id).send({
        from: accounts[0],
      });
      this.setState({ loading2: false });
      Router.replaceRoute(`/campaign/${this.props.address}/requests`);
    } catch (err) {
      console.log(err.messsage);
    }
    this.setState({ loading2: false });
  };

  render() {
    const { Row, Cell } = Table;
    const { id, request, approversCount } = this.props;
    const readyToFinalize = request.approvalCount > approversCount /2 ;

    return (
      <Row
        disabled={request.complete}
        positive={readyToFinalize && !request.complete}
      >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {request.approvalCount} / {approversCount}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              color="green"
              basic
              loading={this.state.loading}
              onClick={this.onApprove}
            >
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              color="pink"
              basic
              loading={this.state.loading2}
              onClick={this.onFinalize}
            >
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
