import { query, mutation } from "./_generated/server";

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.

// You can read data from the database via a query:
export const list = query({
  // Validators for arguments.
  args: {},

  // Query implementation.
  handler: async (ctx) => {
    //// Read the database as many times as you need here.
    //// See https://docs.convex.dev/database/reading-data.
    return await ctx.db
      .query("users")
      // Ordered by _creationTime, return most recent
      .order("desc")
      .collect();
  },
});

export const getIdentity = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.auth.getUserIdentity();
  },
});

/**
 * Insert or update the user in a Convex table then return the document's ID.
 *
 * The `UserIdentity.tokenIdentifier` string is a stable and unique value we use
 * to look up identities.
 *
 * Keep in mind that `UserIdentity` has a number of optional fields, the
 * presence of which depends on the identity provider chosen. It's up to the
 * application developer to determine which ones are available and to decide
 * which of those need to be persisted. For Clerk the fields are determined
 * by the JWT token's Claims config.
 */
export const getOrSave = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Cannot save user without authentication present");
    }

    // Check if we've already stored this identity before.
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();

    if (user === null) {
      // If it's a new identity, create a new `User`.
      return await ctx.db.insert("users", {
        name: identity.name!,
        tokenIdentifier: identity.tokenIdentifier,
        info: user,
      });
    } else {
      // // If we've seen this identity before but the name has changed, patch the value.
      // if (user.name !== identity.name) {
      //   await ctx.db.patch(user._id, { name: identity.name });
      // }
      return user._id;
    }
  },
});
