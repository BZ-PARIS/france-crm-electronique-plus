# Architecture Overview

The application now uses Webpack Module Federation to split the codebase into two bundles:

- **core** – main CRM features.
- **analytics** – optional analytics dashboard loaded as a remote module.

This improves maintainability by allowing independent deployment of the analytics
module. See `webpack.config.js` for the federation setup.
