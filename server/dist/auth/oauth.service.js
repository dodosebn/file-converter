"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrCreateOAuthUser = findOrCreateOAuthUser;
const prisma_1 = require("../lib/prisma");
function findOrCreateOAuthUser(oauthUser) {
    return __awaiter(this, void 0, void 0, function* () {
        const { provider, providerId, email, name } = oauthUser;
        // 1. Try provider ID first
        let user = yield prisma_1.prisma.user.findFirst({
            where: provider === 'google'
                ? { googleId: providerId }
                : { githubId: providerId },
        });
        // 2. If not found, try email (account linking)
        if (!user && email) {
            user = yield prisma_1.prisma.user.findUnique({ where: { email } });
            if (user) {
                // Link provider to existing account
                user = yield prisma_1.prisma.user.update({
                    where: { id: user.id },
                    data: provider === 'google'
                        ? { googleId: providerId }
                        : { githubId: providerId },
                });
            }
        }
        // 3. Still no user → create new one
        if (!user) {
            user = yield prisma_1.prisma.user.create({
                data: {
                    email,
                    name,
                    googleId: provider === 'google' ? providerId : undefined,
                    githubId: provider === 'github' ? providerId : undefined,
                },
            });
        }
        return user;
    });
}
