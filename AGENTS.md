# Architecture rules

- Reuse `PricingCalculator` for both the pricing page and timed dialog so pricing and inquiry submission stay identical.
- Mount the timed pricing dialog in the public Layout only so customer and staff workspaces are never interrupted.