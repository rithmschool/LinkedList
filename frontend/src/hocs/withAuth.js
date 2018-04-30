import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

/* Here we are creating a Higher Order Component (or HOC)
The idea is to wrap a component with a function that ensures the user is logged in
The function accepts some component to be rendered, and then creates another component
In the component (called Authenticate), we connect to Redux to see if there is a user logged in
Anytime there is a change (mounting or updating) the Authenticate component, we check if the user is logged in
If not, redirect them to `/signin`
*/
export default function(ComponentToBeRendered) {
  class Authenticate extends Component {
    componentDidMount() {
      if (!this.props.isAuthenticated) {
        this.props.history.push("/signin");
      }
    }

    componentDidUpdate(prevProps) {
      if (!prevProps.isAuthenticated) {
        this.props.history.push("/signin");
      }
    }

    render() {
      return <ComponentToBeRendered {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return {
      isAuthenticated: state.currentUser.isAuthenticated
    };
  }

  Authenticate.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired
  };

  return connect(mapStateToProps)(Authenticate);
}
