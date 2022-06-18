import React from "react";
import { Component } from "react/cjs/react.development";
import {
  Button,
  Form,
  FormField,
  Grid,
  GridColumn,
  GridRow,
  Input,
  Message,
} from "semantic-ui-react";
import Layout from "../../../components/Layout";
import Campaign from "../../../etherum/campaign";
import web3 from "../../../etherum/web3";
import { Link, Router } from "../../../routes";

class AddRequest extends Component {
  state = {
    value: "",
    description: "",
    recepient: "",
    errorMessage: "",
    loading: false,
  };

  static async getInitialProps(props) {
    const { address } = props.query;
    return { address };
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const campaign = Campaign(this.props.address);
    const { description, value, recepient } = this.state;
    this.setState({ loading: true, errorMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(
          description,
          web3.utils.toWei(String(value), "ether"),
          recepient
        )
        .send({
          from: accounts[0],
        });
      Router.push(`/campaign/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <Link route={`/campaign/${this.props.address}/requests`}>
          <a>
            <Button
              floated="right"
              content="Back"
              icon="left arrow"
              labelPosition="left"
            />
          </a>
        </Link>
        <h3>Create a Request</h3>

        <Grid>
          <GridColumn width={8}>
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
              <FormField>
                <label>Description</label>
                <Input
                  value={this.state.description}
                  onChange={(event) =>
                    this.setState({ description: event.target.value })
                  }
                />
              </FormField>

              <FormField>
                <label>Amount in ether</label>
                <Input
                  value={this.state.value}
                  onChange={(event) =>
                    this.setState({ value: event.target.value })
                  }
                  label="ether"
                  labelPosition="right"
                />
              </FormField>

              <FormField>
                <label>Recipient Address</label>
                <Input
                  value={this.state.recepient}
                  onChange={(event) =>
                    this.setState({ recepient: event.target.value })
                  }
                />
              </FormField>
              <Message error header="Oops!" content={this.state.errorMessage} />
              <Button primary loading={this.state.loading}>
                Create!
              </Button>
            </Form>
          </GridColumn>
        </Grid>
      </Layout>
    );
  }
}

export default AddRequest;
