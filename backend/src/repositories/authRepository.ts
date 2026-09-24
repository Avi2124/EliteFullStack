import prisma from "../config/prisma.js";

class AuthRepository {
    async findUserByEmail(email: string) {
        return prisma.user.findUnique({
            where: {
                email
            }
        });
    }
    async findUserById(id:string) {
        return prisma.user.findUnique({
            where: {id}
        });
    }
    async createUser(data: {
        name: string;
        email: string;
        password: string;
    }) {
        return prisma.user.create({
            data
        });
    }

    async createRefreshToken (userId: string, token:string, expiresAt: Date) {
        return prisma.refreshToken.create({
            data: {
                token,
                expiresAt,
                userId
            }
        });
    }
    async findRefreshToken(token:string) {
        return prisma.refreshToken.findUnique({
            where: {token}
        });
    }
    async deleteRefreshToken(token:string) {
        return prisma.refreshToken.deleteMany({
            where: {token}
        });
    }
    async deleteAllRefreshToken(userId: string) {
        return prisma.refreshToken.deleteMany({
            where: {userId}
        });
    }
}

export default new AuthRepository();