import { prisma } from "../lib/prisma"



const categoriesData = [

    {
        "name": "Kacchi & Biryani",
        "slug": "kacchi-and-biryani",
        "logo": "https://i.ibb.co.com/fVyR9Dk6/shourav-sheikh-j9low-Ncnl04-unsplash.jpg"
    },
    {
        "name": "Burgers & Fast Food",
        "slug": "burgers-and-fast-food",
        "logo": "https://i.ibb.co.com/mVPw8VXs/mae-mu-I7-A-p-HLc-QK8-unsplash.jpg"
    },
    {
        "name": "Deshi Meals",
        "slug": "deshi-meals",
        "logo": "https://i.ibb.co.com/kg5vqjkP/sama-hosseini-a-Ki-W1w-N0eks-unsplash.jpg"
    },
    {
        "name": "Chinese & Asian",
        "slug": "chinese-and-asian",
        "logo": "https://i.ibb.co.com/bRdmcnbr/ogulcan-ercal-hl4-Ulv4-Ix-ZA-unsplash.jpg"
    },
    {
        "name": "Desserts & Bakery",
        "slug": "desserts-and-bakery",
        "logo": "https://i.ibb.co.com/RktyHF58/ezgi-deliklitas-BMD3-Mn-OYGc-unsplash.jpg"
    }

]

const authorData = {
    "authoremail": "tawfa@gmail.com",
    "restaurantName": "Chillox Dhanmondi",
    "tagline": "Slayer of Hunger, Master of Juicy Burgers!",
    "location": "House 45, Road 16 (Old 27), Dhanmondi, Dhaka",
    "logo": "https://i.ibb.co.com/kg5vqjkP/sama-hosseini-a-Ki-W1w-N0eks-unsplash.jpg"
}

async function main() {
    try {
        console.log(`Start seeding categories...`)

        // createMany ব্যবহার করলে একবারে সব ডাটা ইনসার্ট হয়ে যাবে
        // await prisma.provider.create({
        //     data: authorData
        // })

        console.log(`Seeding finished.`)
    } catch (error) {
        await prisma.$disconnect()
        console.error(error)
        process.exit(1)
    }
}

main()
