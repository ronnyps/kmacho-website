# Kmacho Website

Sitio web Nuxt con salida estática y soporte de idioma por rutas.

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## Static Build

Generate the static site:

```bash
npm run generate
```

Generated output is written to:

```bash
.output/public
```

## Validate Generated Output

Run the static validation step:

```bash
npm run validate:generated
```

## Enforce CSS Tokens

Run the token guardrail check:

```bash
npm run check:tokens
```

This blocks hardcoded color literals outside `app/assets/css/tokens.css` and inline `style=""` usage in Vue templates.

You can also run the full static check, which generates the site and then validates the output:

```bash
npm run check:static
```

## Apache Deployment

1. Run `npm run generate` locally or in your CI pipeline.
2. Copy the contents of `.output/public` to the Apache document root.
3. Configure Apache to serve the generated files as static assets.
4. Ensure the default route resolves to `/`.
5. Ensure the Spanish route resolves to `/es`.

Example deployment check after copying files:

```bash
curl -I https://your-domain.example/
curl -I https://your-domain.example/es
```

Both requests should return a successful response and load the expected pages.

## Notes

- The project uses static prerendering for `/` and `/es`.
- If the output changes, re-run `npm run validate:generated` before deployment.
- CSS architecture reference: `docs/technical/site-structure-and-style-architecture.md`
