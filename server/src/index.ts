import 'dotenv/config';

import app from './app';
import dotenv from "dotenv";
dotenv.config(); 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`SERVER_URL: ${process.env.SERVER_URL}`);
  console.log(`GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing'}`);
});
