# Monitoring DEPANNI

## Prometheus

L'API expose `GET /metrics` (Prometheus text format).

Métriques custom :

- `depanni_jobs_created_total`
- `depanni_offers_submitted_total`
- `depanni_missions_completed_total`
- `http_request_duration_ms` (histogram)

## Démarrage local

```bash
cd infra/monitoring
docker compose up -d
```

- Prometheus : http://localhost:9090
- Grafana : http://localhost:3002 (admin / admin)

Configurer une alerte Slack dans Grafana (contact point Slack) sur la règle `DepanniHighP95Latency` (p95 > 500 ms pendant 5 min).

## EXPLAIN ANALYZE

```bash
pnpm --filter @depanni/api db:explain
```
