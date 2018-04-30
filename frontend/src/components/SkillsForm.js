import React, { Component } from "react";

export default class SkillsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skill: ""
    };
  }
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  addSkill = e => {
    e.preventDefault();
    this.props.updateUser({ skills: this.state.skill });
  };

  removeSkill = i => {
    this.props.removeSkill(i);
  };

  render() {
    let skills = this.props.skills.map((v, i) => (
      <li key={i}>
        {v} <button onClick={() => this.removeSkill(i)}>X</button>
      </li>
    ));
    return (
      <div>
        <h2>Add a skill</h2>
        <form onSubmit={this.addSkill}>
          <input
            type="text"
            value={this.state.skill}
            name="skill"
            onChange={this.handleChange}
          />
          <button>Add Skill</button>
        </form>
        <ul>{skills}</ul>
      </div>
    );
  }
}
