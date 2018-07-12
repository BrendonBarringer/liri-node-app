//**** LIRI **** 

// ___________  NPM modules _____________________________________

require("dotenv").config()

var fs = require("fs");
var keys = require("./keys.js");
var twitter = require("twitter");
var spotify = require("node-spotify-api");
var request = require("request");


//Passing keys from local file
var spotify = new spotify(keys.spotify);
var client = new twitter(keys.twitter);
var omdb = keys.omdb;

// global variable for indicator
var indicator = process.argv;

//___________  LOG Function  ____________________________________

// var writeToLog = function(data) {
//     fs.appendFile("log.txt", '\r\n\r\n');

//     fs.appendFile("log.txt", JSON.stringify(data), function(err) {
//         if (err) {
//             return console.log(err);
//         }

//         console.log("log.txt was updated!");
//     });
// }

//__________  SWITCH ___________________________________________

switch (indicator[2]) {

    // Gets list of tweets.
    case "my-tweets":
        getMyTweets();
        break;

        // Gets Song info 
    case "spotify-this-song":
        songLookup();
        break;

        // Gets movieTitle information.
    case "movie-this":
        getmovieTitleInfo();
        break;

        // Gets text inside file, and uses it to do something.
    case "do-what-it-says":
        doWhatItSays();
        break;

        // LIRI Instructions displayed in terminal to the user
    default:
        console.log("\r\n" + "Try typing one of the following commands after 'node liri.js' : " + "\r\n" +
            "1. my-tweets 'any twitter name' " + "\r\n" +
            "2. spotify-this-song 'any song name' " + "\r\n" +
            "3. movie-this 'any movie name' " + "\r\n" +
            "4. do-what-it-says." + "\r\n" +
            "Be sure to put the movie or song name in quotation marks if it's more than one word.")
}


//_______________  TWITTER Function ___________________________________________

function getMyTweets() {
    //Getting the results and handling the errors
    client.get('statuses/user_timeline', function(error, tweets, response) {
        if (!error) {

            //Looping throught the resullts
            for (var i = 0; i < tweets.length; i++) {
                console.log("------------------------------ " + "\r\n" +
                    "@" + tweets[i].user.screen_name + ": " +
                    tweets[i].text + "\r\n" +
                    //moment(tweets[i].created_at).format('LLL') + "\r\n"
                    tweets[i].created_at + "\r\n"
                );
                //breaking out of the loop at the 20th tweet
                if (i == 19) {
                    break;
                }
            }
        }
    });
}

//_______________  Spotify Function ___________________________________________

function songLookup() {
    let song = indicator[3];
    //Check if Search Song is not empty
    if (song != undefined) {
        //Loop thru and build query for more than one word
        for (let i = 3; i < indicator.length; i++) {
            if (i > 3 && i < indicator.length) {
                song = song + " " + indicator[i];
            } else {
                song = indicator[3];
            }
        }
        //Give user song "The Sign" if left empty    
    } else {
        console.log("You didn't enter a song.");
        break;
    }

    spotify.search({ type: 'track', query: song, limit: 1 }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        //If no results are found
        if (data.tracks.total == 0) {
            console.log("Sorry, no results found!..Try another song");
        }

        let TrackSearchResult = data.tracks.items
        for (let i = 0; i < TrackSearchResult.length; i++) {
            console.log("*************************************************")
            console.log("Artist: " + JSON.stringify(TrackSearchResult[i].artists[0].name));
            console.log("Song: " + JSON.stringify(TrackSearchResult[i].name));
            console.log("Preview Link: " + JSON.stringify(TrackSearchResult[i].preview_url));
            console.log("Album: " + JSON.stringify(TrackSearchResult[i].album.name));
            console.log("*************************************************")
        }
    });
}

//_______________  OMDB Function ___________________________________________
// If no movieTitle title given, provides to the movie, Mr. Nobody.

function getmovieTitleInfo() {
    var movie = indicator[3];
    if (!movie) {
        console.log("You didn't enter a movie.");
        break;
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece";
    request(queryUrl, function(e, resp, data) {
        if (!e && resp.statusCode === 200) {

            console.log("*************************************************")
            console.log("Title: " + JSON.parse(data).Title);
            console.log("Year: " + JSON.parse(data).Year);
            console.log("IMDB Rating: " + JSON.parse(data).imdbRating);
            console.log("Country: " + JSON.parse(data).Country);
            console.log("Language: " + JSON.parse(data).Language);
            console.log("Plot: " + JSON.parse(data).Plot);
            console.log("Actors: " + JSON.parse(data).Actors);
            console.log("*************************************************")
        }
    });
}

//_______________  Do what it says Function ___________________________________________

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (!error) {
            doWhatItSaysResults = data.split(",");
            songLookup(doWhatItSaysResults[0], doWhatItSaysResults[1]);
        } else {
            console.log("Error occurred" + error);
        }
    });
};

//________________________ Do What It Says LOG fucntion ___________________

// function log(logResults) {
//     fs.appendFile("log.txt", logResults, (error) => {
//         if (error) {
//             throw error;
//         }
//     });
// }
