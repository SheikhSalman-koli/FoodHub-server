import { prisma } from '../lib/prisma.js';
import { auth } from '../lib/auth.js';
import { Role } from '../../generated/prisma/index.js';
async function main() {
    const adminName = 'J K';
    const adminEmail = 'programming.hero@gmail.com';
    const adminPassword = 'admin1234';
    const existingUser = await prisma.user.findUnique({
        where: { email: adminEmail },
    });
    if (existingUser) {
        console.log('Admin user already exists.');
        return;
    }
    const authResult = await auth.api.signUpEmail({
        body: {
            name: adminName,
            email: adminEmail,
            password: adminPassword,
            role: Role.ADMIN,
        },
    });
    if (authResult?.user?.id) {
        await prisma.user.update({
            where: { id: authResult.user.id },
            data: { emailVerified: true },
        });
    }
    console.log('Admin user seeded successfully');
}
main()
    .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
