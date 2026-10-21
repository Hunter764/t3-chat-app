-- Chats are owned by Neon Auth users (neon_auth schema), which are not rows of the
-- local "user" table, so the foreign key made every chat insert fail.
ALTER TABLE "chat" DROP CONSTRAINT IF EXISTS "chat_userId_fkey";

-- Unused scratch table.
DROP TABLE IF EXISTS "Test";
