# Homework Tracker Using GitHub API

Make sure you enable Allow-Control-Allow-Origin chrome [Extensions](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en) then go to [homework-tracker](https://ghadeer-x.github.io/homework-tracker-githubapi/)

# Reuse the template

1. Go to [gitHub Settings](https://github.com/settings/developers) and create a new OAuth app
2. Generate `Client Secret` and `Client Id`
3. Go to `data.js`file and
   3.1 Add your clientSecret and clientId
   3.2 Add your students names and thier github repo
   3.3 Add your hw pattern
   3.4 Add your mainRepo
4. If you want to slack them a reminder of thier hw go to [slack](https://api.slack.com/custom-integrations/legacy-tokens) and generate a new token
   4.1 Add the slack token in the `data.js` file
   4.2 Go to `findYourStudentsSlackID` folder and run the index.html
   4.3 Choose a channel so you can get all the members' slack id
   4.4 Add the students' slack id inside the `data.js` file
   4.5 Comment line 22 in the `script.js` file
