<br />
<p align="center">
<a href="../documents/images/coloringbook_logo_wide.png">
    <img src="../documents/images/coloringbook_logo_wide.png" alt="Coloring Book" width="400" >
  </a>

  <p align="center">
    A React application for creating personalized coloring books from imported or custom-created images.
    <br />
    <a href="https://github.com/willahh/coloringbook"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://willahh.github.io/coloringbook/">Live Demo</a>
    ·
    <a href="https://github.com/willahh/coloringbook/issues">Report Bug</a>
    ·
    <a href="https://github.com/willahh/coloringbook/issues">Request Feature</a>
  </p>
</p>

# Backend
Backend REST API.

Built with [Nest](https://github.com/nestjs/nest), [TypeORM](https://typeorm.io) and hosted on [Vercel](https://vercel.com/)


## Installation
```sh
$ npm install

# Create a .env file
DATABASE_HOST=localhost
DATABASE_NAME=Coloringbookdb
DATABASE_PORT=5432
DATABASE_USER=user
DATABASE_PASSWORD=password
````

## Running the app in local environment
````sh
# First mount the docker from /infra
docker-compose up -d

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
````

## Test in local
````sh
http://localhost:3000/api
````



## Project setup
````sh
npm install -g @nestjs/cli # Install the Nestjs cli globally
nest new project-name # Initialize Nestjs project

# Dotenv is a zero-dependency module that loads environment variables from 
a .env file into process.env.
npm install dotenv

# TypeORM is an ORM that can run in NodeJS, Browser, Cordova, PhoneGap, Ionic, 
#React Native, NativeScript, Expo, and Electron platforms and can be used with 
# TypeScript and JavaScript (ES5, ES6, ES7, ES8). TypeORM is highly influenced
# by other ORMs, such as Hibernate, Doctrine and Entity Framework.
npm install typeorm --save # https://typeorm.io/#installation
npm install reflect-metadata --save # reflect-metadata shim - https://typeorm.io/#installation
npm install @types/node --save-dev # node typings - https://typeorm.io/#installation
npm install pg --save # db driver - https://typeorm.io/#installation

# Mapped Types module for Nest used by the @nestjs/graphql and @nestjs/swagger packages.
npm i @nestjs/mapped-types

# https://typeorm.io/#quick-start
npx typeorm init --name MyProject --database postgres 


# # Allows use of decorator and non-decorator based validation. Internally uses validator.js to perform validation. Class-validator works on both browser and node.js platforms.
# # It is used by DTO objects.
# npm i class-validator

# # Class-transformer allows you to transform plain object to some instance of class and versa.
# npm i class-transformer

# # Non-blocking PostgreSQL client for Node.js. Pure JavaScript and optional native libpq bindings.
# npm i pg

# # Mapped Types module for Nest used by the @nestjs/graphql and @nestjs/swagger packages.
# npm i @nestjs/mapped-types

# # TypeORM module for Nest.
# npm i @nestjs/typeorm

# # Configuration module for Nest based on the dotenv (to load process environment variables) package.
# npm i @nestjs/config

# # nestjs common stuff
# npm i @nestjs/common
````




## Exemple of the notes module initialization via the cli :

````sh
# 1. Generate the notes module
nest generate module notes

# 2. Generate notes controller
nest generate controller notes

# 3. Generate notes service
nest generate service notes

# 4. Generate note Entity
nest g class notes/note.entity --no-spec

# 5. Generate CreateNoteDTO
nest g class notes/create-note.dto --no-spec

# 6. Generate UpdateNoteDTO
nest g class notes/update-note.dto --no-spec

# 7. Generate pagination-query DTO
nest generate class common/dto/pagination-query.dto --no-spec

## Generation of the users module
````sh
# 1. Generate module files
 nest generate module users
 nest generate controller users
 nest generate class users/user.entity --no-spec
 nest g class users/create-user.dto --no-spec
 nest g class users/update-user.dto --no-spec

# 2. Generate a new users.service.ts file
# 3. Fill in generated files
# 4. Run the server
npm run start:dev

# 5. Create a new migration script
# This will :
# - Update the db schema 
# - Add a new entry in the migrations table
# - Add a new migration file
npx typeorm migration:generate -n CreateUserTable

## Restart the server

# Run the new migration script
# This will, in this case, create the new user table
npx typeorm migration:run # Runs all pending migrations

````

## Migrations
SQL migrations is managed with typeorm.  
A `ormconfig.js` file is required :
```js
module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'username',
  password: 'password',
  database: 'database',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
````

```sh
npx typeorm migration:create -n MyMigration # Creates a new migration file
npx typeorm migration:generate -n SchemaSync # Generates a new migration file with sql needs to be executed to update schema.
npx typeorm migration:run # Runs all pending migrations
npx typeorm migration:revert # Reverts last executed migration
#npx typeorm migration:sync # Sync migration
npx typeorm migration:show # Show all migrations and whether they have been run or not
```

Example :  
The server needs to be started before the scripts can update the migration table :

```sh
npm run start:dev # Start the backend
npx typeorm migration:generate -n InitialData # Initialize a first migration
```


## Test

```bash
$ npm run test # unit tests
$ npm run test:e2e 
$ npm run test:cov # test coverage
```

### Testing the API with Insomnia
For API testing purpose, an Insomnia workspace settings is available in `resources/Insomnia-workspace.json`.


## Documentation
The backend documentation is generated with [Compodoc](https://compodoc.app/).
````sh
npm i -D @compodoc/compodoc
npx @compodoc/compodoc -p tsconfig.json -s --port 8081
# Or with the project script
npm run generate-doc-local
````

### Coloringbook API documentation
TODO


## Deployment to production
The backend is deployed on `Google Cloud` using `App Engine`.
Postgres SQL is managed with `Google Cloud SQL`.

To deploy :
````sh
# A .env file is required with the following informations :

# SQL env
DATABASE_HOST={database_host_ip}
DATABASE_NAME=postgres
DATABASE_PORT=5432
DATABASE_USER={database_user}
DATABASE_PASSWORD={database_password}

# Service account
DB_INSTANCE_NAME={myapplication-xxx:europe-west1:xxx}

# Deploy to production
npm run deploy

````

## Contact
- [@twitter](https://twitter.com/willahhravel)
- [Coloringbook repository](https://github.com/willahh/coloringbook)


## License
All Rights Reserved

Copyright (c) 2025 William Ravel