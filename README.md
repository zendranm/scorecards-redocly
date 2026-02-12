# Deployment Scorecards

Evaluate GitHub Actions deployment quality using configurable YAML-based scorecards.

## Goal

Track deployment health by defining rules (e.g., minimum successful deployments, maximum failures) and evaluating them against GitHub workflow runs within configurable time windows.

## Tech Stack

- **Next.js 16** - Full-stack React framework
- **TypeScript** - Type safety
- **MongoDB (Prisma)** - Database for scorecards and results
- **Octokit** - GitHub API client
- **Tailwind CSS** - Styling

## Quick Start

### 1. Start MongoDB

```bash
docker compose up -d
```

Wait 10 seconds for replica set initialization.

### 2. Setup Environment

```bash
cp .env.example .env.local
```

Add your GitHub token to `.env.local`:

```
GITHUB_TOKEN=ghp_yourTokenHere
```

Get a token at: https://github.com/settings/tokens (needs `public_repo` scope)

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Usage

1. **Load Scorecards** - Load YAML definitions into database:

   ```bash
   curl -X POST http://localhost:3000/api/scorecards/load
   ```

2. **View UI** - Open http://localhost:3000
   - Select a scorecard from dropdown
   - Click "View Results" to see latest stored results
   - Click "Calculate New" to fetch fresh data from GitHub

## API Endpoints

- `POST /api/scorecards/load` - Load scorecards from YAML
- `GET /api/scorecards` - List active scorecards
- `GET /api/github/deployments` - Fetch deployments from GitHub
- `POST /api/scorecards/calculate` - Calculate scorecard results
- `GET /api/scorecards/:id/results` - Get latest results for scorecard

## Scorecard Definition

Edit `scorecards/scorecards.yaml` to define your scorecards:

```yaml
scorecards:
  - name: Production Quality
    repository: owner/repo
    timeWindow:
      durationHours: 24
      type: rolling
    rules:
      - id: min-deployments
        type: min_successful
        threshold: 3
        description: At least 3 successful deployments
```

## Stopping

```bash
docker compose down
```
