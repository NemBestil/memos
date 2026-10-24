# Docker deployment

`Dockerfile` is the release pipeline image build: build frontend assets with
`cd web && pnpm install --frozen-lockfile && pnpm release` first, then supply
`VERSION` and `COMMIT` build arguments as described in the root `AGENTS.md`.

## Build the NemBestil fork in Coolify

`Dockerfile.coolify` builds the frontend and backend directly from a Git checkout.
Its adjacent `.dockerignore` includes frontend sources and excludes Git metadata.
Coolify removes `.git` before building, so the image uses its `SOURCE_COMMIT` build
argument and the UTC build date for `YY.MM.D-dev.<sha7>`. Unlike local Go builds,
this date is the build date, not the commit date. An optional `VERSION` build
argument can override the version when needed.

The simplest option for the existing Coolify application is to keep its Dockerfile
build strategy and change Dockerfile location to `/scripts/Dockerfile.coolify`.
Keep base directory `/`, internal port `5230`, and the existing persistent storage
mounted at `/var/opt/memos`. No `VERSION` or `COMMIT` variables are required.
Use **Managed manually in Dockerfile** under Advanced > Build > Build arguments.
Set Advanced > Build > Source commit availability to **Available during build**.
See [Coolify's Dockerfile settings](https://coolify.io/docs/applications/builds/dockerfile).

### Optional Docker Compose setup

Use the existing Git source `NemBestil/memos`, branch `main`, with:

- Build strategy: Docker Compose.
- Base directory: `/`.
- Compose location: `/scripts/compose.coolify.yaml`.
- Raw deployment: disabled, so Coolify manages proxy routing.
- Build arguments: **Managed manually in Dockerfile**.
- Source commit availability: **Available during build**.
- Domain: assign `https://log.nembestil.dev` to service `memos`, internal port `5230`.

Set these Coolify variables:

```dotenv
MEMOS_VOLUME_NAME=wk2afn6utaytngczsdsq0ahs-memos
MEMOS_INSTANCE_URL=https://log.nembestil.dev
TZ=Europe/Copenhagen
```

The external volume must already exist on the deployment server. The name above
is the existing application's volume; keep it to retain its database and uploads.
If installing a separate instance, create a separate volume and use that name.
Do not run two Memos instances against the same SQLite volume at once.
The Compose file builds this repository; `scripts/compose.yaml` instead pulls the
upstream image and is unsuitable for deploying fork customizations.
See [Coolify's Compose settings](https://coolify.io/docs/applications/builds/docker-compose).

### Local verification

From the repository root (Git is only used by the host to supply the commit):

```bash
docker build -f scripts/Dockerfile.coolify --build-arg SOURCE_COMMIT="$(git rev-parse HEAD)" -t memos-coolify:local .
docker run --rm memos-coolify:local version
```

For Compose, set `MEMOS_VOLUME_NAME` to a disposable, pre-created Docker volume:

```bash
SOURCE_COMMIT="$(git rev-parse HEAD)" MEMOS_VOLUME_NAME=memos-test docker compose -f scripts/compose.coolify.yaml config --quiet
```
