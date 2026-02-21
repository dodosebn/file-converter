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
exports.GoogleProvider = void 0;
// src/auth/providers/google.provider.ts
const google_auth_library_1 = require("google-auth-library");
class GoogleProvider {
    constructor() {
        this._client = null;
    }
    get client() {
        if (!this._client) {
            const redirectUri = `${process.env.SERVER_URL}/auth/oauth/callback/google`;
            this._client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, redirectUri);
        }
        return this._client;
    }
    getAuthUrl() {
        return this.client.generateAuthUrl({
            scope: ['profile', 'email'],
            prompt: 'consent',
        });
    }
    getUser(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tokens } = yield this.client.getToken(code);
            this.client.setCredentials(tokens);
            const res = yield fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokens.access_token}`);
            const data = yield res.json();
            return {
                provider: 'google',
                providerId: data.sub,
                email: data.email,
                name: data.name,
                avatar: data.picture,
            };
        });
    }
}
exports.GoogleProvider = GoogleProvider;
