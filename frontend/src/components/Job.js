import React from "react";
import { Link } from "react-router-dom";
const Job = ({ title, salary, equity, company, id }) => (
  <div>
    {title} @{company}
    {salary}
    {equity}
    <Link
      to={{
        pathname: `/jobs/${id}/apply`,
        search: `handle=${company}`
      }}
    >
      Apply
    </Link>
  </div>
);

export default Job;
