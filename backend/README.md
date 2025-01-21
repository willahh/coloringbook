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
    <a href="https://coloringbook-frontend.onrender.com/">Live Demo</a>
    ·
    <a href="https://github.com/willahh/coloringbook/issues">Report Bug</a>
    ·
    <a href="https://github.com/willahh/coloringbook/issues">Request Feature</a>
  </p>
</p>



# Backend
Backend REST API.

Built with [Nest](https://github.com/nestjs/nest), [TypeORM](https://typeorm.io) 
,hosted on [Vercel](https://vercel.com/). Database: [Neon](https://console.neon.tech/app/projects/icy-butterfly-57903853/branches/br-orange-art-a2b2bsgu/tables?database=neondb)



## Installation
```sh
$ npm install
````
Create a .env file from the .env.sample.

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
```sh
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
npm install @types/multer -D # https://docs.nestjs.com/techniques/file-upload
npm install sharp # Sharp - High performance Node.js image processing https://sharp.pixelplumbing.com 

# https://typeorm.io/#quick-start
npx typeorm init --name ColoringBook --database postgres 
```



## Deploy to production
### Database
The production database is Postgres. It is deployed on Supabase: [https://supabase.com/dashboard/project/sdliwenpdqycibocgdzv/editor/33683?schema=public](https://supabase.com/dashboard/project/sdliwenpdqycibocgdzv/editor/33683?schema=public).



### Backend API
Builds and deployment are managed via Render: [https://dashboard.render.com/](https://dashboard.render.com/).  
The production URL for the API is: [https://coloringbook-backend.onrender.com/api](https://coloringbook-backend.onrender.com/api)
The backend API is automatically deployed when pushing new commits to the master branch.



## Migrations
https://typeorm.io/migrations  
SQL migrations is managed with typeorm.  

```sh
# 1. Generate the migration script
npx typeorm migration:generate -d ./public/data-source.js ./src/migrations/init

# 2. Add the migration file to the datasource
```sh
export const options: DataSourceOptions = {
  ...
  migrations: [Init1736932735124, BookAddColumnCoverImage1737027990891],
  ...
};
```

# 3. Rebuild the frontend to generate the .js file
npm run start

# 4. Run the migration script.
# It should add a new row in the migrations table and update the database 
# accordingly to the migration script
```sh
npx typeorm migration:run -d ./public/data-source.js
```



## Run the migrations script on production database
To run the migration scripts on production database, use the `production.env` 
file before running the `migration:run` command mentioned above. You can
go in `data-source.ts` file switch override `envFile = 'production.env';` : 

1. In `data-source.ts` uncomment `envFile = 'production.env';`.
2. Run `npm run start` 
3. Run `npx typeorm migration:run -d ./public/data-source.js`

You should see migrations logs :
```sh
...
Initialize and export the data source for database connection
Data source initialized
query: SELECT * FROM current_schema()
query: SELECT * FROM current_schema()
query: SELECT version();
query: SELECT version();
query: SELECT * FROM "information_schema"."tables" WHERE "table_schema" = 'public' AND "table_name" = 'migrations'
query: SELECT * FROM "migrations" "migrations" ORDER BY "id" DESC
1 migrations are already loaded in the database.
2 migrations were found in the source code.
...
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



## Contact
- [@twitter](https://twitter.com/willahhravel)
- [Coloringbook repository](https://github.com/willahh/coloringbook)



## License
All Rights Reserved

Copyright (c) 2025 William Ravel
