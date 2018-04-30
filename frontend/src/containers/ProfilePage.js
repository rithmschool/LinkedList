import React, { Component } from "react";
import { connect } from "react-redux";
import withAuth from "../hocs/withAuth";

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isEditingExperience: false,
      isEditingEducation: false,
      isEditingSkills: false
    };
  }

  async componentDidMount() {
    await this.props.fetchUser(this.props.username);
    this.setState({
      isLoading: true
    });
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  toggleForm = target => {
    this.setState(prevState => {
      return { [target]: !prevState[target] };
    });
  };

  editUser() {
    this.props.editUser(this.state.user);
  }
  render() {
    let {
      firstName,
      lastName,
      skills,
      experience,
      education,
      email,
      photo,
      currentCompanyName
    } = this.props.user;

    let {
      isEditingExperience,
      isEditingEducation,
      isEditingSkills
    } = this.state;

    if (this.state.isLoading) {
      let userExperience = experience.map((v, i) => (
        <li key={i}>
          {v.jobTitle} {v.companyName} {v.company} {v.startDate} {v.endDate}
        </li>
      ));
      let userEducation = education.map((v, i) => (
        <li key={i}>
          {v.institution} {v.degree} {v.endDate}
        </li>
      ));
      let userSkills = skills.map((skill, i) => <li key={i}>{skill}</li>);
      return (
        <div>
          <h1>
            Hi {firstName} {lastName} {email}
          </h1>
          <img src={photo} alt="userphoto" />

          {!isEditingExperience ? (
            <div>
              <ul>{userExperience}</ul>
            </div>
          ) : (
            <div>Todo!</div>
          )}
          <button onClick={() => this.toggleForm("isEditingExperience")}>
            Edit
          </button>

          {!isEditingEducation ? (
            <div>
              <ul>{userEducation}</ul>
            </div>
          ) : (
            <div>Todo!</div>
          )}
          <button onClick={() => this.toggleForm("isEditingEducation")}>
            Edit
          </button>

          {!isEditingSkills ? (
            <div>
              <ul>{userSkills}</ul>
            </div>
          ) : (
            <div>Todo!</div>
          )}
          <button onClick={() => this.toggleForm("isEditingSkills")}>
            Edit
          </button>
        </div>
      );
    }
    return <div>Loading profile...</div>;
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    username: state.currentUser.user.username
  };
}

export default connect(mapStateToProps)(withAuth(ProfilePage));
