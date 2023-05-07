import * as esbuild from 'esbuild'

let result = await esbuild.build({
	entryPoints: ['src/bin/index.ts', 'src/css/style.css'],
	bundle: true,
	outdir: "dist/",
})
console.log(result)
