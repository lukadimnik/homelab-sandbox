# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Personal homelab setup running on two machines:
- **HP EliteBook 840 G2** — k3s control plane
- **PC Tower (i7-8700k, 1080Ti, 16GB RAM)** — k3s worker node, hosts the website

The goal is self-hosted infrastructure for learning, with Claude helping plan and implement each step.

## Architecture

- **Orchestration**: k3s (single-node control plane + worker)
- **Ingress**: Traefik (bundled with k3s)
- **Website**: Static HTML/CSS/JS served by nginx, containerized via Docker, deployed to k3s
- **Planned**: Cloudflare Tunnel (`cloudflared`) for public internet exposure without port forwarding

## Website deployment

Build and push the image:
```bash
docker build -t lukadimnik/website:latest website/
docker push lukadimnik/website:latest
```

Apply to the cluster:
```bash
kubectl apply -f website/deployment.yml
```

The Service is currently type `NodePort` on port `30080`. This will change to `ClusterIP` once Cloudflare Tunnel is set up.

## Cluster access

If `kubectl` returns a permission error on the kubeconfig:
```bash
sudo chmod 644 /etc/rancher/k3s/k3s.yaml
```
