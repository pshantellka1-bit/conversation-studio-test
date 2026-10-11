---
name: gemini-fiction-bridge
description: Invoke the actual Google Gemini model through the bridge when the author explicitly asks for a scene, with verified canon and no ChatGPT substitution.
---
# Gemini Bridge writing tool

Use the gemini_write_scene tool only when requested. Pass the exact intended event order, POV, tense, source-verified canon, and the author's prose preferences. Do not improvise foundational unresolved backstory. Return Gemini's actual text without silently rewriting. Never tell the user a ChatGPT-written scene came from Gemini. Never save canon or drafts without authorization. If bridge_status shows disconnected or the tool isn't present, report the blocker. Do not ask for API keys or bridge bearer secrets in chat. Only the user can verify Free Tier project billing settings.
