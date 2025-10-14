run:
	bun src/main.ts

mc-compile:
	bun build src/main.ts --outfile=scripts/main.js --watch --target=browser --external=@minecraft/server --define='MatpDatagramDefaultByteSize="8192"'

tsgo:
	tsgo --strict --removeComments --pretty false --outFile target/main.js --outDir target --lib esnext --module preserve --target es5 --downlevelIteration

qjs:
	bun build src/main.ts --outfile=target/main.js --target=bun
	qjs target/main.js

node:
	bun build src/main.ts --outfile=target/main.js --minify && node target/main.js

qjs-profile:
	bun run quick-build
	sudo perf record -F 99 -g -- qjs --strip-source -d target/main.js
	sudo perf script
