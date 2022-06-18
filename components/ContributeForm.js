import React from "react";
import { Component } from "react/cjs/react.development";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Campaign from "../etherum/campaign";
import web3 from "../etherum/web3";
import { Router } from "../routes";

class ContributeFrom extends Component {
  state = {
    value: "",
    errorMessage: "",
    loading: false,
    successMessage: "",
  };

  onSubmit = async (event) => {
    event.preventDefault();

    const campaign = Campaign(this.props.address);
    this.setState({ loading: true, errorMessage: "", successMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether"),
      });
      Router.replaceRoute(`/campaign/${this.props.address}`);
      this.setState({ successMessage: !'' });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false, value: "" });
  };

  render() {
    return (
      <Form
        onSubmit={this.onSubmit}
        error={!!this.state.errorMessage}
        success={!!this.state.successMessage}
      >
        <Form.Field>
          <labal>Amount to Contribute</labal>
          <Input
            value={this.state.value}
            onChange={(event) => this.setState({ value: event.target.value })}
            label="ether"
            labelPosition="right"
          />
        </Form.Field>
        <Message error header="Oops!" content={this.state.errorMessage} />
        <Button primary loading={this.state.loading}>
          Contribute
        </Button>
        <Message
          success
          header="Your contribution was successful"
          content="Thank You for your interest in our campaign."
        />
      </Form>
    );
  }
}

export default ContributeFrom;
