const { Pool } = require('pg')

const pool = new Pool({
  port: 5432,
  host: "localhost",
  database: "forumdb_test",
  password:"admin",
  user: "admin"
})

const users = [
  {
    id: "asdkjhaasd1ghyts",
    fullname: "super admin",
    username: "admin",
    password: "admin"
  }
]

async function seedUsers() {
  try {
    users.map(async (user) => {
      await pool.query({
        text: "INSERT INTO users VALUES($1, $2, $3, $4)",
        values: [user.id, user.fullname, user.username, user.password]
      })
      console.log("insert user :", user.username);
    })
  } catch (error) {
    console.log("Seed users failure", error);
    throw error
  }
}

async function main() {
  await seedUsers()
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});