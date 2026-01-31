import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient();

export const googleSignin = async () => {
  const data = await authClient.signIn.social({ provider: "google" });
  console.log("Google login data:", data);
};

export const githubSignin = async () => {
  const data = await authClient.signIn.social({ provider: "github" });
  console.log("GitHub login data:", data);
};
