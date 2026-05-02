
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('Users:', JSON.stringify(users, null, 2));
  const projects = await prisma.project.findMany();
  console.log('Projects:', JSON.stringify(projects, null, 2));
  const tasks = await prisma.task.findMany();
  console.log('Tasks:', JSON.stringify(tasks, null, 2));
  const members = await prisma.projectMember.findMany();
  console.log('Members:', JSON.stringify(members, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
