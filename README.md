# LinkedList Project

LinkedIn/AngelList type of clone.

## Backend

### High-Level Requirements

1.  The backend should be a RESTful API using JSON.
1.  The server must be Node.js and Express.js, and the database must be PostgreSQL.
1.  The API must be built to spec according to the [documentation on Apiary](https://linkedlist.docs.apiary.io/).
1.  The server must implement authentication using JWT and encrypt passwords in the database.
1.  The server must have automated endpoint tests, written with Jest/SuperTest, for each endpoint.
1.  (BONUS) The server must be deployed to Heroku.

### Specific Requirements

1.  The server should validate bad inputs for every POST and PATCH request and issue `400 - Bad Request` responses.
    - (BONUS) The server should validate proper email formats.
    - (BONUS) The server should validate proper URI formats.
1.  The server should issue `409 - Conflict` responses when trying to create a `username` or company `handle` that already exists.
1.  Users cannot edit or delete users other than themselves.
1.  Companies cannot edit or delete companies other than themselves.
1.  Users can create, view, or delete job applications `/jobs/:id/applications`. Companies can only view or delete job applications.
1.  Companies cannot edit or delete job listings by other companies.
1.  Deleting a company should delete all of the jobs that the company posted.
1.  Deleting a company should make users who work at that company have `null` for their `current_company` fields.
1.  Hashed passwords should not be visible on any of the responses.
1.  (BONUS) For the following three endpoints: `GET /users`, `GET /companies`, `GET /jobs` implement `offset` and `limit` query parameters. For instance `/users?limit=10` should return the first 10 users, and `/users?offset=10&limit=10` should return the next 10 users.
1.  (BONUS) For the following three endpoints: `GET /users`, `GET /companies`, `GET /jobs` implement `search` queries, for instance `/users?search=Matt+Lane` should issue a search for `Matt Lane` in the database.

### Backend Solution

[Here](https://github.com/rithmschool/LinkedList/tree/master/solution/backend) is the instructor solution for the backend. There are instructions in this folder's README for how to run the app locally so you can build the frontend.

The production app of the solution code, deployed on Heroku, is available at this base-URL:

`https://linkedlist-rithm.herokuapp.com/`

For the frontend, you may use this deployed version or fork/clone and run the app locally (instructions below) if you want.

---

## Frontend

The Frontend should be a separate repository than the backend. [Here](https://github.com/rithmschool/linkedlist-frontend) is the starter code for the frontend.

The Frontend requirements below are organized into [Agile Epics](https://www.atlassian.com/agile/project-management/epics) consisting of many related user stories. This is a super common way of listing requirements in the modern software industry.

### Mock-Ups

Check out these interactive [mock-ups at moqups.com](https://app.moqups.com/michael@rithmschool.com/vgRzAjTRTd/view)!

### Technical Requirements

1.  The frontend should be a single page application that utilizes React and Redux.
1.  The frontend should have smoke and snapshot tests for every React component.
1.  The frontend should have [Prop Types listed](https://reactjs.org/docs/typechecking-with-proptypes.html) for every React component that has props.
1.  (_Bonus_) It would be nice if there were tests for Redux containers, action creators, and reducers.
1.  (_Bonus_) It would be nice if the frontend were mobile-optimized.

### Users Epic

The following list of stories is the main objective for each group to finish by the end of the week.

The first two stories here are crossed out because they have already been implemented for you! The third one is halfway-done, it just doesn't look pretty yet.

1.  ~~As a user, I should be able to sign up, which directs me to my feed.~~
1.  ~~As a user, I should be able to log in, which directs me to my feed.~~
1.  As a user, I should have a feed which consists of the latest job listings.
1.  As a user, I should be able to have a profile page with my photo, name, username, current company, and jobs that I have applied to listed.
1.  As a user, I should be able to click `edit` in the top right corner of my profile, which lets me edit any of my user fields, including changing my `password`.
1.  As a user, I should be able to visit a company's profile page.
1.  As a user, I should be able to visit another user's profile page. Their profile pages should have their photo, name, username, current company, and a `contact` button that is a `mailto:` link to their email address.
1.  As a user, I should be able to apply to a job.
1.  As a user, I should be able to search for companies.
1.  As a user, I should be able to search for other users.
1.  As a user, I should be able to search for jobs.
1.  (_Bonus_) As a user, it would be nice if I were able to upload a profile picture instead of just providing a URL. _Hint: [UploadCare](https://uploadcare.com/)_

### (_Bonus_) Companies Epic

**All of the following user stories are bonuses. The intent of the 3-day project sprint is to finish the Users Epic.** That being said, definitely feel free to come back to your project and add to it!

1.  As a company, I should be able to sign up, which directs me to _my_ job listings.
1.  As a company, I should be able to log in, which directs me to my job listings.
1.  As a company, I should have a feed which consists of all of my job listings.
1.  As a company, I should be able to visit my profile page after logging in.
1.  As a company, I should be able to add a job listing.
1.  As a company, I should be able to edit my job listings.
1.  As a company, I should be able to remove my job listings.
1.  As a company, I should have a list of all of the users who applied to my job listings on my profile page.
1.  As a company, I should be able to search for users.
1.  (_Double Bonus_) As a company, it would be nice if I were able to upload a company logo instead of just providing a URL. _Hint: [UploadCare](https://uploadcare.com/)_
