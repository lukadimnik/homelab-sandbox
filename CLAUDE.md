# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Personal homelab — two-node k3s cluster built for hands-on DevOps learning. Claude's role here is **planning and teaching partner**, not just executor. Explain the why behind each step; don't just do things for the user.

**Hardware:**
- **HP EliteBook 840 G2** — k3s control plane
- **PC Tower (i7-8700K, 16 GB RAM, GeForce 1080 Ti)** — k3s worker node

Both machines run **Arch Linux** (Omarchy distribution).

## Current state

- k3s two-node cluster is live
- Static website containerised with Nginx, deployed to k3s
- `lukadimnik.com` routes through an in-cluster Cloudflare Tunnel

**Next focus:** Stage 1 — GitHub Actions CI (build → Trivy scan → push with git-SHA tag)

## Architecture

- **Orchestration**: k3s — EliteBook is the control plane, PC Tower is a worker
- **Namespace**: `default` for all current workloads
- **Ingress**: Traefik (bundled with k3s)
- **Website**: Static HTML/CSS/JS served by Nginx, containerised via Docker, deployed to k3s
- **Public exposure**: Cloudflare Tunnel running in-cluster as a Deployment; `lukadimnik.com` routes to `website.default.svc.cluster.local`

## Repo layout

```
website/       # static site source, Dockerfile, k8s manifests
cloudflared/   # cloudflared Deployment + ConfigMap
```

## Website deployment

Build and push:
```bash
docker build -t lukadimnik/website:latest website/
docker push lukadimnik/website:latest
```

Apply to the cluster:
```bash
kubectl apply -f website/deployment.yml
```

The Service is `ClusterIP` — external traffic enters via the Cloudflare Tunnel, not a NodePort.

## Cloudflare Tunnel

`cloudflared/deployment.yml` contains a ConfigMap and Deployment that run `cloudflared` inside the cluster. Tunnel credentials are stored in the `cloudflared-credentials` Secret (created out-of-band). Routes `lukadimnik.com` → `http://website.default.svc.cluster.local`.

Apply with:
```bash
kubectl apply -f cloudflared/deployment.yml
```

## Cluster access

If `kubectl` returns a permission error on the kubeconfig:
```bash
sudo chmod 644 /etc/rancher/k3s/k3s.yaml
```
