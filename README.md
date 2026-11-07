## AWS Amplify Next.js (App Router) Starter Template

This repository provides a starter template for creating applications using Next.js (App Router) and AWS Amplify, emphasizing easy setup for authentication, API, and database capabilities.

## Overview

This template equips you with a foundational Next.js application integrated with AWS Amplify, streamlined for scalability and performance. It is ideal for developers looking to jumpstart their project with pre-configured AWS services like Cognito, AppSync, and DynamoDB.

## Features

- **Authentication**: Setup with Amazon Cognito for secure user authentication.
- **API**: Ready-to-use GraphQL endpoint with AWS AppSync.
- **Database**: Real-time database powered by Amazon DynamoDB.

## Deploying to AWS

For detailed instructions on deploying your application, refer to the [deployment section](https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/#deploy-a-fullstack-app-to-aws) of our documentation.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
## Project media (designs portfolio)

Raw renders for the nine projects under `/designs` live in `media-source/projects/<project folder>/` (gitignored — keep a backup). Everything the site serves is generated from them:

```bash
npm run prepare:projects        # requires ffmpeg on PATH; PYTHON=<interpreter> enables the enhancement stage
```

1. `scripts/projects.manifest.mjs` lists each project's renders in display order (first = cover), with bilingual captions and which renders carry the visualiser's watermark.
2. `scripts/enhance-renders.py` (run by the pipeline when `PYTHON` points at an interpreter with `scripts/requirements-enhance.txt` installed; models in `media-source/.models/`) removes the watermark with LaMa and upscales small sources to 4K with Real-ESRGAN. Results are cached in `media-source/.enhanced/`, with before/after previews in `media-source/.enhanced/_qa/`.
3. The pipeline writes 3840 px masters to `media-source/.masters/` and content-hashed WebP sets (480–3840 px) to `public/media/projects/<slug>/`, transcodes the walkthrough video, and emits `src/content/projects.generated.ts`.

Pages use `src/components/portfolio/ProjectImage.tsx`, which picks a variant per placement, so no image is encoded at request time; `/media/projects/*` is served with immutable caching (`next.config.js` and `customHttp.yml`). Project metadata and copy are in `src/content/projects.ts`.
