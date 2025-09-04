# StudySync - Student Management System

A modern, comprehensive student management system built for educational institutions to efficiently manage students, courses, and enrollments.

## Features

- **Student Management**: Add, edit, and manage student records with detailed profiles
- **Course Management**: Create and organize courses with comprehensive information
- **Enrollment System**: Handle student course enrollments and track academic progress
- **Dashboard Analytics**: Visual insights into student and course statistics
- **User Authentication**: Secure login system with protected routes
- **Responsive Design**: Modern UI that works seamlessly across all devices

## Technology Stack

This project is built with modern web technologies:

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS for responsive design
- **State Management**: TanStack Query for server state management
- **Routing**: React Router DOM for client-side navigation
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd studysync-view-main
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components
│   └── ui/             # Base UI components (shadcn/ui)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Students.tsx    # Student management
│   ├── Courses.tsx     # Course management
│   ├── Enrollments.tsx # Enrollment management
│   └── ...
└── main.tsx           # Application entry point
```

## Usage

### Authentication
- Access the login page to authenticate
- Protected routes require valid authentication

### Dashboard
- View overview statistics and charts
- Quick access to all major features

### Student Management
- Add new students with detailed information
- Edit existing student records
- View student profiles and enrollment history

### Course Management
- Create and manage course offerings
- Set course details, schedules, and capacity
- Track course enrollment statistics

### Enrollment System
- Enroll students in available courses
- Manage enrollment status and tracking
- View enrollment reports and analytics

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
