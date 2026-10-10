# Conversation Studio — Privacy and Security Checkpoint

Verified: 2026-10-09 (US Central time)

## Current verified state
- Separate test application, not Arthur or Ghostwriting Studio.
- Railway project: conversation-studio-mobile-test (d18de4b7-d859-4d74-abe4-e12f6ecb5c9f).
- Railway service: conversation-studio-mcp (9b738512-1dd9-44ff-81e5-e3e23022e497).
- Public Railway-generated domain removed; subsequent domain listing verified **zero public service or custom domains**.
- Password protection implemented for all HTTP routes using HTTP Basic authentication. Missing or short STUDIO_PASSWORD causes the server to fail closed with HTTP 503. Unauthorized requests return HTTP 401.
- STUDIO_PASSWORD is configured as a Railway environment variable; its secret value is deliberately **not recorded** in this document or source code.
- OPENAI_API_KEY is configured as a separate Railway environment variable; the secret is not stored in GitHub.
- Password-protection commit: 9886d067d9a6be63ef398892446fdfb7129876ae.
- Railway deployment for that commit: **SUCCESS** at time of this checkpoint.
- The site remains inaccessible through its former public address. The new authentication flow has **not been externally penetration-tested** or browser-tested.

## Privacy and cost limitations
- The GitHub repository pshantellka1-bit/conversation-studio-test was previously set public. Change its visibility to private before treating this as a private project. Public source does not expose Railway environment-variable secrets by itself.
- The current test app has no user accounts or durable novel storage. The OpenAI API receives scene text submitted for generation.
- API calls consume paid OpenAI API credits; Railway hosting is billed separately according to the user's plan. ChatGPT Plus does not cover API usage.
- HTTP Basic authentication is an initial access gate, not full production-grade security. Before reopening publicly, add rate limits, request caps, HTTPS-only access, security headers, and proper session/authentication management. Avoid putting secrets in URLs or logs.
- Do not reattach a public domain until authentication and cost protections are verified. Rotate STUDIO_PASSWORD if exposed or shared.

## Next steps
1. Make GitHub repository private.
2. Add generation rate limiting, per-request cost caps and input size caps.
3. Verify server-side authorization and HTTP responses using a reachable test environment.
4. Restore public domain only after these tests pass; verify unauthorized requests are blocked and authorized generation works.
5. Keep the project isolated from existing writing systems and real manuscripts.
