import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  title: String,
  genre: String,
  platform: String,
  releaseYear: Number,
  description: String,
  imageUrl: String,
});

const Game = mongoose.model("Game", gameSchema);

export default Game;
