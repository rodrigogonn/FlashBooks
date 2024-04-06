const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Criar um novo usuário
  const newUser = await prisma.user.create({
    data: {
      username: 'alice',
      email: 'alice@example.com',
      password: 'hashedpassword', // Lembre-se de nunca armazenar senhas em texto claro
    },
  });

  console.log('User created:', newUser);

  // Consultar os usuários
  const users = await prisma.user.findMany();
  console.log('Users:', users);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });