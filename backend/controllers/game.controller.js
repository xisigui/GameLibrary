import mongoose from "mongoose";
import Game from "../models/game.model.js";

export const getGames = async (req, res) => {
  try {
    const games = await Game.find({});
    res.status(200).json({ success: true, data: games });
  } catch (error) {
    console.log("error in fetching games:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createGame = async (req, res) => {
  const game = req.body;

  const newGame = new Game(game);

  try {
    await newGame.save();
    res.status(201).json({ success: true, data: newGame });
  } catch (error) {
    console.error("Error in Create product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateGame = async (req, res) => {
  const { id } = req.params;

  const game = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Game Id" });
  }

  try {
    const updatedGame = await Game.findByIdAndUpdate(id, game, { new: true });
    res.status(200).json({ success: true, data: updatedGame });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteGame = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Game Id" });
  }

  try {
    await Game.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Game deleted" });
  } catch (error) {
    console.log("error in deleting game:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
