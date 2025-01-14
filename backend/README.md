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
touch .env
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
You can test the API with the Swagger on http://localhost:3000/api


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
# https://typeorm.io/#installation
npm install typeorm --save
npm install reflect-metadata --save # reflect-metadata shim
npm install pg --save # db driver
npm install @types/node --save-dev # node typings
npm install @nestjs/typeorm
npm install @nestjs/swagger --save
npm install class-validator class-transformer --save 

# https://typeorm.io/#quick-start
npx typeorm init --name ColoringBook --database postgres 
````


## Exemple of the notes module initialization via the cli :

````sh
nest generate resource



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
```sh
npm i -g vercel
nest build
nest deploy
```

## Contact
- [@twitter](https://twitter.com/willahhravel)
- [Coloringbook repository](https://github.com/willahh/coloringbook)


## License
All Rights Reserved

Copyright (c) 2025 William Ravel