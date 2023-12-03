# Environment Setup (Using MongoDB Compass)
This guide will setup the project on your local computer, not the Linux Lab machine. It also assumes you are running Windows.
1. Before you start, make sure these programs are installed on your computer:
    * [MongoDB Community Server](https://www.mongodb.com/try/download/community): In the installer, **uncheck** "install MongoDB as a service" and **check** "install MongoDB Compass." MongoDB Compass is the GUI interface for MongoDB.
    * [Git](https://git-scm.com/downloads): Other than selecting Visual Studio Code as the default code editor for .git files, I left all installer settings as default.
    * Get the [Enron email dataset we will be using](https://www.kaggle.com/code/gliang6/datacleansingjob/output) and extract it so that you have a .csv file.
    * [MongoDB Compass](https://www.mongodb.com/try/download/compass): A GUI interface for interacting with MongoDB databases.
2. Add MongoDB to your PATH environment variable. This allows you to start MongoDB (not MongoDB Compass) from the terminal.
    1. Go to windows settings -> system -> about -> advanced system settings. 
    2. Click "environment variables..."
    3. In the top box, select "Path" and click "Edit..."
    4. Click "New" and enter the address C:\Program Files\MongoDB\Server\7.0\bin
    5. Hit "OK" then "OK" then "OK" again to save changes.
3. Assuming you already have this repository cloned to your computer, open the repository folder in your terminal, then navigate to ./data/db.
4. To start the MongoDB database locally, run this command in your terminal without the quotes: "mongod --dbpath ." A bunch of text lines should fly across the window and the program **should not terminate on its own.**
    * If you open ./data/db in windows explorer now, you should see a bunch of files that MongoDB as created. With how the repository is currently set up, these files and any others stored in this folder are **not included in new commits.**
5. Open MongoDB Compass. You should see a "New Connection" box automatically filled with "mongodb://localhost:27017." Leave this as-is and click "connect."
6. You should now see a new interface with three databases listed on the side: admin, config, and local. Hover over "local" and click the + icon. Create a collection named "cleaned-data."
7. Click "ADD DATA" -> "Import JSON or CSV file," then find the .csv file containing the Enron emails.
8. After a few seconds you should be prompted with a preview of how the data will be imported. Leave this alone and start the import process. It will take a moment, but when it's done there should be 517401 entries.
9. To close the MongoDB server when you are finished working, first close MongoDB Compass, then Ctrl+C in the terminal window to close the server.

# Executing Queries
At the root of the GitHub repository are text files containing the solutions to prompts 1, 2, and 3 per our project proposal. Each one contains the MongoDB queries used to filter down the dataset for that prompt.

## In MongoDB Compass
As of now, the way we've been able to count the results for each query is:
1. Run the query using MongoDB Atlas.
2. Export the query results as a JSON file.
3. With the JSON file open in a text editor, find the number of hits for "_id" (a field which every dataset entry has). This gets us the number of hits.

Alternatively, when MongoDB Compass finishes writing the JSON file in step 2, it will display a message saying something like "finished writing X documents," where X is the number of hits for the query.

## In node.js
### Node.js Setup
Much information gleaned from https://www.mongodb.com/docs/drivers/node/current/quick-start/download-and-install/
1. Download node.js: https://nodejs.org/en/download/. Go through the installer; do not change any default settings in the installer.
2. in your terminal, cd to [repo folder]/nodejs-files

After going through the above setup, node.js should already be initialized and the mongodb node driver already installed here, so you should be able to simply run "node ./[query].js" to execute a given query. Otherwise refer to the above link to the mongodb website to initialize node.js and install the mongodb node driver.

NOTE: query3.js currently exports its findings to a .json file. if this json file already exists, it may cause execution problems.