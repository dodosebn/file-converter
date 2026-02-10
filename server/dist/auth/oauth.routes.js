"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const oauth_controller_1 = require("./oauth.controller");
const router = (0, express_1.Router)();
router.post('/:provider', oauth_controller_1.startOAuth);
router.get('/callback/:provider', oauth_controller_1.oauthCallback);
exports.default = router;
