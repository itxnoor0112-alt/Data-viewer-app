# Dynamic Data Viewer App

## Project Overview

Dynamic Data Viewer App is a modern, responsive front-end web application developed using HTML5, CSS3, Tailwind CSS, JavaScript (ES6 Modules), and the FakeStore API. Built to fulfill asynchronous UI requirements, the project features dynamic API fetching via a custom HTTP wrapper with retry logic & caching (`sessionStorage`), debounced search, category filtering, client-side pagination, a product details view, a shopping cart with `localStorage` persistence, dark/light theme toggling, and event delegation.

## Live Demo

https://itxnoor0112-alt.github.io/Data-viewer-app/

## Technologies Used

* HTML5
* CSS3
* Tailwind CSS
* JavaScript (ES6 Modules)
* Web Storage APIs (`localStorage` & `sessionStorage`)
* FakeStore API
* Visual Studio Code
* Git
* GitHub

## Features

* Responsive design for Mobile, Tablet, and Desktop using Tailwind CSS
* Semantic HTML5 structure with dynamic DOM rendering
* Dynamic API Fetching with Skeleton Loading State and Error Boundary handling
* Custom HTTP Fetch Wrapper Module with automated 3-attempt retry logic and `sessionStorage` caching 
* Real-time Debounced Search functionality with 300ms delay 
* Dynamic Category Filtering generated directly from live API data 
* Price Sorting (Low to High / High to Low) & Client-side Pagination with 6 items per page 
* Optimized DOM Manipulation using Event Delegation on parent grid containers 
* Dynamic Product Details page using URL Query Parameters (`?id=X`)
* Shopping Cart System with `localStorage` persistence 
* Dark/Light Mode Toggle with state persistence in `localStorage`
* Clean, modular architecture utilizing ES6+ features (Arrow Functions, Destructuring, Spread Operators, Modules)

## Project Structure

Data-viewer-app/

│

├── index.html

├── product-details.html

├── cart.html

├── about.html

│

├── css/

│   └── style.css

│

└── js/
    
    ├── theme.js
    
    ├── main.js
    
    ├── details.js
    
    └── cart.js

## Installation and Setup

### Clone the Repository
git clone https://github.com/ibxnoor0112-alt/Data-viewer-app.git

### Open the Project Folder
cd Data-viewer-app

### Open the Project
Open `index.html` directly in your preferred web browser (or run via VS Code Live Server).