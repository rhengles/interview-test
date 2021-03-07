// import './style.css'

// document.querySelector('#app').innerHTML = `
//   <h1>Hello Vite!</h1>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
// `

if (import.meta.hot) {
	import.meta.hot.decline();
}

const nop = () => {};
const deferError = promise => {
	let end = nop;
	promise = promise.catch(e => new Promise((_, reject) => {
		end = () => reject(e);
	}));
	return { promise, end };
};
const raceWin = (list, timeout) => {
	const endList = [];
	list.map(item => {
		const {promise, end} = deferError(item);
		endList.push(end);
		return promise;
	});
	return Promise.race(list.concat(new Promise((_, reject) => {
		setTimeout(reject, timeout, new Error(`O Vue demorou muito pra carregar (${Number(timeout*0.001).toFixed(1)}s)`));
	}))).finally(() => endList.forEach(c => c()));
};
const promiseTimeout = (timeout) => new Promise(resolve => setTimeout(resolve, timeout));

(async () => {

let winner;
try {
	const timeout = promiseTimeout(0);
	winner = await raceWin([
		timeout.then(() => import('https://unpkg.com/vue@3.0.7/dist/vue.runtime.esm-browser.prod.js'))
			.then(Vue => ({Vue, vueSrc: 'unpkg'})),
		timeout.then(() => import('https://cdn.jsdelivr.net/npm/vue@3.0.7/dist/vue.runtime.esm-browser.prod.js'))
			.then(Vue => ({Vue, vueSrc: 'jsdelivr'})),
		timeout.then(() => import('./js/vendor/vue.runtime.esm-browser.prod.js'))
			.then(Vue => ({Vue, vueSrc: 'local'})),
	], 5000);
} catch (e) {
	window.alert(`${e.message}\n\nPor favor tente novamente.`);
}
if (!winner) return;
const {Vue, vueSrc} = winner;
console.log('Load Vue from', vueSrc, Vue);
window.Vue = Vue;

const compFoo = await import('/comp/foo');

})();


