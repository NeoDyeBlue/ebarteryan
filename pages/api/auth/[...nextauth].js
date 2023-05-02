import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  signIn,
  getUserBasicInfo,
  handleGoogleAuth,
} from "../../../lib/data-access/user";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // httpOptions: {
      //   timeout: 40000,
      // },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
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
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        await handleGoogleAuth(
          profile.given_name,
          profile.family_name,
          profile.email,
          profile.picture
        );
        return true;
      }
      if (account.provider === "facebook") {
        // await handleGoogleAuth(
        //   profile.given_name,
        //   profile.family_name,
        //   profile.email,
        //   profile.picture
        // );
        console.log(profile);
        return true;
      }
      return true; // do other things for other providers
    },
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
    async jwt({ token, user, profile }) {
      // update
      if (req.url == "/api/auth/session?update" && token) {
        const updatedUser = await getUserBasicInfo({ id: token.sub });
        if (updatedUser) {
          token.name = updatedUser.fullName;
          token.picture = updatedUser.image.url;
          token.verified = updatedUser.verified;
          token.firstName = updatedUser.firstName;
          token.lastName = updatedUser.lastName;
          token.email = updatedUser.email;
        }
      }
      //google or fb
      else if (profile) {
        const userProfile = await getUserBasicInfo({ email: token.email });
        token.sub = userProfile._id;
        token.name = userProfile.fullName;
        token.role = userProfile.role;
        token.picture = userProfile.image.url;
        token.verified = userProfile.verified;
        token.firstName = userProfile.firstName;
        token.lastName = userProfile.lastName;
      }
      //credentials
      else if (user && !profile) {
        token.sub = user.id || user._id;
        token.name = user.fullName;
        token.role = user.role;
        token.picture = user.image.url;
        token.verified = user.verified;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },
  },
});

export default async function handler(req, res) {
  return NextAuth(req, res, authOptions(req));
}

// export default NextAuth(authOptions);
