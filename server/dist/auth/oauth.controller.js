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
exports.oauthCallback = exports.startOAuth = void 0;
const oauth_utils_1 = require("./oauth.utils");
const oauth_service_1 = require("./oauth.service");
const jwt_1 = require("./jwt");
const normalizeParam = (p) => Array.isArray(p) ? p[0] : p;
const startOAuth = (req, res) => {
    const provider = normalizeParam(req.params.provider);
    const oauthProvider = (0, oauth_utils_1.getOAuthProvider)(provider);
    res.json({ url: oauthProvider.getAuthUrl() });
};
exports.startOAuth = startOAuth;
const oauthCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const provider = normalizeParam(req.params.provider);
    const code = req.query.code;
    try {
        const oauthProvider = (0, oauth_utils_1.getOAuthProvider)(provider);
        const oauthUser = yield oauthProvider.getUser(code);
        const user = yield (0, oauth_service_1.findOrCreateOAuthUser)(oauthUser);
        const token = (0, jwt_1.signJwt)(user.id);
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.redirect(`${process.env.FRONTEND_URL}/in/home?token=${token}`);
    }
    catch (err) {
        console.error('OAuth error:', err);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
});
exports.oauthCallback = oauthCallback;
