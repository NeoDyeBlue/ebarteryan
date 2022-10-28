import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import GithubProvider from "next-auth/providers/github";
export const authOptions = {
  // Configure one or more authentication providers
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      authorize(credentials, req) {
        return {};
      },
    }),
    // ...add more providers here
  ],
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
