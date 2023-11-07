# Prognosticate or Perish - Casual NFL Predicition and Betting Web App

A casual sports prediction game for friends and family.

Welcome to Prognosticate or Perish (henceforth referred to as Prognosticate), your go-to destination for casual sports prediction and wagering! Prognosticate is an open-source project that you can use yourself if you'd like to set up a community, or compete against the players in the main app. You can check that out at:

[https://tumult.onrender.com/](https://prognosticate-or-perish.onrender.com/)

Features:
User Predictions: Users can engage with several NFL prediction games including Eliminator, Pick 'Em, and Spread Eliminator.
User Wagering: Users can make wagers on over/under and spread lines in any NFL game each week.
Secure User Accounts/Features: Hashed passwords and user profile images.
User Comment Stream: Chat with your fellow competitors about predictions and their results in the Chatter stream.

## Tech Stack

#### Languages and Frameworks

![image](https://github.com/BoJamesH/prognosticate-or-perish/assets/128858490/191435e3-6e62-440a-8799-32b53282de36)
![image](https://github.com/BoJamesH/prognosticate-or-perish/assets/128858490/fe17a36b-d764-4d7c-80b7-54cef86bbedf)
![image](https://github.com/BoJamesH/prognosticate-or-perish/assets/128858490/4f491229-604b-4966-babc-8119743ca111)
![image](https://github.com/BoJamesH/prognosticate-or-perish/assets/128858490/9ff96d39-6b3d-4eca-9193-401d99e84ada)
![image](https://github.com/BoJamesH/prognosticate-or-perish/assets/128858490/052031ce-3694-4740-9405-bb656c749f75)
![image](https://github.com/BoJamesH/prognosticate-or-perish/assets/128858490/4333eb9c-29a2-4802-90f7-bf56296d2a8a)
![image](https://github.com/BoJamesH/prognosticate-or-perish/assets/128858490/0036cc22-a23d-4735-b36b-1878fef7ab57)

#### Backend

![image](https://github.com/BoJamesH/prognosticate-or-perish/assets/128858490/2ecfe66e-5449-4fc0-a5bd-2da6f8924775)
![image](https://github.com/BoJamesH/prognosticate-or-perish/assets/128858490/009a61bf-dc10-441e-a6d4-66f0ac5f5d57)

#### Hosting

![image](https://github.com/BoJamesH/prognosticate-or-perish/assets/128858490/e6303314-ae76-4195-bedf-fa258fcec700)

## Previews

#### Splash Page/Login:

![prog-splash-gif](https://github.com/BoJamesH/prognosticate-or-perish/assets/128858490/0762b5a1-8216-457e-9d65-6a57f1746a09)

#### Navigating Different Games

![prog-games-gif](https://github.com/BoJamesH/prognosticate-or-perish/assets/128858490/9a4019b4-4a95-4354-8015-3094b71722cd)

#### Leaderboards/User Profile/Chatter

![prog-extras-gif](https://github.com/BoJamesH/prognosticate-or-perish/assets/128858490/2c78435e-5743-4a7f-a1a8-b146942d475e)

#### SQL Backend Details

![image](https://github.com/BoJamesH/prognosticate-or-perish/assets/128858490/8c7a8741-0880-4c3b-ab5e-318bbfdd2224)

## Getting Started

1. Clone this repository (only this branch).
2. Install dependencies:
pipenv install -r requirements.txt

3. Create a `.env` file based on the example with proper settings for your development environment. Make sure to set the following variables:
   - `SECRET_KEY` (click "Generate" to generate a secure secret for production)
   - `FLASK_ENV` set to `production`
   - `FLASK_APP` set to `app`
   - `SCHEMA` (your unique schema name, in snake_case)
   - `REACT_APP_BASE_URL` (use Render.com URL, located at the top of the page, similar to `https://this-application-name.onrender.com`)
4. Ensure the SQLite3 database connection URL is correctly set in the `.env` file.
5. Organize all tables inside the `flask_schema` schema (defined by the `SCHEMA` environment variable). Replace the value for `SCHEMA` with your chosen name following the snake_case convention.

#### Local Development:

6. Get into your pipenv shell, migrate your database, seed your database, and run your Flask app:
pipenv shell
flask db upgrade
flask seed all
flask run

7. To run the React App in development, follow the README inside the `react-app` directory.

## Deployment on Render.com:

### Part A: Configure the Start and Build Commands

8. From the Render.com dashboard, click on the "New +" button in the navigation bar, then select "Web Service" to create the application for deployment.
9. Fill out the form to configure the build and start commands, and add environment variables:
   - Application Name: Set a unique name for your application.
   - Root Directory: Leave it blank (Render will run commands from the root directory).
   - Environment: Set to "Python 3".
   - Region: Choose the location closest to you.
   - Branch: Set to "main".
10. Add the Build command in the Build field (all in one line):
npm install --prefix react-app && npm run build --prefix react-app && pip install -r requirements.txt && pip install psycopg2 && flask db upgrade && flask seed all

### Part B: Add Environment Variables

12. Click on the "Advanced" button at the bottom of the form to configure environment variables for production.
13. Add the following keys and values in the Render GUI form:
   - `SECRET_KEY` (click "Generate" to generate a secure secret for production)
   - `FLASK_ENV` set to `production`
   - `FLASK_APP` set to `app`
   - `SCHEMA` (your unique schema name, in snake_case)
   - `REACT_APP_BASE_URL` (use Render.com URL, similar to `https://this-application-name.onrender.com`)
14. In another tab, navigate to your Render.com dashboard and click on your Postgres database instance.
15. Add the following key and value:
   - `DATABASE_URL` (copy value from Internal Database URL field)
16. Add any other keys and values that may be present in your local `.env` file, as needed.
17. Choose "Yes" for the Auto-Deploy field to automatically redeploy your application every time you push to the `main` branch.
18. Click "Create Web Service" to deploy your project on Render.com. The deployment process will likely take about 10-15 minutes.
19. Monitor the logs to see your build and start commands being executed and check for any errors in the build process.
20. Once deployment is complete, open your deployed site and verify that 

## Further Information

#### Contributing

We welcome contributions from the open-source community. If you have ideas, bug fixes, or new features to add, please feel free to open issues or submit pull requests.

#### License

This project is licensed under the MIT License. See the LICENSE file for details.

#### Contact

If you have any questions or need assistance, you can reach out to the project maintainer at [RobertJamesH@gmail.com].

Enjoy predicting NFL games with Prognosticate or Perish!

