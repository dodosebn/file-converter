import { Router } from 'express';
import { startOAuth, oauthCallback } from './oauth.controller';

const router = Router();

router.post('/:provider', startOAuth);
router.get('/callback/:provider', oauthCallback);

export default router;
