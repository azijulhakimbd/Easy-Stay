import User from "@/models/user.models";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from 'bcrypt';
import GitHubProvider from "next-auth/providers/github";
import dbConnect from "@/lib/dbConnect";

 // Ensure this is still needed if no OTP


export const authOptions = {
  providers: [
     GitHubProvider({
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET
  }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    CredentialsProvider({
      name: "Credentials",
      id: 'credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@gmail.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        await dbConnect();
        try {
          const user = await User.findOne({
            $or: [{ email: credentials?.email }, { username: credentials?.username }]
          });

          if (!user) {
            throw new Error('User not found');
          }
          if (!user.isVerified) {
            throw new Error('Signup again and verify your account');
          }

          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error('Incorrect Password');
          }
        } catch (error) {
          console.error("Error in authorize:", error.message); // Log for debugging
          return null; // Explicitly return null for failed login
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const { name, email } = user;
      const { provider } = account;

      try {
        await dbConnect();
        if (provider === 'google' || provider ==='github') {
          const userExists = await User.findOne({ email });

          if (userExists) {
            return true; // Complete sign-in for existing users
          }


          // New Google user: create and mark as verified
          const newUser = new User({
            email,
            username: name,
            isVerified: true,
            role: "user"
          });
          await newUser.save();
          return true; 
  
        }
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false; // Deny sign-in on error
      }
      return true; //
    },
    async jwt({ token, user, account }) {
      
      if (account) { // Only on initial sign-in
        await dbConnect();
        const dbUser = await User.findOne({ email: user.email });
      
        if (dbUser) {
          console.log("this is cheak for middleware",dbUser?.role,"email:",user?.email)
          token._id = dbUser._id.toString();
          token.username = dbUser.username;
          token.isVerified = dbUser.isVerified;
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
        session.user.role = token.role;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
};