# LinkedList Backend (Instructor Solution)

The production app of the solution code, deployed on Heroku, is available at this base-URL:

`https://linkedlist-rithm.herokuapp.com/`

For the frontend, you may use this version or fork/clone and run the app locally (instructions below).

## How to Install & Run

1.  Fork the repo, clone it onto your machine, then run `git remote add upstream git@github.com:rithmschool/LinkedList.git` and `git pull upstream master`.

1.  Make sure you are in the `backend` directory.

1.  Run `npm install` to install packages.

1.  Run `npm run db-setup` to set up the postgres database.

1.  Run `npm start` to start the production server locally.

1.  Server is accessible at `http://localhost:3000`.

1.  Example API POST request payloads are in the `example_requests` folder.

1.  (Optional) Run `npm test` to run the entire test suite (make sure the server isn't running).

1.  (Optional) If you want to run the server in development mode, use `npm run dev`. This will restart the server on any change. Use ctrl-c to stop the dev server.

### Please let us know of any bugs and document them in the [GitHub issues tab](https://github.com/rithmschool/LinkedList/issues)! Thank you and enjoy!

_Instructors: deploy using `git subtree push --prefix solution/backend heroku master`_
