# Gemini Fiction Bridge — Development prototype

Purpose: make a REAL Gemini model draft fiction from inside ChatGPT using a remote MCP tool. The bridge returns the model's original scene rather than ChatGPT impersonating Gemini. It never updates canon or manuscripts automatically.

Status: coded and provider-mock-tested; NOT LIVE-CONNECTED to Google and NOT YET ANDROID-VERIFIED. The owner needs to authorize her own free-tier Google AI Studio API key and configure the secrets on a secure host before real calls are possible.

## No per-use billing intention
Choose a Free Tier Google AI Studio project with billing NOT linked; model allowlist and no fallback are enforced in code. Caution: the bridge cannot determine whether the project associated with a key has billing enabled. Verify the project's billing status in Google AI Studio. Free-tier data may be used by Google for product improvement. Free-tier quotas and model availability vary.

## Security and Android
The MCP endpoint MUST NOT be deployed publicly without authentication. Required secret environment variables GEMINI_API_KEY and BRIDGE_ACCESS_TOKEN. Use HTTPS, don't paste keys into chats. ChatGPT plugin connection must be configured and VERIFIED on actual Android; local desktop MCP is NOT adequate. The standard public submission portal does NOT support fixed bearer keys in its connection form; use an approved private custom connection, OAuth, or a ChatGPT Sites-hosted MCP with suitable secure authorization.

## How to test
Run npm install, npm test, then start with private environment variables. GET /health checks server status only. Use gemini_bridge_status to check configuration, then gemini_write_scene with disposable material before sending actual novel text.

No changes to Arthur, canon, or deployed production plugins. This work lives in an isolated development branch.
