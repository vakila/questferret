import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default function useSaveUserEffect() {
  // When this state is set we know the server
  // has stored the user.
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const getOrSaveUser = useMutation(api.users.getOrSave);
  // Call the `getOrSaveUser` mutation function to store
  // the current user in the `users` table and return the `Id` value.
  useEffect(() => {
    // Store the user in the database.
    // Recall that `getOrSaveUser` gets the user information via the `auth`
    // object on the server. You don't need to pass anything manually here.
    async function getSavedUser() {
      const id = await getOrSaveUser();
      setUserId(id);
    }
    void getSavedUser();
    return () => setUserId(null);
    // Make sure the effect reruns if the user logs in with
    // a different identity
  }, [getOrSaveUser]);
  return userId;
}
