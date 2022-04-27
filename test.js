import { parser } from "@lezer/python";
import { treeGen, strucmapcompare } from "./index.js";
import * as fs from "fs";

let file1 = fs.readFileSync("./oddstring.py").toString("utf-8");
let file2 = fs.readFileSync("./oddstring2.py").toString("utf-8");
let file3 = fs.readFileSync("./oddstring3.py").toString("utf-8");

let p1 = parser.parse(file1);
let p2 = parser.parse(file2);
let p3 = parser.parse(file3);

let t1 = treeGen(file1, p1);
let t2 = treeGen(file2, p2);
let t3 = treeGen(file2, p3);
console.assert(strucmapcompare(t1, t2))
console.assert(!strucmapcompare(t1, t3))