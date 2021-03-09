# Interview Test HiPlatform

Este projeto usa o framework Vue.js v3, mas ele usa minha arquitetura própria que pode ser encontrado neste link: [arijs/vue-next-example](https://github.com/arijs/vue-next-example).

## Arquitetura sem build

Ele é uma arquitetura que permite você desenvolver um projeto sem nenhuma ferramenta de build (sem webpack, etc). Hoje em dia já foram criadas novas ferramentas que suprem a necessidade de algo melhor que o webpack, como Snowpack e Vite. Também o fato de hoje em dia os navegadores já carregarem módulos no formato ESM (EcmaScript Modules). Mas antigamente era mais difícil.

Quando o projeto é rodado sem build, cada componente é carregado assincronamente (e preguiçosamente) somente no momento que ele é necessário. Se meu projeto tiver 1000 componentes mas a página usar apenas 10, somente estes 10 serão carregados.

Além disso, como o projeto não tem build, como a página sabe quais componentes carregar? Ela descobre no momento em que eles são chamados dentro dos templates. Se o componente não foi carregado ainda (e não está no meio do carregamento), então a página carrega o js, o html e o css do template. O css é adicionado na página com uma tag `<link>` normal.

Já o html é lido como string e colocado como a propriedade `template` do objeto js do componente. Então esse objeto é registrado como um componente no Vue para que ele possa ser renderizado.

Apesar de interessante do ponto de vista técnico, obviamente não é a melhor forma de fazer um site que ficará disponível para acesso pelo público. Por isso, eu criei um sistema capaz de pré-renderizar todas as páginas de um site feito com essa arquitetura, que está neste link: [arijs/vue-prerender](https://github.com/arijs/vue-prerender).

## Pré-renderização

A técnica de pré-renderizar, também conhecida como Static Site Generator (SSG), pega as páginas e componentes do seu framework e gera uma string com o html inteiro da sua página. Se sua página não tiver interação, você poderia simplesmente usar esse html sem nenhum javascript.

Mas as páginas possuem interação praticamente sempre. Por isso, os componentes também são carregados no front-end e eles 'hidratam' o html que já está na página com os eventos e etc. Se esses componentes usaram dados externos no prerender, esses mesmos dados precisam estar disponíveis no render inicial, sem ter que esperar serem carregados.

No prerender, além de gerar o html do conteúdo, o sistema junta todos os componentes que foram usados e insere suas partes na estrutura do html: adiciona os arquivos `.css` no `<head>`, chama os arquivos `.js` e compila os arquivos `.html` em funções de Render usando o compilador de template do Vue, e adiciona essas funções no html.

Também, os dados externos que os componentes chamaram através de serviços são inseridos na página como JSON em uma variável que é usada depois pra hidratar os componentes.

## Bibliotecas

Eu uso várias funções da minha biblioteca pessoal que eu chamo [arijs/front-end](https://github.com/arijs/front-end). Ela tem funções pra rodar no frontend e pelo Node.js, muitas delas rodam nos dois ambientes sem modificação. Essa mesma biblioteca é usada pelo sistema de prerender.

Para saber como inserir todas essas partes no html, o prerender precisa de um parser de html. Eu criei meu próprio parser, que está neste link: [arijs/stream-xml-parser](https://github.com/arijs/stream-xml-parser).

Além de transformar uma string de html em um AST (Abstract Syntax Tree, Árvore de Sintaxe Abstrata), esse parser tem uma funcionalidade muito bacana pra localizar os elementos que precisam ser modificados. Essa funcionalidade está descrita neste link: [docs/tree-matcher.md](https://github.com/arijs/stream-xml-parser/blob/master/docs/tree-matcher.md).

Pra eu poder utilizar o [arijs/front-end](https://github.com/arijs/front-end) em outros formatos além que o ESM, eu também precisei fazer algumas mudanças no gerador de módulos UMD do BabelJS. Essas mudanças estão neste link: [arijs/babel](https://github.com/arijs/babel/tree/release-arijs).

Eu também utilizo minha própria biblioteca pra ler a lista de arquivos de um diretório pelo Node.js. Essa biblioteca está neste link: [arijs/dir-files](https://github.com/arijs/dir-files).

## Estratégia inicial do projeto

No início do desenvolvimento deste projeto, eu queria utilizar o Vite, mas mantendo a estrutura dos componentes deste projeto - ou seja, usando três arquivos (".html", ".js" e ".css") em vez do formato padrão SFC (Single File Component, ".vue"). Para isso, seria necessário fazer um plugin do Vite que tem a mesma estrutura que um plugin do Rollup.

Porém, depois de algumas horas nesse esforço, eu concluí que não seria possível compilar os templates em html em Render Functions, porque o compilador do Vue gera um código que utiliza a declaração `with () {}` do javascript, mas ela é proibida pelo modo `strict` do javascript que é usado nos módulos ESM.

Se tivesse dado certo, minha idéia seria poder usar os mesmos componentes desta estrutura atual dentro do Vite. Seria necessário ter um html de estrutura diferente pro Vite e pra minha arquitetura, e provavelmente alguns arquivos javascript também. Mas a ideia era reutilizar os mesmos componentes.

## Como rodar

```bash
$ git clone git@github.com:rhengles/interview-test.git

$ cd interview-test

$ git checkout hiplatform

$ npm install

# pra iniciar o servidor local no endereço http://localhost:8070/
$ npm start

# pra fazer o prerender das páginas
$ npm run prerender
```
