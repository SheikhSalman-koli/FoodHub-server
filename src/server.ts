import app from "./app";
import { prisma } from "./lib/prisma"

const port = process.env.PORT || 5000

async function main() {
  try {
  
    await prisma.$connect()
    console.log('connected DB successfully!');

    app.get('/', (req, res)=>{
      res.send('Hello world!')
    })

    app.listen(port, ()=>{
       console.log(`server is running on port ${port}`);
    })

  } catch (error) {
    console.error('An error occurred:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

main()