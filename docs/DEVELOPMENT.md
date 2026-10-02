# Development Guide

## Requirements
- Node.js 20+
- npm 10+

## Commands
npm install
npm run test
npm run lint
npm run build
npm run check
npm run dev

## Environment
Copy .env.example to .env.
Never commit API keys, private keys, OAuth secrets, customer telemetry or production .env files.

## Engineering principles
1. Keep security-domain logic deterministic and independently testable.
2. Keep external integrations behind service adapters.
3. Never represent a mock as a live blockchain, hardware or identity integration.
4. Validate API input.
5. Prefer least-privilege credentials.
6. Add regression coverage for behavior changes.