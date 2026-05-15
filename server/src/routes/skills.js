import { crudRouter } from "./_crud.js";
import Skill from "../models/Skill.js";
export default crudRouter(Skill, { listSort: { order: 1 } });