# TopShelfWebsites Extreme Automation Engine

## Objective

Move from manual operations to autonomous website production.

## Pipeline

1. Client config received
2. Command queued
3. PowerShell agent claims job
4. Website generated from template
5. SEO assets generated
6. Git commit created
7. Cloudflare deployment triggered
8. Health verification completed
9. Status reported

## Automation Rules

- Every job has an ID
- Every job has a status
- Every failure creates a recovery record
- Every successful deployment is preserved

## States

WORKING = executing successfully

STOPPED = intervention required

## Next Modules

- Durable command storage
- Agent heartbeat service
- Deployment executor
- Website factory
- Monitoring dashboard
