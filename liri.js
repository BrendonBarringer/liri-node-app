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



//__________  SWITCH ___________________________________________
function whatyoudoing(){
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
}
whatyoudoing();

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
                    tweets[i].created_at + "\r\n"
                );
                //Creates variable to log into log.txt
                let twitterLog = tweets[i].user.screen_name+ '\r\n' + 'Tweet: ' + tweets[i].created_at + '\r\n' + 'Tweet Text: ' + tweets[i].text + '\r\n*********************\r\n';

                //Appends txt to log.txt
                fs.appendFile('log.txt', twitterLog, function (err) {
                    if (err) throw err;
                });
                console.log("Saved tweets into log.txt");

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
        console.log("You didn't enter a song. Defaulting to The Sign");
        song='The Sign Ace of Base'
        
    }

    spotify.search({ type: 'track', query: song}, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        //If no results are found
        if (data.tracks.total == 0) {
            console.log("Sorry, no results found!..Try another song");
        }

        let TrackSearchResult = 
            "*************************************************"+'\r\n'+
            "Artist: " + JSON.stringify(data.tracks.items[0].artists[0].name)+'\r\n'+
            "Song: " + JSON.stringify(data.tracks.items[0].name)+'\r\n'+
            "Preview Link: " + JSON.stringify(data.tracks.items[0].preview_url)+'\r\n'+
            "Album: " + JSON.stringify(data.tracks.items[0].album.name)+'\r\n'+
            "*************************************************"
        console.log(TrackSearchResult)
        fs.appendFile('log.txt', TrackSearchResult, function (err) {
            if (err) throw err;
          });
          console.log("Saved song info into log.txt");
    });
}

//_______________  OMDB Function ___________________________________________
// If no movieTitle title given console logs and breaks

function getmovieTitleInfo() {
    var movie = indicator[3];
    if (!movie) {
        console.log("You didn't enter a movie. Have you heard of Mr. Nobody?");
        movie='Mr. Nobody'
        
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece";
    request(queryUrl, function(e, resp, data) {
        if (!e && resp.statusCode === 200) {

            let omdbResults =
            "*************************************************"+'\r\n'+
            "Title: " + JSON.parse(data).Title+'\r\n'+
            "Year: " + JSON.parse(data).Year+'\r\n'+
            "IMDB Rating: " + JSON.parse(data).imdbRating+'\r\n'+
            "Country: " + JSON.parse(data).Country+'\r\n'+
            "Language: " + JSON.parse(data).Language+'\r\n'+
            "Plot: " + JSON.parse(data).Plot+'\r\n'+
            "Actors: " + JSON.parse(data).Actors+'\r\n'+
            "*************************************************"+'\r\n'
            console.log(omdbResults);
            fs.appendFile('log.txt', omdbResults, function (err) {
                if (err) throw err;
              });
              console.log("Saved Movie Info into log.txt");
            
        }
    });
}

//_______________  Do what it says Function ___________________________________________

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (!error) {
            doWhatItSaysResults = data.split(",");
            indicator[3]= doWhatItSaysResults[1];
            indicator[2]= doWhatItSaysResults[0];
            whatyoudoing();
        } else {
            console.log("Error occurred" + error);
        }
    });
};

