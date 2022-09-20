const express = require("express");
const path = require("path");

const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const app = express();
app.use(express.json());

let db = null;
const dbPath = path.join(__dirname, "moviesData.db");

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at localhost: 3000");
    });
  } catch (error) {
    console.log(`DataBase Error: ${error.messsage}`);
    process.exit(1);
  }
};

initializeDbAndServer();

//converting json file to db
const convertMovieAPI = (dbObject) => {
  return {
    movieName: dbObject.movie_name,
    directorId: dbObject.directorId,
    movie_name: dbObject.movieName,
    lead_actor: dbObject.leadActor,
  };
};

//API 1 Returns a list of all movie names in the movie table
app.get("/movies/", async (request, response) => {
  const getMovieQuery = `
    SELECT movie_name
    FROM movie;`;
  const getMovieQueryResponse = await db.all(getMovieQuery);
  response.send(
    getMovieQueryResponse.map((eachMovie) => convertMovieAPI(eachMovie))
  );
});

//API 2 Creates a new movie in the movie table. movie_id is auto-incremented
app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const updateQuery = `
    INSERT INTO 
        movie (director_id,movie_name,lead_actor)
    VALUES (${directorId}, "${movieName}", "${leadActor}");`;
  const updateQueryResponse = await db.run(updateQuery);
  response.send("Movie Updated Successfully");
});

//API 3 Returns a movie based on the movie ID
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieDetailsQuery = `
    SELECT * 
    FROM movie 
    WHERE movie_id = ${movieId};`;
  const getMovieDetailsQueryResponse = await db.get(getMovieDetailsQuery);
  response.send(ConvertMovieDbAPI3(getMovieDetailsQueryResponse));
});

//API 4 Updates the details of a movie in the movie table based on the movie ID
app.put("/movies/:movieId/", async (request, response) => {
  //  const {};
});

//API 5 Deletes a movie from the movie table based on the movie ID
app.delete("/movies/:movieId/", async (request, response) => {
  //  const {};
});

//API 6 Returns a list of all directors in the director table
app.get("/directors/", async (request, response) => {
  //  const {};
});

//API 7 Returns a list of all movie names directed by a specific director
app.get("/directors/:directorId/movies/", async (request, response) => {
  //  const {};
});
