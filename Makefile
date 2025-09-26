run:
	bun run exec

qjs:
	bun run quick

node:
	bun build src/main.ts --outfile=target/main.js --minify && node target/main.js
