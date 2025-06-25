import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
    try {
        const data = await req.json();

        // Same validation and email logic as above
        const {
            firstName,
            lastName,
            email,
            phone,
            inquiryType,
            referralSource,
            message,
            termsAccepted,
        } = data;

        if (!firstName || !lastName || !email || !phone || !inquiryType || !referralSource || !message) {
            return NextResponse.json(
                { message: 'All fields are required', isSuccess: false },
                { status: 400 }
            );
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return NextResponse.json(
                { message: 'Invalid email format', isSuccess: false },
                { status: 400 }
            );
        }

        if (!/^\+?\d{10,15}$/.test(phone.replace(/\D/g, ''))) {
            return NextResponse.json(
                { message: 'Invalid phone number', isSuccess: false },
                { status: 400 }
            );
        }

        if (!['General', 'Support', 'Partnership'].includes(inquiryType)) {
            return NextResponse.json(
                { message: 'Invalid inquiry type', isSuccess: false },
                { status: 400 }
            );
        }

        if (!['Google', 'Social Media', 'Referral'].includes(referralSource)) {
            return NextResponse.json(
                { message: 'Invalid referral source', isSuccess: false },
                { status: 400 }
            );
        }

        if (!termsAccepted) {
            return NextResponse.json(
                { message: 'You must agree to the terms and privacy policy', isSuccess: false },
                { status: 400 }
            );
        }

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'huma9016@gmail.com',
                pass: 'rbfc gkcb khht vycl',
            },
        });

        const mailOptions = {
            from: 'huma9016@gmail.com',
            to: 'huma9016@gmail.com',
            subject: `Estatein - ${inquiryType} Inquiry from ${firstName} ${lastName}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>First Name:</strong> ${firstName}</p>
                <p><strong>Last Name:</strong> ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
                <p><strong>Referral Source:</strong> ${referralSource}</p>
                <p><strong>Message:</strong> ${message}</p>
                <p><strong>Terms Accepted:</strong> ${termsAccepted ? 'Yes' : 'No'}</p>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);

        return NextResponse.json(
            { message: 'Contact form submitted successfully', isSuccess: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { message: 'Server error, please try again later', error: error.message, isSuccess: false },
            { status: 500 }
        );
    }
}