import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listTypes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("quest_types").collect();
  },
});

// export const saveQuest = mutation({
//   args: {
//     seekerName: v.string(),
//     title: v.string(),
//     description: v.string(),
//     type: v.id("quest_types"),
//   },
//   handler: async (ctx, args) => {
//     return await ctx.db.insert('quests', {

//     });
//   },
// });
