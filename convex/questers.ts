import { v } from "convex/values";
import { query } from "./_generated/server";

export const listClasses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("classes").collect();
  },
});

export const list = query({
  args: {
    classes: v.optional(v.array(v.string())),
    abilityMins: v.optional(
      v.object({
        CHA: v.number(),
        WIS: v.number(),
        INT: v.number(),
        CON: v.number(),
        DEX: v.number(),
        STR: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { classes, abilityMins } = args;
    let questers = ctx.db.query("questers");
    if (classes && classes.length) {
      questers = questers.filter((q) =>
        q.or(...classes.map((c) => q.eq(q.field("class"), c)))
      );
    }
    if (abilityMins) {
      questers = questers.filter((q) =>
        q.and(
          ...Object.entries(abilityMins).map(([abbrv, min]) =>
            q.gte(q.field(abbrv), min)
          )
        )
      );
    }
    return await questers.collect();
  },
});
