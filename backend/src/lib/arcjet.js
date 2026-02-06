import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";
import { ENV } from "./env.js";

const aj = arcjet({
  key: ENV.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
    detectBot({
      mode: "LIVE",
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
      ],
    }),
    // creating a window for every user for their request
    slidingWindow({
      mode: "LIVE",
      max: 100, // maximum 100 request
      interval: 60, // in 60 sec or 1 min 100 req only
    }),
  ],
});

export default aj;