import express from 'express';
import cors from 'cors';
import signupRoutes from './routes/signup';
import loginRoutes from './routes/login';
import fileRoutes from './routes/files';

import oauthRoutes from './auth/oauth.routes';
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use('/auth', loginRoutes);
app.use('/auth', oauthRoutes);
app.use('/auth', signupRoutes);
app.use('/files', fileRoutes);



export default app;