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
exports.GithubProvider = void 0;
const redirectUri = 'http://localhost:3000/auth/callback/github';
class GithubProvider {
    getAuthUrl() {
        return (`https://github.com/login/oauth/authorize` +
            `?client_id=${process.env.GITHUB_CLIENT_ID}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&scope=user:email`);
    }
    getUser(code) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const tokenRes = yield fetch('https://github.com/login/oauth/access_token', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    client_id: process.env.GITHUB_CLIENT_ID,
                    client_secret: process.env.GITHUB_CLIENT_SECRET,
                    code,
                }),
            });
            const tokenData = yield tokenRes.json();
            const accessToken = tokenData.access_token;
            const userRes = yield fetch('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const user = yield userRes.json();
            const emailRes = yield fetch('https://api.github.com/user/emails', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const emails = yield emailRes.json();
            const primaryEmail = ((_a = emails.find((e) => e.primary)) === null || _a === void 0 ? void 0 : _a.email) || user.email;
            return {
                provider: 'github',
                providerId: String(user.id),
                email: primaryEmail,
                name: user.name || user.login,
                avatar: user.avatar_url,
            };
        });
    }
}
exports.GithubProvider = GithubProvider;
