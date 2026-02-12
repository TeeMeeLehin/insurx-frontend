Project Name

INSURX – Web Application (SaaS)

1. General Instructions (Very Important)

⚠️ ALL content, UI labels, messages, comments, and code variables MUST be written in ENGLISH

No French text anywhere in the application

The application must be production-ready

Clean code, scalable architecture, and clear separation of concerns are required

2. Project Overview

INSURX is a subscription-based SaaS web application.

The application includes:

A Signup page

A Login page

A Stripe-based payment flow

A Dashboard that visually and functionally resembles ChatGPT’s interface

User authentication and session management

After successful payment, users gain access to the dashboard.

3. User Flow (High Level)

User visits the INSURX website

User signs up (name, email, subscription plan)

User completes payment via Stripe

If payment is successful:

User account is activated

User is redirected to the dashboard

User can log in/out anytime

Only authenticated & paid users can access the dashboard

4. Pages & Functional Requirements
   4.1 Signup Page

Purpose
Allow new users to create an account and subscribe to INSURX.

Fields

Full Name (text input)

Email Address (email input)

Subscription Plan (radio buttons or select):

Monthly Plan – $500 / month

Annual Plan – $5000 / year

Actions

“Continue to Payment” button

Validations

All fields required

Email format validation

Clear error messages (in English)

4.2 Payment Flow (Stripe)

Requirements

Use Stripe API

Use Stripe Checkout or Payment Intents (developer’s choice, but must be secure)

Plans:

Monthly: $500

Annual: $5000

Flow

User is redirected to Stripe Checkout

User completes payment

Stripe returns payment status via webhook or redirect

If payment is successful:

User subscription is activated

User is redirected to the Dashboard

If payment fails:

User sees an error message

User can retry payment

Important

No hardcoded API keys

Use environment variables

Handle success and failure cases cleanly

4.3 Login Page

Purpose
Allow existing users to log in.

Fields

Email

Password

Actions

Login button

Logout functionality (from dashboard)

Rules

Only users with an active subscription can log in

Show clear error messages for:

Invalid credentials

Inactive subscription

5. Dashboard (Core Application)
   5.1 General Description

The dashboard must be visually and structurally similar to ChatGPT.

It is NOT a classic admin dashboard.

Think:

Conversational interface

Clean UI

Focus on messaging and history

5.2 Dashboard Layout
Navbar (Top)

INSURX logo or name

User dropdown (right side):

User email or name

Logout button

Sidebar (Left)

Conversation / session history

Each item represents a past interaction

Ability to:

Select a conversation

Start a new conversation

Main Content Area

Chat-like interface:

Message input field at the bottom

Messages displayed as chat bubbles

Send button

Loading / typing indicators (optional but recommended)

5.3 Functional Behavior

Users can type messages in the input field

Messages appear in the conversation thread

Conversations are saved and shown in the sidebar

Selecting a conversation reloads its message history

New conversation clears the chat window

Note: The backend logic of AI responses can be mocked if not implemented yet.

6. Authentication & Access Control

Only authenticated users can access the dashboard

Only users with successful Stripe payment have access

Unauthorized users must be redirected to the login page

Session handling must be secure

7. Technical Requirements

All UI text must be in English

Clean, modular code

Secure authentication flow

Stripe integration must follow best practices

Responsive design (desktop-first is acceptable)

Clear error handling and user feedback

8. Deliverables

The developer must deliver:

Signup page

Login page

Stripe payment integration

Protected dashboard (ChatGPT-like UI)

Logout functionality

Clean, documented code

Setup instructions (README)

9. Non-Negotiable Constraints

❌ No French text anywhere

❌ No hardcoded secrets

❌ No broken flows

✅ Stripe payment must work end-to-end

✅ Dashboard must clearly resemble ChatGPT’s interface

✅ Access control must be enforced

10. Success Criteria

The task is considered complete when:

A new user can sign up

Choose a subscription plan

Pay successfully via Stripe

Access the dashboard

Use a ChatGPT-like interface

Log out and log back in without issues
