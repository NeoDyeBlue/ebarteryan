import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signIn, getUserInfo } from "../../../lib/controllers/user-controller";
// import GithubProvider from "next-auth/providers/github";
export const authOptions = (req) => ({
  // Configure one or more authentication providers
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials;

        const user = await signIn(email, password);

        // console.log("userfrom", user);

        if (user && user.id) {
          return user;
        }

        return null;
      },
    }),
    // ...add more providers here
  ],
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: "/login",
  },
  events: {
    updateUser: (user) => {
      console.log(user);
    },
  },
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) {
    //   return true;
    // },
    // async redirect({ url, baseUrl }) {
    //   return baseUrl;
    // },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.verified = token.verified;
        session.user.fullName = token.name;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.name = user.fullName;
        token.role = user.role;
        token.picture = user.image.url;
        token.verified = user.verified;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      if (req.url == "/api/auth/session?update" && token) {
        const updatedUser = await getUserInfo(token.sub);
        if (updatedUser) {
          token.name = updatedUser.fullName;
          token.picture = updatedUser.image.url;
          token.verified = updatedUser.verified;
          token.firstName = updatedUser.firstName;
          token.lastName = updatedUser.lastName;
          token.email = updatedUser.email;
        }
      }
      return token;
    },
  },
});

export default async (req, res) => {
  return NextAuth(req, res, authOptions(req));
};

// export default NextAuth(authOptions);
