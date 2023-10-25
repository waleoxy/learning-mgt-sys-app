const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Computer Science" },
        { name: "Mathematics" },
        { name: "Physics" },
        { name: "Chemistry" },
        { name: "Biology" },
        { name: "Economics" },
      ],
    });
    console.log("success");
  } catch (error) {
    console.log("Error in seeding the database categories");
  } finally {
    await database.$disconnect();
  }
}

main();
