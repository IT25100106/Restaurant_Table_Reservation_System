# Restaurant Table Reservation System

A full-stack web application for managing restaurant table reservations, built with a modern TypeScript/Next.js frontend and a robust Java Spring Boot backend.

## Project Structure

```
Restaurant-Table-Reservation-System/
├── frontend/                    # Next.js TypeScript frontend
│   ├── app/                    # Next.js app directory
│   │   ├── admin/              # Admin dashboard pages
│   │   ├── login/              # Login page
│   │   ├── register/           # Registration page
│   │   ├── menu/               # Menu page
│   │   ├── reservations/       # Reservations page
│   │   ├── orders/             # Orders page
│   │   ├── reviews/            # Reviews page
│   │   ├── profile/            # User profile page
│   │   └── layout.tsx          # Root layout
│   ├── components/             # Reusable React components
│   │   ├── ui/                 # UI component library
│   │   ├── navigation.tsx      # Navigation component
│   │   └── theme-provider.tsx  # Theme provider
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions and APIs
│   ├── public/                 # Static assets
│   └── package.json            # Frontend dependencies
│
└── ResturantBackend_Fixed/     # Java Spring Boot backend
    ├── src/                    # Source code
    ├── data/                   # Data files
    │   ├── users.txt
    │   ├── reservations.txt
    │   ├── reviews.txt
    │   ├── tables.txt
    │   ├── menu.txt
    │   └── orders.txt
    ├── pom.xml                 # Maven configuration
    └── mvnw                    # Maven wrapper
```

## Features

- **User Management**: Registration, login, and profile management
- **Table Reservations**: Browse available tables and make reservations
- **Menu Management**: View restaurant menu items
- **Order System**: Place and track orders
- **Reviews**: Leave and view restaurant reviews
- **Admin Dashboard**: Manage reservations, tables, menus, orders, reviews, and users
- **Responsive UI**: Mobile-friendly interface with Tailwind CSS

## Tech Stack

### Frontend
- **Framework**: Next.js 14+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library (shadcn/ui inspired)
- **Package Manager**: pnpm

### Backend
- **Framework**: Spring Boot
- **Language**: Java
- **Build Tool**: Maven
- **Data Storage**: File-based (txt files)

## Prerequisites

### Frontend
- Node.js 18+ 
- pnpm or npm

### Backend
- Java 11+
- Maven 3.6+

## Getting Started

### Frontend Setup

```bash
cd frontend
npm install
npm dev
```

The frontend will run on `http://localhost:3000`

### Backend Setup

```bash
cd ResturantBackend_Fixed
mvn clean install
mvn spring-boot:run
```

The backend API will be available at `http://localhost:8080`

## Key Files

### Frontend
- `lib/api.ts` - API client for backend communication
- `lib/auth-context.tsx` - Authentication context
- `lib/storage.ts` - Local storage utilities
- `components/navigation.tsx` - Main navigation component

### Backend
- `pom.xml` - Project dependencies and build configuration
- `src/main/resources/application.properties` - Spring Boot configuration

## Contributors

- @IT25100106
- @IT25102417
- @IT25100134
- @IT26103664

## License

MIT License - Copyright (c) 2026

## Repository

[GitHub Repository](https://github.com/IT25100106/Restaurant_Table_Reservation_System)



## Developed by Group WD021 | 1st Year, 2nd Semester | Undergraduate Students at SLIIT
