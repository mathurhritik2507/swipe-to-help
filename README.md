# Swipe to Help

A mobile-first platform for discovering verified assistance requests and startup ideas.

**Public prototype:** https://swipe-to-help-hritik.partedmodel.chatgpt.site

## Status

The public prototype has account-backed features and a moderation workflow. **This repository is being initialized for the production codebase; it is not yet a mirror of the currently deployed application.** Do not deploy this repository over the live app until the source has been synchronized and tested.

**Not live:** donations, payment processing, securities investments, KYC/KYB verification, and cross-border payouts. No live payment or investment is permitted until provider onboarding, legal review, and country-specific controls are completed.

## Product lanes

- **Help someone:** verified bill requests, discover, save, report, moderation.
- **Back an idea:** startup profiles, personal/company identity, discovery, interest expressions.
- **Accounts:** authenticated users, personal profiles, organization profiles, role-based moderation.

## Production architecture (target)

- Next.js + TypeScript
- Authentication provider (managed identity; server-validated sessions)
- Database with owner-scoped access and audit logs
- Moderation and verification queues
- Provider-hosted payment onboarding (no card storage)
- Registered securities intermediary for any regulated investment offerings

## Security requirements

1. Never expose service-role keys in the browser.
2. Enforce authorization on the server for every mutation.
3. Private evidence must never be public.
4. Never allow self-assignment of administrator, verified, funded, or paid status.
5. Use idempotent payment webhooks and an immutable transaction audit trail.
6. Treat personal and company investment as separate legal flows.

## Immediate roadmap

- [ ] Sync tested source of the deployed application to this repository
- [ ] Add automated typecheck, lint, build, and access-control tests
- [ ] Configure deployment from GitHub after source parity is verified
- [ ] Complete account lifecycle, abuse controls, and company verification
- [ ] Partner review for donation payment acceptance and disbursement
- [ ] Securities counsel and registered intermediary for startup investment functionality

## Contributing

Please do not submit real bills, payment credentials, identity documents, or private financial information to GitHub issues.
