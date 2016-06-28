/*global document, nunjucks*/

import templatesExample from './example/templates';

function renderTemplate() {
	var loader = new nunjucks.PrecompiledLoader(templatesExample);
	var env = new nunjucks.Environment([loader]);
	var output = env.render('index.html', {
		SOME_VAR: 'CONTEXT VALUE',
		SOME_FUNCTION: function() {
			return 'CONTEXT FUNCTION';
		}
	});

	var div = document.getElementById('template-example');

	div.innerHTML = output;
}

export default renderTemplate;
