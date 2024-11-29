### Campus ERP Back-end Development Modules

#### Dev. Tech Stack and technologies
Node js, TypeScript, PostgreSql database, Express js

#### initialize the project using below command

> npm init -y

#### typescript file compile with dist file

## build command

> tsc

## start command 

> node dist/index.js

## start dev command 

> nodemon dist/index.js

## tsc watch command 

> tsc -w

#### install dependencies of express dotenv and nodemon

npm i express dotenv nodemon

#### install dependencies of typescript

npm i -D typescript @types/express @types/node

#### initialize a typescript configuration file

npx tsc --init

#### install dependency for running typescript file

npm i -D nodemon ts-node

#### install dependency for express-validator

npm install express-validator @types/express-validator

#### install prisma and initialize it

npx prisma
npx prisma init
npx prisma migrate dev --name init

#### migrate changes from prisma to database

npx prisma migrate dev --name=update_descreption_to_description

#### install prisma-client

npm install @prisma/client

#### dependency for encrypting password

npm install bcrypt
npm i --save-dev @types/bcrypt

#### run the project in watch mode

npm run dev

#### install jsonwebtoken for generating token on login

npm i --save-dev @types/jsonwebtoken

#### install cookie-parser

npm i cookie-parser
npm i --save-dev @types/cookie-parser

#### Working of jwtToken

we are setting jwt token as cookie for 1 hour. and one auth middleware is created to verify token.

###### If getting error in npx prisma generate
close all running commands and the apply this


## Deployed postgres backend db with render
 Name- test
 Database- test_database
 Username- root
 Hostname- dpg-cp0rmbi1hbls73efl8v0-a
 Port- 5432
 Database- test_database_ugj6
 Password- 116RmhtLjTUbDDUo2JKRjrZDVTrFLAos
 Internal Database URL- postgres://root:116RmhtLjTUbDDUo2JKRjrZDVTrFLAos@dpg-cp0rmbi1hbls73efl8v0-a/test_database_ugj6
 External Database URL- postgres://root:116RmhtLjTUbDDUo2JKRjrZDVTrFLAos@dpg-cp0rmbi1hbls73efl8v0-a.singapore-postgres.render.com/test_database_ugj6
 PSQL Command- PGPASSWORD=116RmhtLjTUbDDUo2JKRjrZDVTrFLAos psql -h dpg-cp0rmbi1hbls73efl8v0-a.singapore-postgres.render.com -U root test_database_ugj6

### deployed testing API URL endpoint
API URL- https://erp-system-backend.onrender.com/api/v1


### Local database connection
DATABASE_URL="postgresql://postgres:postgresdb@localhost:5432/erp_db?schema=public"

### Repository on bitbucket
erp-system-backend is the name of backend repo of this erp system project.

### Branching strategy
There are 3 branches. ->main,  ->feature/backend-1,  ->testing

#### feature/backend-1 branch
This branch is used to commit new changes from local system.

#### testing branch
after approve of the commits in feature/backend-1 branch all the changes afre merged in the testing branch. And testing is deployed on the render.

#### main branch
after successfully checking the testing branch and its features testing will be merged in main branch and this main branch will be deployed on any cloud platform (aws) for final project.