run:
	bun src/main.ts

mc-stub:
	node ./mcstub.js

mc-compile:
	bun build src/main.ts --outfile=scripts/main.js --target=browser --external=@minecraft/server
	rollup -c
	

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
