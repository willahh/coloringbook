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
npm install -g vercel # Vercel client
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
npm install class-validator class-transformer --save 
npm install @types/node --save-dev # node typings
npm install @nestjs/typeorm
npm install @nestjs/swagger --save

# https://typeorm.io/#quick-start
npx typeorm init --name ColoringBook --database postgres 
````


## Migrations
https://typeorm.io/migrations  
SQL migrations is managed with typeorm.  


# ```sh
# First migration script with initials tables. Use the generated .js file 
# from dist source
npx typeorm migration:generate -d ./dist/data-source.js ./src/migrations/init
npx typeorm migration:run -d ./dist/data-source.js
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


## Deployment to production
```sh
# Navigate to the project root directory before executing any commands
vercel build
vercel deploy
```

## Contact
- [@twitter](https://twitter.com/willahhravel)
- [Coloringbook repository](https://github.com/willahh/coloringbook)


## License
All Rights Reserved

Copyright (c) 2025 William Ravel