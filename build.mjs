import * as esbuild from 'esbuild'
import * as process from "process"

import { htmlPlugin } from "@craftamap/esbuild-plugin-html"

const baseConfig = {
	logLevel: "info",
	entryPoints: ['src/bin/index.ts', 'src/css/style.css'],
	bundle: true,
	outdir: "dist/",
	metafile: true,
	plugins: [
		htmlPlugin({
			files: [
				{
					entryPoints: ['src/bin/index.ts', 'src/css/style.css'],
					filename: "index.html",
				}
			]
		})
	]
}
const releaseConfig = {
	minify: true,
}
const devConfig = {
	outdir: "www/",
	sourcemap: true,
}

switch (process.argv[2]) {
	case "release":
		await esbuild.build({ ...baseConfig, ...releaseConfig })
		break
	case "serve":
		let ctx = await esbuild.context({ ...baseConfig, ...devConfig })
		await ctx.serve({
			servedir: devConfig.outdir
		})
		break
	default:
		await esbuild.build(baseConfig)
		break
}
