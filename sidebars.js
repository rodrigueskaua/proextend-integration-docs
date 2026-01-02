// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introdução',
    },

    {
      type: 'category',
      label: 'Guia de Integração',
      collapsible: true,
      collapsed: true,
      items: [
        'visao-geral',
        'conceitos-fundamentais',
        'autenticacao',
        'fluxo-de-sincronizacao',
        'identificadores-e-codes',
        'postman',
      ],
    },
  ],
};

export default sidebars;
