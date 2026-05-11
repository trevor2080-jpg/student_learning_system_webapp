# StudentHub — Student Learning System

A full-stack web application built with **NestJS**, **TypeORM**, **MySQL**, and **React** demonstrating all three ORM relationship types.

---

## Relationship Design & Justification

### 1. One-to-One: Student ↔ Profile
**Why?** A student has exactly one personal profile (bio, avatar), and a profile belongs to exactly one student. This maps perfectly to 1:1 — separating identity data from profile data is also a good normalization practice that allows profiles to be optional.

```
Student (1) ←──────→ (1) Profile
```

### 2. One-to-Many: Course → Assignments
**Why?** A course *owns* its assignments — each assignment is specific to one course (e.g., "CS101 Midterm"). A course can have many assignments, but each assignment belongs to exactly one course. This is the most natural 1:M relationship.

```
Course (1) ←──────→ (M) Assignments
```

### 3. Many-to-Many: Students ↔ Courses (Enrollments)
**Why?** In real education, a student enrolls in many courses, and each course has many students. This is the classic M:M scenario, represented by a join table (`enrollments`) with `studentId` and `courseId` foreign keys.

```
Student (M) ←──────→ (M) Course
               via
           enrollments table
```

---

## Tech Stack

| Layer     | Technology          |
|-----------|---------------------|
| Backend   | NestJS 10           |
| ORM       | TypeORM 0.3         |
| Database  | MySQL 8             |
| Frontend  | React 18            |
| HTTP      | Axios               |
| Validation| class-validator     |

---

## Project Structure

```
student-learning-system/
├── backend/
│   ├── src/
│   │   ├── students/        # Entity, DTO, Service, Controller, Module
│   │   ├── profiles/        # Entity, DTO, Service, Controller, Module
│   │   ├── courses/         # Entity, DTO, Service, Controller, Module
│   │   ├── assignments/     # Entity, DTO, Service, Controller, Module
│   │   ├── enrollments/     # Service, Controller, Module (M:M management)
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/           # StudentsPage, CoursesPage, AssignmentsPage, EnrollmentsPage
│   │   ├── components/      # Modal, ConfirmModal
│   │   ├── services/        # api.js (Axios wrappers)
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
└── docker-compose.yml
```

---

## API Endpoints

### Students
| Method | Endpoint          | Description       |
|--------|-------------------|-------------------|
| GET    | /api/students     | List all students |
| GET    | /api/students/:id | Get one student   |
| POST   | /api/students     | Create student    |
| PUT    | /api/students/:id | Update student    |
| DELETE | /api/students/:id | Delete student    |

### Profiles
| Method | Endpoint          | Description      |
|--------|-------------------|------------------|
| GET    | /api/profiles     | List all profiles|
| POST   | /api/profiles     | Create profile   |
| PUT    | /api/profiles/:id | Update profile   |
| DELETE | /api/profiles/:id | Delete profile   |

### Courses
| Method | Endpoint         | Description      |
|--------|------------------|------------------|
| GET    | /api/courses     | List all courses |
| POST   | /api/courses     | Create course    |
| PUT    | /api/courses/:id | Update course    |
| DELETE | /api/courses/:id | Delete course    |

### Assignments
| Method | Endpoint             | Description         |
|--------|----------------------|---------------------|
| GET    | /api/assignments     | List all assignments|
| POST   | /api/assignments     | Create assignment   |
| PUT    | /api/assignments/:id | Update assignment   |
| DELETE | /api/assignments/:id | Delete assignment   |

### Enrollments (Many-to-Many)
| Method | Endpoint                                    | Description     |
|--------|---------------------------------------------|-----------------|
| GET    | /api/enrollments                            | View all        |
| POST   | /api/enrollments/:studentId/courses/:courseId | Enroll         |
| DELETE | /api/enrollments/:studentId/courses/:courseId | Unenroll       |

---

## Getting Started

### Option A: Manual Setup

**Prerequisites:** Node.js 18+, MySQL 8

1. **Database**
```bash
mysql -u root -p
CREATE DATABASE student_learning_system;
```

2. **Backend**
```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
npm install
npm run start:dev
# Runs on http://localhost:3001
```

3. **Frontend**
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

### Option B: Docker Compose

```bash
docker-compose up --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:3001/api
# MySQL:    localhost:3306
```

---

## Features

- Full CRUD for Students, Profiles, Courses, Assignments
- Enrollment management (enroll/unenroll students in courses)
- Input validation on all forms
- Conflict detection (duplicate emails, course codes, double-enrollments)
- Delete confirmation dialogs
- Cascading deletes (course → assignments, student → profile)
- Clear visual indication of all relationship types in the UI

---

## Database Schema (Auto-synced via TypeORM)

```
students         profiles         courses          assignments      enrollments
-----------      -----------      -----------      -----------      -----------
id (PK)          id (PK)          id (PK)          id (PK)          studentId (FK)
name             bio              title            title            courseId (FK)
email            avatarUrl        code             dueDate
profileId (FK)   createdAt        description      description
createdAt        updatedAt        createdAt        courseId (FK)
updatedAt                         updatedAt        createdAt
                                                   updatedAt
```
