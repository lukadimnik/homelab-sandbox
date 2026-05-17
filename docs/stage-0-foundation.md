# Stage 0 — Foundation

**Goal:** Get a two-node k3s cluster running and serve a website publicly, with no open inbound ports on the home network.

---

## What was built

- k3s cluster: EliteBook 840 G2 as control plane, PC Tower as worker node
- Static website (HTML/CSS/JS) containerised with Nginx, image on Docker Hub
- Website deployed to k3s as a Deployment + ClusterIP Service
- `lukadimnik.com` registered via Cloudflare Registrar
- `cloudflared` running as a Kubernetes Deployment inside the cluster, credentials stored in a Secret
- All public traffic routed through the Cloudflare Tunnel — no NodePort, no port forwarding

---

## Key decisions

**ClusterIP instead of NodePort for the website Service**
NodePort would expose a port directly on the host, requiring firewall rules and port forwarding on the router. Using ClusterIP + a Cloudflare Tunnel keeps the cluster fully internal — the tunnel initiates an outbound connection to Cloudflare, so nothing needs to be opened inbound.

**Running cloudflared as a Deployment, not a systemd service**
A host-level systemd service sits outside Kubernetes — it doesn't benefit from health checks, restarts, or scheduling. Running it as a Deployment means the cluster manages it like any other workload.

**k3s over full Kubernetes**
Lightweight enough to run on the EliteBook's 8 GB RAM without the control plane consuming most of it. Bundles Traefik and a local-path storage provisioner out of the box.

---

## Challenges & solutions

**SSH not working between nodes**
UFW was blocking SSH. The fix was to allow SSH specifically from the other machine's IP rather than opening port 22 globally — a good habit even on a home network.

**kubectl permission error on kubeconfig**
k3s writes `/etc/rancher/k3s/k3s.yaml` as root-only. Fixed with `sudo chmod 644 /etc/rancher/k3s/k3s.yaml`. A more correct long-term fix would be copying it to `~/.kube/config` with user ownership.

**Worker node going down and pods rescheduling**
When the PC Tower went offline, k3s rescheduled the pods to the EliteBook. Key insight: Kubernetes does not move pods *back* to a recovered node automatically — it only reschedules when a pod is disrupted. Pods will drift back over time as they restart for other reasons.

---

## What I learned

- Kubernetes reschedules pods away from failed nodes but does not rebalance automatically when a node recovers.
- The Cloudflare Tunnel pattern (outbound-only, in-cluster) is a clean way to expose services without touching router or firewall config.
- Running infrastructure components (like cloudflared) as Kubernetes workloads rather than host services is the right mental model — everything the cluster needs should be inside the cluster.
