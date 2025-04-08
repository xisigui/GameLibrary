"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { CirclePlus, Search, Pencil, Trash, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function Home() {
  const [games, setGames] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await axios.get("/api/games/");
      setGames(response.data.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with the server.",
        action: (
          <ToastAction altText="Try again" onClick={fetchGames}>
            Try again
          </ToastAction>
        ),
      });
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const filteredGames = games.filter((game) => {
    return (
      (game.title &&
        game.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (game.genre &&
        game.genre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (game.platform &&
        game.platform.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    genre: "",
    platform: "",
    releaseYear: "" as string | number,
    description: "",
    imageUrl: "",
  });
  const resetForm = async () => {
    setFormData({
      _id: "",
      title: "",
      genre: "",
      platform: "",
      releaseYear: "",
      description: "",
      imageUrl: "",
    });
  };
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const handleAdd = async () => {
    setIsDialogOpen(true);
    setFormMode("add");
    resetForm();
  };
  const handleEdit = async (game) => {
    setIsDialogOpen(true);
    setFormMode("edit");
    setFormData(game);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = JSON.stringify({
      title: formData.title,
      genre: formData.genre,
      platform: formData.platform,
      releaseYear: formData.releaseYear,
      description: formData.description,
      imageUrl: formData.imageUrl,
    });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (formMode === "add") {
      try {
        const response = await axios.post("/api/games", data, config);
        toast({
          description: "Your game has been added.",
        });
        console.log(response.data);
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Error adding the game.",
        });
      }
    } else if (formMode === "edit" && formData._id) {
      console.log(formData._id);
      try {
        const response = await axios.put(
          `/api/games/${formData._id}`,
          data,
          config
        );
        toast({
          description: "Your game data has been updated.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Error updating the game.",
        });
      }
    }
    fetchGames();
    setIsDialogOpen(false);
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/games/${id}`);
      toast({
        description: "Your game has been deleted.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error deleting the game.",
      });
    } finally {
      fetchGames();
    }
  };

  return (
    <>
      <div className="p-6 max-w-[1200px] mx-auto">
        <div className="mb-4 flex justify-between">
          <h1 className="text-2xl font-bold">Game Library</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleAdd()} variant="outline">
                <CirclePlus />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Game Details</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label>Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label>Genre</Label>
                    <Input
                      value={formData.genre}
                      onChange={(e) =>
                        setFormData({ ...formData, genre: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label>Platform</Label>
                    <Input
                      value={formData.platform}
                      onChange={(e) =>
                        setFormData({ ...formData, platform: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label>Release Year</Label>
                    <Input
                      type="number"
                      value={formData.releaseYear}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          releaseYear: parseInt(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label>Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label>Image Url</Label>
                    <Input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {formMode === "add" ? "Add Game" : "Save"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="mb-4 flex justify-between">
          <div className="w-full flex h-10 items-center rounded-md border border-input bg-white pl-3 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2">
            <Search />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search games by title, genre, or platform"
              className="w-full p-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGames.map((game, index) => (
            <Card
              key={index}
              className="p-4 flex flex-col md:flex-row relative"
            >
              <img
                src={game.imageUrl}
                alt={game.title}
                className="w-full md:w-1/3 h-auto mb-4 md:mb-0 md:mr-4 object-cover aspect-w-1 aspect-h-1"
              />
              <div className="flex-1 flex-col">
                <CardContent className="flex-1">
                  <h2 className="text-xl font-semibold">{game.title}</h2>
                  <p className="text-sm text-gray-600">
                    <b>Genres: </b>
                    {game.genre}
                  </p>
                  <p className="text-sm text-gray-600">
                    <b>Platforms: </b>
                    {game.platform}
                  </p>
                  <p className="text-gray-500 text-sm">
                    <b>Released: </b>
                    {game.releaseYear}
                  </p>

                  <ScrollArea className="mt-2 w-full h-[150px] sm:h-[150px] md:h-[120px] lg:h-[120px] xl:h-[120px] overflow-auto">
                    <p className="text-justify">{game.description}</p>
                  </ScrollArea>
                </CardContent>

                <div className="flex justify-end space-x-2">
                  <Button onClick={() => handleEdit(game)} variant="outline">
                    <Pencil size={32} />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button variant="outline">
                        <Trash size={32} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your game and remove data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(game._id)}
                        >
                          Yes
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
