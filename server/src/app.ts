import express from 'express';
import cors from 'cors';
import signupRoutes from './routes/signup';
import loginRoutes from './routes/login';
import fileRoutes from './routes/files';
// import googleRequestRoutes from './routes/request';
// import OauthRoutes from './routes/oauth';
import oauthRoutes from './auth/oauth.routes';
const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth', loginRoutes);
// app.use('/auth', googleRequestRoutes);
// app.use('/auth', OauthRoutes);
app.use('/auth', oauthRoutes);

app.use('/auth', signupRoutes);
app.use('/files', fileRoutes);


export default app;