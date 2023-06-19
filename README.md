# Todo App 

## Environment

* Expo React Native (mobile app)
* Express.js (backend)
* SQLite (database)
* Prisma (database ORM)

## How to run 

 1. **Backend** 
	1. go to backend folder `cd back-end`
	2.  install required packages `npm install`
	3. create the database `npx prisma migrate dev --name testing`
	4.  run the server `npm start`
    
 2. **Frontend**
	1. go to frontend folder `cd front-end`
	2. open .env file you will find the following key/value `API_IP=192.168.2.42:3000` change `192.168.2.42:3000` with your local machine IP which running the backend 
	3.  install required packages  ``npm install``
	4.  run the expo development server `npm start`
	
## Video 

