import path from "path";
import fs from "fs";
import { normalizePath } from "vite";
import { compile } from '@vue/compiler-dom';
import getLcp from "./lcp";

const acm = fs.constants.F_OK | fs.constants.R_OK;
const fsp = fs.promises;
const COMP = 'VUE_COMP';
// const reJs = /\.js$/i;
const rePathAbs = /^(\w+:)?[\\\/]+/i;
const fsOpt = { encoding: 'utf8' };
let NR = 0;

function buildScriptRender(compName, compPath, html) {
	return `
	assembleComponent(${JSON.stringify(compName)}, ${JSON.stringify(compPath)}, function() {${compile(html).code};});
`;
}

function withPrinted(compName, compPath, html, jsGlobalVar) {
	return `
!function(global) {
function assembleComponent(croot, cpath, getRender) {
const gc = global[croot];
const comp = gc.map[cpath];
comp.render = getRender();
}
${buildScriptRender(compName, compPath, html)}
}(${jsGlobalVar});
`;
}

export default function loadVue (name, dirRoot, dirComp, globalVar) {
	NR += 1;
	const COMP_NR = `${COMP}_${NR}:`;
	const compBase = normalizePath(path.resolve(dirRoot, dirComp));
	return {
		name: `load-vue-${name || NR}`, // this name will show up in warnings and errors
		async resolveId ( originalSource, importer ) {
			const source = normalizePath(path.isAbsolute(originalSource)
				? path.resolve(dirRoot, originalSource.replace(rePathAbs, ''))
				: path.resolve(path.dirname(importer), originalSource));
			const base = path.basename(source);
			const lcp = getLcp([
				compBase,
				source,
			]).join('/');
			// this.error(JSON.stringify({compBase, source, originalSource, lcp, importer, base, same: lcp === compBase}, null, 2));
			if (lcp !== compBase) return null;
			// const pCss  = path.join(source, `${base}.css` );
			// const pHtml = path.join(source, `${base}.html`);
			const pJs   = path.join(source, `${base}.js`  );
			let css, html, js;
			await Promise.all([
				// css and html are optional
				// fs.access(pCss , acm).then(() => css  = true, e => css  = e),
				// fs.access(pHtml, acm).then(() => html = true, e => html = e),
				fsp.access(pJs  , acm).then(() => js   = true, e => js   = e),
			]);
			if (js === true) {
				return COMP_NR + pJs; // this signals that rollup should not ask other plugins or check the file system to find this id
			} else if (js) {
				this.error(`LoadVue: could not load js - ${js}`);
			}
			return null; // other ids should be handled as usually
		},
		async load ( id ) {
			if (!id.startsWith(COMP_NR)) return null;
			// other ids should be handled as usually
			// throw new Error(`LoadVue: load() not implemented for ${JSON.stringify(id)}`);
			const pJs = id.substr(COMP_NR.length);
			const source = path.dirname(pJs);
			const base = path.basename(source);
			const pHtml = path.join(source, `${base}.html`);
			const pCss  = path.join(source, `${base}.css` );
			const compPath = path.relative(compBase, source);
			let fJs  , eJs  ;
			let fHtml, eHtml;
			let fCss , eCss ;
			await Promise.all([
				fsp.readFile(pJs  , fsOpt).then(f => fJs   = f, e => eJs   = e),
				fsp.readFile(pHtml, fsOpt).then(f => fHtml = f, e => eHtml = e),
				fsp.readFile(pCss , fsOpt).then(f => fCss  = f, e => eCss  = e),
			]);
			if (eJs) {
				this.error(`LoadVue: could not load js - ${eJs}`);
				return null;
			}
			let render = fJs;
			if (fHtml) {
				render += withPrinted(name, compPath, fHtml, globalVar);
			}
			render += `\nexport default ${globalVar}[${JSON.stringify(name)}].map[${JSON.stringify(compPath)}]`;
			return render;
		}
	};
}

function loadVueInternal ({js, html, css, globalVar}) {
	return {
		name: 'load-vue-internal',
		resolveId (source) {
			switch (source) {
				case 'css' : return 'css' ;
				case 'html': return 'html';
				case 'js'  : return 'js'  ;
				default:
					this.error(`Invalid id to load as a Vue Component part (${JSON.stringify(source)})`);
					return null;
			}
		},
		load ( id ) {

		}
	}
}
