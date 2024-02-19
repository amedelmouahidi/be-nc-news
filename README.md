# Northcoders News API

## Setup Instructions

### Setting up the Project

1. **Clone the Repository:**
git clone <YOUR_CLONED_REPO_URL>

2. **Create a New Public GitHub Repository:**
- Create a new public repository on GitHub without initializing it with a readme, .gitignore, or license.
- Copy the repository URL.

3. **Push Code to the New Repository:**
- Navigate to the cloned local version of the project.
- Run the following commands:
  ```
  git remote set-url origin <YOUR_NEW_REPO_URL>
  git branch -M main
  git push -u origin main
  ```

### Creating the Databases

1. **Set Up Environment Variables:**
- You need to create two `.env` files: `.env.test` and `.env.development`.
- Add `PGDATABASE=` to each file, with the correct database name for that environment (refer to `/db/setup.sql` for the database names).
- Ensure that these `.env` files are listed in `.gitignore` to keep sensitive information secure.

2. **Install Dependencies:**
- Run `npm install` to install project dependencies.

### Connecting to Databases Locally

1. **Environment Variable Setup:**
- After cloning the repository, create `.env.test` and `.env.development` files in the root directory of the project.
- Add `PGDATABASE=` to each file, specifying the appropriate database names for the test and development environments.

2. **Run the Project:**
- With the environment variables set up, you can run the project locally and connect to the databases using the specified environment variables.





