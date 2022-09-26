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
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DataBase Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const convertMovieAPI = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
    directorName: dbObject.director_name,
  };
};

//API 1 Returns a list of all movie names in the movie table
app.get("/movies/", async (request, response) => {
  const getAllMoviesQuery = `
    SELECT movie_name
    FROM movie;`;
  const getAllMoviesResponse = await db.all(getAllMoviesQuery);
  response.send(
    getAllMoviesResponse.map((eachMovie) => convertMovieAPI(eachMovie))
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
  response.send("Movie Successfully Added");
});

//API 3
app.get("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
    SELECT *
    FROM movie
    WHERE movie_id = ${movieId};`;
  const getMovieResponse = await db.all(getMovieQuery);
  response.send(convertMovieAPI(getMovieResponse));
});

//API 4
app.put("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const { directorId, movieName, leadActor } = request.body;
  const updateMovieDetailsQuery = `
    UPDATE movie
    SET director_id = ${directorId}, 
    movie_name = '${movieName}', 
    lead_actor = '${leadActor}'
    WHERE movie_id = ${movieId};`;
  const updateMovieDetailsResponse = await db.run(updateMovieDetailsQuery);
  response.send("Movie Details Updated");
});

//API 5
app.delete("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
    DELETE FROM movie
    WHERE movie_id = ${movieId};`;
  const deleteMovieResponse = await db.run(deleteMovieQuery);
  response.send("Movie Removed");
});

//API 6
app.get("/directors/", async (request, response) => {
  const getAllDirectorsQuery = `
    SELECT *
    FROM director;`;
  const getAllDirectorsResponse = await db.all(getAllDirectorsQuery);
  response.send(
    getAllDirectorsResponse.map((eachMovie) => convertMovieAPI(eachMovie))
  );
});

//API 7
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;

  const getMovieNameByDirectorQuery = `
    SELECT movie_name AS movieName
    FROM movie
    WHERE director_id = ${directorId};`;
  const getMovieNameByDirectorResponse = await db.all(
    getMovieNameByDirectorQuery
  );
  response.send(getMovieNameByDirectorResponse);
});

module.exports = app;
