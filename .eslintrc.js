module.exports = {
  'extends': 'standard',
  'plugins': ['prettier'],
  'env': {
    'browser': true,
    'node': true
  },
  'rules': {
    // Complete List: https://eslint.org/docs/rules/
    'prettier/prettier': 'error',
    'indent': ['error', 4],
    "comma-dangle": [
      "error", {
        "arrays": "always-multiline",
        "exports": "always-multiline",
        "functions": "never",
        "imports": "always-multiline",
        "objects": "always-multiline",
      },
    ]
  },
  // Activate the resolver plugin, required to recognize the 'config' resolver
  settings: {
    'import/resolver': {
        webpack: {},
    },
  },
};
