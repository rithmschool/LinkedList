import React, { Component } from "react";
import withAuth from "../hocs/withAuth";

class ApplyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: ""
    };
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.applyToJob(this.props.username, this.props.match.params.id);
    this.props.history.push("/");
  };

  render() {
    let company = this.props.location.search.split("=")[1];
    return (
      <div>
        <h1>Apply To @{company}</h1>
        <form onSubmit={this.handleSubmit}>
          <textarea
            name="content"
            id="content"
            cols="30"
            rows="10"
            value={this.state.content}
            onChange={this.handleChange}
          />
          <button>Cancel</button>
          <button type="submit">Send</button>
        </form>
      </div>
    );
  }
}

export default withAuth(ApplyForm);
