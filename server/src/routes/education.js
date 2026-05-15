import { crudRouter } from "./_crud.js";
import Education from "../models/Education.js";
export default crudRouter(Education, { listSort: { order: 1 } });