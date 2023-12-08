import { query, mutation } from "./_generated/server";

export const listTypes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("quest_types").collect();
  },
});
