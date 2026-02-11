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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const google_auth_library_1 = require("google-auth-library");
const dotenv_1 = __importDefault(require("dotenv"));
const router = (0, express_1.Router)();
dotenv_1.default.config();
function getUserData(access_token) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${access_token}`);
        const data = yield response.json();
        console.log('data', data);
    });
}
router.get('/callback/google', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code;
    try {
        const redirectUrl = 'http://localhost:3000/auth/callback/google';
        const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, redirectUrl);
        const tokenResponse = yield client.getToken(code);
        client.setCredentials(tokenResponse.tokens);
        const user = tokenResponse.tokens;
        yield getUserData(user.access_token);
        res.redirect(`${process.env.FRONTEND_URL}/in/home`);
    }
    catch (err) {
        console.error('Google OAuth error:', err);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
}));
exports.default = router;
