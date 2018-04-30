import React from "react";
import { Link } from "react-router-dom";
const Job = ({ title, salary, equity, id }) => (
  <div>
    {title}
    {salary}
    {equity}
    <Link
      to={{
        pathname: `/jobs/${id}/apply`
      }}
    >
      Apply
    </Link>
  </div>
);

export default Job;
