import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import { removeError } from "../store/actions/errors";
import { authUser, loginUser } from "../store/actions/auth";
import { fetchUser, editUser } from "../store/actions/users";
import { applyToJob } from "../store/actions/jobs";
import Homepage from "../components/Homepage";
import AuthForm from "../components/AuthForm";
import withAuth from "../hocs/withAuth";
import ApplyForm from "../components/ApplyForm";
import ProfilePage from "../containers/ProfilePage";

const Main = props => {
  const {
    authUser,
    currentUser,
    errors,
    removeError,
    loginUser,
    fetchUser,
    editUser,
    applyToJob
  } = props;
  return (
    <div className="container">
      <Switch>
        <Route
          path="/jobs/:id/apply"
          exact
          render={props => (
            <ApplyForm
              {...props}
              applyToJob={applyToJob}
              username={currentUser.user.username}
            />
          )}
        />
        <Route
          path="/profile"
          exact
          render={props => (
            <ProfilePage
              fetchUser={fetchUser}
              editUser={editUser}
              username={currentUser.user.username}
              {...props}
            />
          )}
        />
        <Route
          path="/profile"
          exact
          render={props => (
            <ProfilePage
              fetchUser={fetchUser}
              username={currentUser.user.username}
              {...props}
            />
          )}
        />
        <Route
          exact
          path="/signin"
          render={props => {
            if (currentUser.isAuthenticated) {
              return <Redirect to="/" />;
            }
            return (
              <AuthForm
                buttonText="Log in"
                errors={errors}
                removeError={removeError}
                heading="Welcome Back."
                onAuth={loginUser}
                signIn
                {...props}
              />
            );
          }}
        />
        <Route
          exact
          path="/signup"
          render={props => {
            if (currentUser.isAuthenticated) {
              return <Redirect to="/" />;
            }
            return (
              <AuthForm
                removeError={removeError}
                buttonText="Sign me up!"
                errors={errors}
                heading="Join Linked List today."
                onAuth={authUser}
                {...props}
              />
            );
          }}
        />
        <Route
          path="/secret"
          component={withAuth(() => <h1>Secret Page!</h1>)}
        />
        <Route
          exact
          path="/"
          render={props => <Homepage {...props} currentUser={currentUser} />}
        />
      </Switch>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser,
    errors: state.errors
  };
};

Main.propTypes = {
  signIn: PropTypes.func,
  signUp: PropTypes.func,
  authUser: PropTypes.func,
  loginUser: PropTypes.func,
  currentUser: PropTypes.object,
  removeError: PropTypes.func,
  errors: PropTypes.object
};

export default withRouter(
  connect(mapStateToProps, {
    editUser,
    fetchUser,
    loginUser,
    authUser,
    removeError,
    applyToJob
  })(Main)
);
