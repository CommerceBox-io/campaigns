# Campaigns

A JavaScript library for dynamically loading and displaying campaign content from the Prism API.

## Overview

The Campaigns library fetches slider content from the Prism API and injects it into specified DOM elements on your webpage. It handles user identification through UUIDs and supports both guest and registered user modes.

## Installation

```bash
npm install
```

## Usage

### Basic Implementation

```javascript
import Campaigns from 'campaigns-core'

document.addEventListener("DOMContentLoaded", () => {
    new Campaigns({website: "3"});
});
```

### Configuration Options

The `Campaigns` constructor accepts the following options:

- `user` (string, optional): User identifier. Defaults to "guest"
- `website` (string, optional): Website identifier for targeting specific campaigns

### Examples

```javascript
// Guest user with website targeting
new Campaigns({website: "3"});

// Registered user
new Campaigns({user: "user123", website: "3"});

// Guest user only
new Campaigns({user: "guest"});
```

## Features

- **Automatic User Management**: Generates and manages guest UUIDs in localStorage
- **Dynamic Content Injection**: Automatically injects campaign content into specified DOM positions
- **Error Handling**: Graceful error handling for API failures
- **Flexible Configuration**: Supports both guest and registered user modes

## API Endpoint

The library connects to: `https://prism.commercebox.io/api/v1/slider`

## Build

```bash
npm run build
```

This will create a production bundle using Webpack.

## Development

The project uses:
- Webpack for bundling
- Babel for ES6+ transpilation
- Sass for styling
- Lodash for utilities

## License

MIT