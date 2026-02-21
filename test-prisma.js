import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })

async function main() {
  console.log('Testing Prisma connection...')
  await prisma.$connect()
  console.log('Connected!')
  const users = await prisma.user.findMany()
  console.log('Users:', users)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
