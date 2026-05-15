import mongoose from "mongoose";
import { ExperienceLikeSchema } from "./localized.js";
export default mongoose.model("Project", ExperienceLikeSchema.clone());