# sMERNa CMS Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Backend Architecture](#backend-architecture)
   - [Database](#database)
   - [API Routes](#api-routes)
   - [Authentication](#authentication)
4. [Frontend Architecture](#frontend-architecture)
   - [Pages](#pages)
   - [Components](#components)
5. [Data Models](#data-models)
6. [Taxonomy System](#taxonomy-system)
7. [Content Management](#content-management)
8. [Authentication and Authorization](#authentication-and-authorization)
9. [Styling and UI](#styling-and-ui)
10. [Development and Deployment](#development-and-deployment)

## 1. Introduction

sMERNa CMS is a robust and scalable Content Management System built using the MERN (MongoDB, Express.js, React, Node.js) stack, with Next.js as the React framework. It provides a flexible platform for creating, managing, and organizing content with a powerful taxonomy system.

## 2. Architecture Overview

The sMERNa CMS follows a modern, serverless architecture leveraging Next.js API routes for backend functionality and React components for the frontend. The application uses MongoDB as its database and implements server-side rendering (SSR) for improved performance and SEO.

## 3. Backend Architecture

### Database

- **MongoDB**: Used as the primary database for storing all content and user data.
- **Mongoose**: ODM (Object Data Modeling) library used for schema definition and database interactions.

### API Routes

Next.js API routes are used to create a serverless API. The main API routes include:

- `/api/auth/*`: Handles authentication (powered by NextAuth.js)
- `/api/content`: Manages content CRUD operations
- `/api/taxonomy/*`: Manages taxonomy-related operations (content types, categories, tags)

### Authentication

- **NextAuth.js**: Implements authentication, supporting credentials provider.
- JSON Web Tokens (JWT) are used for maintaining user sessions.

## 4. Frontend Architecture

### Pages

The application uses Next.js pages for routing. Key pages include:

- `/`: Homepage
- `/login`: User login page
- `/register`: User registration page
- `/dashboard`: User dashboard
- `/content/new`: Create new content
- `/taxonomy`: Manage taxonomy
- `/dummy-content`: Display dummy content (for demonstration)

### Components

The project uses a component-based architecture with React. Key components include:

- UI components (buttons, forms, cards, etc.)
- Layout components
- Authentication components
- Content management components
- Taxonomy management components

## 5. Data Models

The main data models in the application are:

- **User**: Represents system users
- **Content**: Represents content items
- **ContentType**: Defines types of content
- **Category**: Represents content categories
- **Tag**: Represents content tags

## 6. Taxonomy System

The taxonomy system consists of three main entities:

1. **Content Types**: Define the structure of content (e.g., Blog Post, Product Page)
2. **Categories**: Provide a hierarchical structure for organizing content
3. **Tags**: Offer a flexible way to label and group content

The taxonomy system allows for:
- Creating, updating, and deleting taxonomy entities
- Assigning multiple categories and tags to content
- Hierarchical categorization (categories can have parent categories)

## 7. Content Management

The content management system allows users to:

- Create new content items
- Assign content types, categories, and tags to content
- Edit existing content
- Delete content

Content is associated with its author and can have different statuses (e.g., draft, published).

## 8. Authentication and Authorization

- User registration and login functionality
- Role-based access control (user and admin roles)
- Protected routes and API endpoints

## 9. Styling and UI

- **Tailwind CSS**: Used for utility-first styling
- **shadcn/ui**: Provides accessible and customizable UI components
- Dark mode support

## 10. Development and Deployment

- **Development**: `npm run dev` starts the development server
- **Building**: `npm run build` creates a production build
- **Deployment**: The application is configured for easy deployment to platforms like Vercel or Netlify

---

This documentation provides an overview of the sMERNa CMS architecture. As the project evolves, remember to update this documentation to reflect any changes or additions to the system.