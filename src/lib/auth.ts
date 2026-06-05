import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

import nodemailer from "nodemailer";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
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
		`${process.env.API_URL}`,
	],
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true
    },
     emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verifyEmailUrl = `${process.env.APP_URL}/verify-email?token=${token}`
        const info = await transporter.sendMail({
          from: '"prisma" <prismablog@gmail.com>',
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
          <a href="${url}">${url}</a>
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
        throw new Error(error.Message)
      }
    },
  },

    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false
            },
            phone: {
                type: "string",
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