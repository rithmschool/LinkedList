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

[Here](https://github.com/rithmschool/LinkedList/tree/master/backend) is the instructor solution for the backend. There are instructions in this folder's README for how to run the app locally so you can build the frontend.

## Frontend

Check out these [mocks](https://app.moqups.com/michael@rithmschool.com/vgRzAjTRTd/view)!

### Technical

1.  The frontend should be a single page application that utilizes React and Redux.
1.  (BONUS) The frontend should be mobile-optimized.

### Users Epic

1.  As a user, I should be able to sign up, which directs me to my feed.
1.  As a user, I should be able to log in, which directs me to my feed.
1.  As a user, I should have a feed which consists of the latest job listings.
1.  As a user, I should be able to have a resume which serves as my profile page.
1.  As a user, I should be able to visit a company's profile page.
1.  As a user, I should be able to visit another user's profile page.
1.  As a user, I should be able to apply to a job.
1.  As a user, I should be able to search for companies.
1.  As a user, I should be able to search for other users.
1.  (_Bonus_) As a user, I should be able to connect or disconnect with another user by clicking on a button on their profile page.
1.  (_Bonus_) As a user, I should have a feed of all of my connections.
1.  (_Bonus_) As a user, I should be able to upload a profile picture.
1.  (_Bonus_) As a user, I should be able to send a message to another user.
1.  (_Bonus_) As a user, I should be able to respond to a message.
1.  (_Bonus_) As a user, I should have a list of all of my messages from other users.

### Companies Epic

1.  As a company, I should be able to sign up, which directs me to my job listings.
1.  As a company, I should be able to log in, which directs me to my job listings.
1.  As a company, I should have a feed which consists of all of my job listings.
1.  As a company, I should be able to visit my profile page when logging in.
1.  As a company, I should be able to add a job listing.
1.  As a company, I should be able to update a job listing.
1.  As a company, I should be able to remove a job listing.
1.  As a company, I should have a list of all of the users who applied to my job listings.
1.  As a company, I should be able to search for users.
1.  (_Bonus_) As a company, I should be able to upload a company logo.
1.  (_Bonus_) As a company, I should be able to respond to applicants.
