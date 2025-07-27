import { connectMongoDB } from "@/libs/config/db";
import UserModel from "@/libs/models/UserModel";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials;
        try {
          await connectMongoDB();
          const user = await UserModel.findOne({ email });

          if (!user) {
            // console.log("❌ User not found for email:", email);
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            // console.log("❌ Password mismatch for user:", user.email);
            return null;
          }

          {/*// Log retrieved user data from MongoDB
          console.log("✅ User authenticated successfully:", {
            id: user._id.toString(),
            email: user.email,
            fullname: user.fullname,
            isAdmin: user.isAdmin,
          });*/}

          return {
            id: user._id.toString(),
            email: user.email,
            fullname: user.fullname,
            isAdmin: user.isAdmin,
          };
        } catch (error) {
          console.log("🔴 Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      {/*// Log before adding user data
      console.log("JWT callback - initial token:", token);
      console.log("JWT callback - user data:", user);*/}

      if (user) {
        // Add user data to token
        token.id = user.id;
        token.fullname = user.fullname;
        token.isAdmin = user.isAdmin;
        
       {/* // Log updated token
        console.log("🪙 Updated JWT token:", {
          id: token.id,
          email: token.email,
          fullname: token.fullname,
          isAdmin: token.isAdmin
        });*/}
      }
      return token;
    },
    async session({ session, token }) {
      {/*// Log before adding token data
      console.log("Session callback - initial session:", session);
      console.log("Session callback - token data:", token);*/}

      if (token) {
        // Add user data to session
        session.user.id = token.id;
        session.user.fullname = token.fullname;
        session.user.isAdmin = token.isAdmin;
        
        {/*// Log updated session
        console.log("🔐 Updated session data:", {
          user: {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            isAdmin: session.user.isAdmin
          }
        });*/}
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };