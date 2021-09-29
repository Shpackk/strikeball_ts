
module.exports = {
   "type": process.env.DB_TYPE,
   "host": process.env.DB_HOST,
   "port": process.env.DB_PORT,
   "username": process.env.DB_USERNAME,
   "password": process.env.DB_PASSWORD,
   "database": process.env.DB_NAME,
   "synchronize": false,
   "logging": false,
   "entities": [
      // __dirname + '/../**/**.entity{.ts,.js}'
      // './dist/src/db/entity/*.entity{.ts,.js}' // for npm start
      'src/db/entity/*.entity{.ts,.js}' // for tests
   ],
   "migrations": [
      "dist/src/db/migrations/*.{ts,js}"
   ],
   "subscribers": [
      "dist/src/db/subscriber/**/*.{ts.js}"
   ],
   "cli": {
      "entitiesDir": "src/db/entity",
      "migrationsDir": "src/db/migrations",
      "subscribersDir": "src/subscriber"
   }
}

