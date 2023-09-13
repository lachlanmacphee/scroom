import { issue } from './issue';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()


async function seed() {
  try {
    // Sample data
    await prisma.team.create({
      data: {
        id: "team-1", 
        name: "Team 1",
        projectName: "Project A",
      },
    })
    
    for (const issues of issue){
      await prisma.issue.create({
        data: issues
      })
    }
  
    

    console.log("Sample data seeded successfully");
  } catch (error) {
    console.error("Error seeding sample data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed()
    .then(()=> prisma.$disconnect())
    .catch(async (e) => {
        console.log(e)
        await prisma.$disconnect()
        process.exit(1)
    })
   