# ApexLuxe E-Commerce Platform

A premium e-commerce platform I built from scratch using React, Express, and modern web technologies. This project features a sophisticated UI, comprehensive product catalog, user authentication, shopping cart functionality, checkout process, and admin dashboard.

![ApexLuxe Screenshot](https://raw.githubusercontent.com/frankysoo/EcommerceHub/main/generated-icon.png)

> **Note**: This is a personal project I developed to showcase my full-stack development skills and my ability to create elegant, functional e-commerce solutions.

## Features

### Customer Features

- **User Authentication**: Secure login and registration system
- **Product Browsing**: Browse products by category with advanced filtering and sorting
- **Product Search**: Search functionality for finding specific products
- **Product Details**: Detailed product pages with specifications, pricing, and images
- **Shopping Cart**: Add/remove items, update quantities, view cart totals
- **Checkout Flow**: Streamlined checkout process with shipping and payment information
- **Order Management**: View order history and current order status
- **User Profile**: Manage personal information and preferences

### Admin Features

- **Dashboard**: Overview of store statistics, recent orders, and inventory status
- **Product Management**: Add, edit, and delete products
- **Order Management**: View and update order status
- **Inventory Tracking**: Monitor product stock levels

## Technical Stack

### Frontend
- **React**: UI library for building the user interface
- **TanStack Query**: Data fetching and state management
- **Wouter**: Lightweight routing solution
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Shadcn UI**: Component library built on Tailwind CSS
- **Zod**: Schema validation for forms and data
- **React Hook Form**: Form handling and validation

### Backend
- **Express**: Web server framework
- **In-Memory Storage**: Simple data storage for local development (no database required)
- **Drizzle ORM**: Type-safe database toolkit (schema only)
- **Passport.js**: Authentication middleware

## Project Structure

```
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # React context providers
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions and shared code
│   │   └── pages/       # Page components and routes
├── server/              # Backend Express application
│   ├── auth.ts          # Authentication middleware
│   ├── db.ts            # Database connection
│   ├── routes.ts        # API endpoints
│   └── storage.ts       # Data storage layer
└── shared/              # Shared code between frontend and backend
    └── schema.ts        # Database schema and types
```

## Getting Started

### Prerequisites

- Node.js (v16+)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/frankysoo/EcommerceHub.git
   cd EcommerceHub
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory
   ```
   # Using in-memory database for local development
   DATABASE_URL=memory://localhost/ecommerce
   SESSION_SECRET=your_secret_key

   # Set to true to enable detailed logging
   DEBUG_MODE=true
   ```

   The project includes a `dev-config.json` file with my personal development settings.

4. Start the development server
   ```
   npm run dev
   ```

5. Access the application at http://localhost:5000

### Development Journey

I built this project over several months, iterating through multiple versions and improvements. The commit history reflects my development process, from initial setup to final polishing. I focused on creating a clean, maintainable codebase with proper separation of concerns and modern best practices.

## Demo Accounts

I've set up the following accounts for testing purposes:

- **Admin Account**:
  - Username: admin
  - Password: admin123
  - Full access to admin dashboard and management features

- **Test User Account**:
  - You can register your own account through the authentication page
  - Regular user permissions for shopping and order management

## Admin Dashboard

One of the key features I implemented is a comprehensive admin dashboard that provides full control over the e-commerce platform.

### Accessing the Admin Panel

1. Log in with the admin credentials (username: admin, password: admin123)
2. Navigate to `/admin/dashboard` or click the Admin link in the navigation bar
3. The admin dashboard provides:
   - Real-time store statistics and analytics
   - Complete product management (add, edit, delete products)
   - Order processing and status updates
   - Inventory tracking with low stock alerts
   - User management capabilities

I designed the admin interface to be intuitive and efficient, allowing store managers to quickly perform common tasks without unnecessary complexity.

## Product Categories

The platform features products across multiple premium categories:

1. **Electronics**: High-end gadgets and devices
2. **Fashion**: Luxury apparel and accessories
3. **Home & Decor**: Elegant home furnishings
4. **Books**: Curated collection of literature
5. **Jewelry**: Fine jewelry and timepieces
6. **Beauty**: Premium skincare and cosmetics
7. **Gourmet**: Artisanal foods and beverages
8. **Travel**: Luxury travel accessories

## UI Design Philosophy

The UI follows a premium, luxury-focused design approach with:

- Deep blue and amber gold accent color scheme
- Sophisticated animations and transitions
- Premium card designs with elegant hover effects
- Gradient overlays for visual depth
- Consistent branding elements

## Responsive Design

The application is fully responsive, providing optimal user experience across devices:
- Desktop
- Tablet
- Mobile

## Future Roadmap

I'm actively working on enhancing this project with the following features:

- **Customer Reviews System**: Allow users to rate and review products
- **Wishlist Functionality**: Let users save products for later
- **Product Recommendations**: AI-powered related product suggestions
- **Enhanced Analytics**: Advanced reporting for the admin dashboard
- **Email Notifications**: Automated emails for order updates and marketing
- **Multi-language Support**: Internationalization for global markets
- **Mobile App Version**: Native mobile experience using React Native

## Development Notes

### Local Database

I chose to implement an in-memory database for this project to make it easy to run locally without any external dependencies. This means:

- All data is stored in memory and will reset when the server restarts
- No need to set up a separate database server
- Perfect for demonstration and testing purposes

In a production environment, I would connect this to a PostgreSQL database using the existing Drizzle ORM setup.

### Troubleshooting Tips

If you encounter any issues while running the project:

1. For admin access problems, ensure you're using the correct credentials (admin/admin123)
2. Check browser console and server logs for detailed error information
3. Clear browser cookies if you experience authentication issues
4. Restart the development server with `npm run dev` if needed

## Contact

Feel free to reach out if you have any questions about this project or want to discuss potential collaborations.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

© 2023 Franky Soo. All rights reserved.