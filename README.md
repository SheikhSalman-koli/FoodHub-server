# FoodHub 🍱
**"Discover & Order Delicious Meals"**

---

## Project Overview

FoodHub is a full-stack web application for meal ordering. Customers can browse menus from various food providers, place orders, and track delivery status. Providers can manage their menus and fulfill orders. Admins oversee the platform and manage all users.

---

## Roles & Permissions

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **Customer** | Users who order meals | Browse menus, place orders, track status, leave reviews |
| **Provider** | Food vendors/restaurants | Manage menu, view orders, update order status |
| **Admin** | Platform moderators | Manage all users, oversee orders, moderate content |


---

## Features

### Public Features
- Browse all available meals and providers
- Filter meals by cuisine, dietary preferences, and price
- View provider profiles with menus

### Customer Features
- Register and login as customer
- Add meals to cart
- Place orders with delivery address (Cash on Delivery)
- Track order status
- Leave reviews after ordering
- Manage profile

### Provider Features
- Register and login as provider
- Add, edit, and remove menu items
- View incoming orders
- Update order status

### Admin Features
- View all users (customers and providers)
- Manage user status (suspend/activate)
- View all orders
- Manage categories


---

## Tech Stack 🛠️ 


| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API |
| Postgres + Prisma | Database |