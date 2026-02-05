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
exports.githubSignin = exports.googleSignin = void 0;
const client_1 = require("better-auth/client");
const authClient = (0, client_1.createAuthClient)();
const googleSignin = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield authClient.signIn.social({ provider: "google" });
    console.log("Google login data:", data);
});
exports.googleSignin = googleSignin;
const githubSignin = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield authClient.signIn.social({ provider: "github" });
    console.log("GitHub login data:", data);
});
exports.githubSignin = githubSignin;
