import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

import nodemailer from "nodemailer";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [
    `${process.env.APP_URL}`,
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,

    passwordReset: {
      enabled: true,
    },

    sendResetPassword: async ({ user, url, token }, request) => {
      const secureResetUrl = `http://localhost:3000/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;
      console.log(token);
      await transporter.sendMail({
        from: '"Prisma Blog" <prismablog@gmail.com>',
        to: user.email,
        subject: "Reset your password",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2>পাসওয়ার্ড রিসেট করুন</h2>
          <p>হ্যালো ${user.name || "ইউজার"},</p>
          <p>আপনার পাসওয়ার্ডটি রিসেট করার জন্য নিচের বাটনে ক্লিক করুন:</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="${secureResetUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p style="font-size: 12px; color: #6b7280;">লিংকটি কাজ না করলে এটি ব্রাউজারে পেস্ট করুন: <br/> 
          <a href="${secureResetUrl}">${secureResetUrl}</a></p>
        </div>
    `,
      });
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {

        const verifyEmailUrl = `${process.env.APP_URL}/verify-email?token=${token}&callbackUrl=/`;
        // const verifyEmailUrl = `http://localhost:3000/verify-email?token=${token}&callbackUrl=/`;

        await transporter.sendMail({
          from: '"Prisma Blog" <prismablog@gmail.com>',
          to: user?.email,
          subject: "Please Verify your email",
          html: `<div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;background:#ffffff;padding:24px;border-radius:8px;border:1px solid #e5e7eb;">
        <h2 style="color:#111827;">Verify your email</h2>

        <p>Hello ${user?.name || "there"},</p>

        <p>
          Thanks for creating an account with <strong>Prisma Blog</strong>.
          Please confirm your email address by clicking the button below:
        </p>

        <div style="text-align:center;margin:32px 0;">
          <a 
            href="${verifyEmailUrl}"
            style="
              background:#2563eb;
              color:#ffffff;
              padding:12px 24px;
              text-decoration:none;
              border-radius:6px;
              font-weight:600;
              display:inline-block;
            "
          >
            Verify Email
          </a>
        </div>

        <p>
          If the button doesn’t work, copy and paste this link into your browser:
        </p>

        <p style="word-break:break-all;">
          <a href="${verifyEmailUrl}">${verifyEmailUrl}</a> 
        </p>

        <hr style="margin:24px 0;" />

        <p style="font-size:12px;color:#6b7280;">
          If you didn’t create this account, you can safely ignore this email.
        </p>

        <p style="font-size:12px;color:#6b7280;">
          © ${new Date().getFullYear()} Prisma Blog
        </p>
      </div>
    `
        });

      } catch (error: any) {
        console.error("Email sending failed:", error);
        throw new Error(error.message);
      }
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false,
        input: true
      },
      phone: {
        type: "string",
        required: false
      },
      isDeleted: {
        type: "boolean",
        defaultValue: false,
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVATE",
        required: false
      },
      deliveryAddress: {
        type: "string",
        defaultValue: "",
        required: false
      }
    }
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  }

});


