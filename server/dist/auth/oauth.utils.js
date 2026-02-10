"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOAuthProvider = getOAuthProvider;
const google_provider_1 = require("./providers/google.provider");
const github_provider_1 = require("./providers/github.provider");
function getOAuthProvider(provider) {
    switch (provider) {
        case 'google':
            return new google_provider_1.GoogleProvider();
        case 'github':
            return new github_provider_1.GithubProvider();
        default:
            throw new Error('Unsupported OAuth provider');
    }
}
