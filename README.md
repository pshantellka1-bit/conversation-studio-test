# Conversation Studio mobile extension test

Disposable sample dialogue only. Node 20+ MCP HTTP server at `/mcp`, health endpoint `/health`, standalone fallback `/`. No real manuscript access. No authentication or persistent storage; do not use with private manuscript data. Test outer-screen touch controls before building the full dialogue app.

## Character Conversations prototype
Open `/characters` after authenticating with the studio password. The prototype has Natural and Cinematic modes and In Character, Author Interview, and Scene Rehearsal purposes. It uses two fabricated characters only (Mara Vale, Rowan Hale) and a ten-chapter sample fact timeline. Switching character, chapter, or mode clears the visible conversation context.

The `POST /api/character-chat` endpoint validates character, chapter, mode, and user input, filters known facts at or before the selected chapter, and limits conversation history. With `OPENAI_API_KEY` set in the server environment it asks `gpt-4.1-mini` to respond in character; without one it responds using a deliberately limited scripted sample. Never put API keys in the browser. The sandbox does not import or persist real manuscripts or chats.

Browser speech uses Web Speech APIs if supported. Text-to-speech voices may not represent a distinct actor and microphone recognition varies by browser. This does not yet implement full semantic secret protection, persistent project sync, realtime voice, or a production-safe character knowledge graph. AI may occasionally invent facts; the prototype must not be treated as verified canon.

Run `npm test` for knowledge-boundary checks. This experimental route should remain behind the existing server password and should not receive private manuscripts.
