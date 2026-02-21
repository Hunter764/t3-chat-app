import db from './src/lib/db.js';

async function main() {
  console.log('Connecting with pg pool adapter...')
  const result = await db.$queryRaw`SELECT 1 as test`
  console.log('Query result:', result)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await db.$disconnect())
