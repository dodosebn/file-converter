"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const better_auth_1 = require("better-auth");
// export const auth = betterAuth({
//     baseURL: process.env.BETTER_AUTH_URL, 
//     socialProviders: {
//         google: { 
//             clientId: process.env.GOOGLE_CLIENT_ID as string, 
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
//         }, 
//     },
// });
exports.auth = (0, better_auth_1.betterAuth)({
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
    },
});
