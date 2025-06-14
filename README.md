# School Management System API

## Overview
This is a robust, secure, and modular API for managing all aspects of a school, including users, students, academics, attendance, notifications, events, and reports. Built with [NestJS](https://nestjs.com/) and [Prisma](https://www.prisma.io/), it supports role-based access control and is designed for scalability and extensibility.

## Features
- **Role-based access control**: Super Admin, Admin, Teacher, Student, Guardian
- **User management**: Registration, login, password reset, profile update
- **School and class management**
- **Student and guardian management**
- **Admin management**
- **Academic management**: Subjects, courses, exams, grades
- **Attendance tracking**
- **Notification system**
- **Event management**
- **Report generation and templates**
- **Bulk import/export**: CSV/JSON for students and academics
- **Comprehensive API documentation via Swagger**

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm
- [Prisma CLI](https://www.prisma.io/docs/reference/api-reference/command-reference)

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd nestjs-school-management
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the database:
   - Edit `.env` if needed (default uses SQLite for development)
   - Run migrations:
     ```bash
     npx prisma migrate dev --name init
     ```
4. Start the development server:
   ```bash
   npm run start:dev
   ```
5. Access the API documentation:
   - Open [http://localhost:3000/api](http://localhost:3000/api) for Swagger UI

## Authentication & Roles
- All endpoints are protected by JWT authentication.
- Roles: `SUPER_ADMIN`, `ADMIN`, `TEACHER`, `STUDENT`, `GUARDIAN`
- Only SUPER_ADMIN can register new admins, teachers, or other super admins.
- Admins can create students and manage their school.

## Main Endpoints
- **/auth**: Login, register (super admin only), profile update, password reset
- **/admin**: CRUD for admins (super admin only)
- **/schools**: CRUD for schools
- **/student**: CRUD for students, profiles, guardians, bulk import/export
- **/academic**: CRUD for subjects, courses, exams, grades, bulk import/export
- **/attendance**: CRUD for attendance records
- **/notifications**: CRUD, mark as read, filter by type
- **/events**: CRUD for events, manage participants, update status
- **/reports**: CRUD for report templates and reports, generate reports

> For a full list of endpoints and their required roles, see the Swagger UI.

## Bulk Import/Export
- Import/export students and academic data using CSV or JSON via `/student/import`, `/student/export`, etc.
- See Swagger UI for details on file formats and usage.

## Password Reset & Profile Update
- Users can request a password reset and set a new password using a secure token.
- All users can update their own profile information.

## Visual Architecture
- See `school-management-architecture.png` for a diagram of the system's modules and role interactions.

## Contribution
1. Fork the repo and create your branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -am 'Add some feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Submit a pull request

## License
This project is licensed under the MIT License.

## Support
For help, training, or custom features, please contact the maintainer.

## Deploying to Render

1. **Provision a PostgreSQL database** on Render and copy the connection string.
2. **Set the `DATABASE_URL` environment variable** in the Render dashboard to your PostgreSQL connection string.
3. **Add a `render.yaml` file** to your project root with the following content:

```yaml
services:
  - type: web
    name: nestjs-school-management
    env: node
    plan: free
    buildCommand: npm install && npx prisma generate && npx prisma migrate deploy && npm run build
    startCommand: npm run start:prod
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: your-db-name
          property: connectionString
```

4. **Push your code to GitHub** and connect the repo to Render.
5. **Deploy the service**. Render will handle build, migration, and startup.

> The app will listen on the port provided by Render (`process.env.PORT`).
