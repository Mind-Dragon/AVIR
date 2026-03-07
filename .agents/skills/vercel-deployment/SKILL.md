# Vercel Deployment — AVIR

## Standing Rule

All Vercel deployments for the AVIR website MUST target the existing `avir-website` project. **Never create new Vercel projects.**

## Project Details

| Field          | Value                                      |
| -------------- | ------------------------------------------ |
| Project name   | `avir-website`                             |
| Project ID     | `prj_UcrrOU0xcRAZSYQXmDKTdHVk5Lgk`        |
| Team (scope)   | `fogonekun-9144`                           |
| Team ID        | `team_PNMrVw3EwgwliM1U2nxDQ6Kg`           |
| Production URL | https://avir-website.vercel.app            |
| GitHub repo    | `Mind-Dragon/AVIR` (branch: `main`)        |

## How to Deploy

Use the provided deploy scripts which verify the project link before deploying:

```bash
# Preview deployment
npm run deploy

# Production deployment
npm run deploy:prod
```

These scripts check `.vercel/project.json` to confirm the correct project ID and org ID before running any Vercel CLI commands.

## If `.vercel/project.json` Is Missing or Wrong

1. Run `vercel link` and select the `avir-website` project under the `fogonekun-9144` team scope
2. Verify the generated `.vercel/project.json` contains:
   - `"orgId": "team_PNMrVw3EwgwliM1U2nxDQ6Kg"`
   - `"projectId": "prj_UcrrOU0xcRAZSYQXmDKTdHVk5Lgk"`
3. Then deploy using `npm run deploy` or `npm run deploy:prod`

## What NOT to Do

- Do **not** run bare `vercel deploy` or `vercel --prod` without first verifying the project link
- Do **not** create new Vercel projects — ever
- Do **not** remove or modify `.vercel/project.json` to point at a different project
