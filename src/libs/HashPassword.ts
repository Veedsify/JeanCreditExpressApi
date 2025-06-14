import bcrypt from "bcryptjs";
async function CreateHashedPassword(password: string) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
}

async function CompareHashedPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
}

export { CreateHashedPassword, CompareHashedPassword }