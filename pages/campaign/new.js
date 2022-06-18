import React from "react";
import { Component } from "react/cjs/react.production.min";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import web3 from "../../etherum/web3";
import factory from "../../etherum/factory";
import { Router } from "../../routes";


class CampaignNew extends Component {
  state = {
    minimumContribution: "",
    errorMessage: '',
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    try{
        const accounts = await web3.eth.getAccounts();
        await factory.methods.createCampaign(this.state.minimumContribution).send({
            from: accounts[0]
        });
        Router.pushRoute('/');
    } catch(err) {
        this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  }

  render() {
    return (
      <div>
        <Layout>
          <h3> Create your Campaign</h3>
          <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
            <Form.Field>
              <label>Minimun Contribution</label>
              <Input
                label="wei"
                labelPosition="right"
                placeholder="minimum contribution"
                value={this.setState.minimumContribution}
                onChange={(event) =>
                  this.setState({ minimumContribution: event.target.value })
                }
              />
            </Form.Field>
            <Message error header="Oops!" content={this.state.errorMessage} />
            <Button loading={this.state.loading } primary>Create!</Button>
          </Form>
        </Layout>
      </div>
    );
  }
}

export default CampaignNew;