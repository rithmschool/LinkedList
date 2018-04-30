import React, { Component } from "react";
import PropTypes from "prop-types";

class AuthForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: "",
      firstName: "",
      lastName: ""
    };
    this.lastLocation = "";
  }

  handleSubmit = e => {
    e.preventDefault();
    const authType = this.props.signIn ? "signin" : "signup";
    this.props
      .onAuth(authType, this.state)
      .then(() => {
        this.props.history.push("/");
      })
      .catch(() => {
        // we failed to log in, display the error message
        return;
      });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { email, username, password, firstName, lastName } = this.state;
    const {
      signIn,
      heading,
      buttonText,
      errors,
      history,
      removeError
    } = this.props;
    history.listen(event => {
      if (this.lastLocation !== window.location.pathname) {
        this.lastLocation = window.location.pathname;
        removeError();
      }
    });
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <h2>{heading}</h2>
          {errors.message && <div>{errors.message}</div>}
          <div>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              onChange={this.handleChange}
              type="text"
              value={username}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              onChange={this.handleChange}
              type="password"
              value={password}
            />
          </div>
          {!signIn && (
            <div>
              <div>
                <label htmlFor="email">E-mail</label>
                <input
                  autoComplete="off"
                  id="email"
                  name="email"
                  onChange={this.handleChange}
                  type="text"
                  value={email}
                />
              </div>
              <div>
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  onChange={this.handleChange}
                  type="text"
                  value={firstName}
                />
              </div>
              <div>
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  onChange={this.handleChange}
                  type="text"
                  value={lastName}
                />
              </div>
            </div>
          )}
          <button type="submit">{buttonText}</button>
        </form>
      </div>
    );
  }
}
AuthForm.propTypes = {
  buttonText: PropTypes.string,
  errors: PropTypes.object,
  heading: PropTypes.string,
  history: PropTypes.object,
  onAuth: PropTypes.func,
  signIn: PropTypes.bool,
  removeError: PropTypes.func
};

export default AuthForm;
