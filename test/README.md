## Run tests

1. Install and start Option One DB
2. Login as admin and create a "mocha-test-db1"
3. for this DB,
   1. create an admin API access key for "*" (= all DBs, incl DB creation)
   1. create an database API access key
4. Configure the tests:

    export DB_URL='...'
    export DB_ADMIN_ACCESS_ID='...'
    export DB_ADMIN_ACCESS_KEY='...'
    export DB_ACCESS_ID='...'
    export DB_ACCESS_KEY='...'

5. Prepare

    npm install
    cd test

6. Start some SDK test, e.g.
  
    mocha test-db-1-cre-coll

Hint: DB_URL is the REST API URL of the DB, something like "http://localhost:9000/db"