import { crudRouter } from "./_crud.js";
import Project from "../models/Project.js";
export default crudRouter(Project, { listSort: { featured: -1, createdAt: -1 } });