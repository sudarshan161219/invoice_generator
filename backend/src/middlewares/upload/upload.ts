import multer from "multer";

const storage = multer.memoryStorage(); // keep file in memory (Buffer)
export const upload = multer({ storage });
