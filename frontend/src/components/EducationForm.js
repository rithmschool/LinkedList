import React, { Component } from "react";

export default class EducationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    return <div>Nice!</div>;
  }
}
