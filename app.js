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

const convertMovieAPI = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
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
﻿  INSERT INTO 
  movie (director_id,movie_name,lead_actor)
  VALUES (${directorId}, "${movieName}", "${leadActor}");`;
      const updateQueryResponse = await db.run(updateQuery);
  response.send("Movie Updated Successfully");
});
