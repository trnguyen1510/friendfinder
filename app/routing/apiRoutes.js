var path = require("path");
var friends = require("../data/friends.js");

module.exports = function (app) { //Your `apiRoutes.js` file should contain two routes:
    // A GET route with the url `/api/friends`. This will be used to display a JSON of all possible friends
    app.get("/api/friends", function (req, res) {
        res.json(friends);
    });
    // A POST routes `/api/friends`. This will be used to handle incoming survey results, compare, store, and send back match. 
    app.post("/api/friends", function (req, res) {
        console.log("post request received.\n");
        /* Determine the user's most compatible friend using the following as a guide: *
        Convert each user's results into a simple array of numbers (ex: `[5, 1, 4, 4,
        5, 1, 2, 5, 4, 1]`).*/
        var maxDifference = 50; //maximum allowed difference between users. 5 points per 10 questions (5 * 10 = 50)
        var matchedFriend; //empty friend object to send back
        var currentFriend = req.body; //set post request object to currentFriend
        console.log("current friend: " + currentFriend + "\n");
        friends.forEach(function (friend) { //scan each friend object in friends.js
            var difference = 0; //init
            for (i = 0; i < friend.scores.length; i++) {
                /* With that done, compare the difference between current
                user's scores against those from other users, question by question. Add up the
                differences to calculate the `totalDifference`. * Example: * 
                User 1: `[5, 1, 4, 4, 5, 1, 2, 5, 4, 1]` * 
                User 2: `[3, 2, 6, 4, 5, 1, 2, 5, 4, 1]` * 
                Total Difference: **2 + 1 + 2 =** ***5*** /*Remember to use the absolute value of the
                differences. Put another way: no negative solutions! Your app should calculate
                both `5-3` and `3-5` as `2`, and so on.*/
                difference += Math.abs(friend.scores[i] - currentFriend.scores[i]);
            }
            if (difference < maxDifference) {
                /* The closest match will be the user with the least amount of difference. 
                Lower maxDifference if current difference is lower than current maxDifference */
                maxDifference = difference;
                matchedFriend = friend; //set matchedFriend to current scanned friend
            };
        });
        res.json(matchedFriend); //send back matched friend
        friends.push(req.body);
    });
};