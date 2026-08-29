// lance toute la suite : node shared/tests/run.ts
import "./core.test.ts";
import "./placement.test.ts";
import "./firing.test.ts";
import { report } from "./check.ts";

report();
