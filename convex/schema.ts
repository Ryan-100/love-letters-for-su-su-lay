import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  letters: defineTable({
    title: v.string(),
    content: v.string(),
    mood: v.string(),
    opened: v.boolean(),
  }).index("by_mood", ["mood"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
