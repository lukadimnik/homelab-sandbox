# Stage 1 — CI/CD

**Goal:** Replace the manual `docker build && docker push` loop with a GitHub Actions pipeline that builds, scans, and ships immutable, traceable images.

Concrete targets:
- GitHub Actions workflow triggered on push to `main` and on pull requests
- Build → Trivy vulnerability scan → push to Docker Hub
- Images tagged with the git SHA (not just `latest`), so every deploy is traceable to a commit and rollbacks are trivial
- SBOM generated (e.g. with `syft`) and uploaded as a build artifact
- Website Deployment manifest updated to reference the SHA-tagged image

> **Why TLS is not in this stage:** Cloudflare Tunnel terminates TLS at Cloudflare's edge, so the public site is already HTTPS. cert-manager is still worth setting up for internal services, but it belongs alongside the rest of the ingress hardening work — see Stage 4.

---

## What was built

<!-- Fill in as you complete each piece -->

---

## Key decisions

<!-- Why did you make the choices you made? e.g. why SHA tags over latest, fail-the-build vs. report-only for Trivy, where to store Docker Hub creds, etc. -->

---

## Challenges & solutions

<!-- Problems hit and how you solved them — this is the most valuable part -->

---

## What I learned

<!-- Takeaways that will stick -->
