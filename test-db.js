import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })

async function main() {
  console.log('Connecting to database...')
  const result = await prisma.$queryRaw`SELECT 1 as test`
  console.log('Query result:', result)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
