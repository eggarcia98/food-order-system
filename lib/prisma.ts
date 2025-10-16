import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig, Pool } from '@neondatabase/serverless'


const connectionString = `${process.env.DATABASE_URL}`;
console.log('Connection String:', connectionString);

const adapter = new PrismaNeon({ connectionString });
export const prisma = new PrismaClient({ adapter });
