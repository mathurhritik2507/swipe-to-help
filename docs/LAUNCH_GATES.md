# Launch gates

## Gate A: Public discovery and interest
- Accounts, moderation, company and personal profiles
- Rate limiting, report abuse, privacy notices, deletion requests
- Synthetic sample data until reviewed
- No movement of funds

## Gate B: Real donations
- Decide initial jurisdictions and legal entity
- Obtain payment processor approval for fundraising use case
- Confirm whether direct-to-biller payment is supported
- KYC/KYB, sanctions screening, dispute handling, refund and chargeback policy
- Data protection review, webhook verification, reconciliation
- Production test with explicit owner approval

## Gate C: Startup investments
- Determine instrument (equity, debt, SAFE) and eligible investors
- Securities counsel review per jurisdiction
- Use registered broker-dealer/funding portal where required
- Investor eligibility, disclosures, risk notices, cap-table and custody arrangements
- Never advertise 'invest now' or accept investment money before approval

## Owner checklist
- [ ] Confirm first launch country
- [ ] Confirm whether there is a registered legal entity
- [ ] Connect deployment provider using least privilege
- [ ] Connect auth/database provider using least privilege
- [ ] Establish production environment and secret management
- [ ] Complete threat model and privacy/security review
- [ ] Validate source parity with currently deployed demo

Do not paste passwords, tokens, secret keys, or customer documents into chat or GitHub.
