import mongoose from "mongoose";
import { ExperienceLikeSchema } from "./localized.js";
export default mongoose.model("Experience", ExperienceLikeSchema);