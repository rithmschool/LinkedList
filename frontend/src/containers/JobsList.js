import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchJobs, applyToJob } from "../store/actions/jobs";
import Job from "../components/Job";
import withAuth from "../hocs/withAuth";

class JobsList extends Component {
  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    await this.props.fetchJobs();
  }
  render() {
    let jobs = this.props.jobs.map(job => (
      <Job
        key={job._id}
        title={job.title}
        salary={job.salary}
        equity={job.equity}
        id={job._id}
      />
    ));
    return (
      <div>
        <h2>Jobs</h2>
        <ul>{jobs}</ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    jobs: state.jobs,
    username: state.currentUser.user.username
  };
}

export default connect(mapStateToProps, { fetchJobs, applyToJob })(
  withAuth(JobsList)
);
