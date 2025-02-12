## This repository contains the frontend for the Developer Test project.

## Prerequisites

- **Node.js:** Version 14 or higher  
- **npm**  
- **The developer-test backend:**  https://github.com/GilSEO/BB-Developer-Test


## Installation and Setup

1. **Clone the Repository:**
   ```bash
   git clone <https://github.com/GilSEO/BB-Developer-Test-Front-End>
   cd developer-test-front-end/my-vue-app
   ```

2. **Install npm Dependencies:**
   ```bash
   npm install
   ```

## Running the Application
Start the development server:
  ```bash
  npm run dev
  ```
The Vue app should now be accessible at http://127.0.0.1:5173

## Running Tests
**End-to-End Tests with Cypress**
1. Install Cypress (if not already installed):
  ```bash
  npm install cypress --save-dev
```
2. **Run Cypress:**
Open the Cypress Test Runner:
  ```bash
  npx cypress open
```
Then select your test file to run interactively. Or run headless:
  ```bash
  npx cypress run
  ```
