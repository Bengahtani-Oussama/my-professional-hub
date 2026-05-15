import { crudRouter } from "./_crud.js";
import Experience from "../models/Experience.js";
export default crudRouter(Experience, { listSort: { startDate: -1 } });