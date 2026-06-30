# SkillSphere — Hyperlocal Freelance Ecosystem

SkillSphere is a full-stack MERN platform that connects clients with freelancers. Clients can post gigs, freelancers can submit proposals, and both sides can chat in real time, get notified instantly, and complete payments securely — all from one dashboard.

**Live Website:** https://skillsphere-beta-ochre.vercel.app

---

## Features

- **Multi-role authentication** — Client, Freelancer, and Admin roles with JWT-based login and protected routes
- **Gig marketplace** — post gigs, browse listings, search and filter by category and budget
- **Proposal & bidding system** — freelancers submit bids, clients accept or reject
- **Real-time chat** — instant messaging with typing indicators, powered by Socket.IO
- **Notifications** — live updates delivered in real time
- **Payments** — Razorpay integration for milestone-based payments
- **Reviews & ratings** — clients and freelancers rate each other after gigs
- **Admin dashboard** — manage users, suspend accounts, verify freelancers, and view platform stats
- **Profile management** — bio, hourly rate, availability, and account settings including password change and account deletion
- **Mobile responsive** — fully usable on phones and tablets

---

## Tech Stack

**Frontend**
- React.js
- Redux Toolkit
- React Router
- Axios
- Socket.IO Client

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- Socket.IO
- JWT for authentication
- bcryptjs for password hashing
- Razorpay for payments

**Deployment**
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

## License

This project was built as part of an academic submission.
