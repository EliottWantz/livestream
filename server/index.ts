import express, { Request, Response } from "express";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import path from "path";

const app = express();

app.use(express.urlencoded());

app.get("/", (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/video", async (req: Request, res: Response) => {
  const range = req.headers.range;
  if (!range) return res.status(400).send("No range header found");

  const videoPath = path.join(__dirname, "thevid.mp4");
  const videoSize = (await stat(videoPath)).size;

  // Ex: "bytes=234-"
  const CHUNK_SIZE = 10 ** 6; // 1 Mb
  const start = parseInt(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  const contentLength = end - start + 1;

  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  });
  createReadStream(videoPath, { start, end }).pipe(res);
});

app.post("/auth", (req: Request, res: Response) => {
  const streamKey = req.body.streamKey;

  if (streamKey === "secretKey") return res.sendStatus(200);

  res.sendStatus(403);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
