# Marvel challenge

The app is written in react + typescript and is launched with vite. For the tests we are using testing-library and jest.
The app display information fetched from an Marvel API to display a list of characters from Marvel and detailed info when clicked on each, they can also be added to the favourite list or filtered in the search box.

## Installation

Installation

```bash
npm install
```

## Usage

To run the app in development mode url: http://localhost:5173/

```bash
npm run dev
```

To run the app in production mode url: http://127.0.0.1:8080

```bash
npm install http-server
npm run build
http-server dist
```

Or on github: https://github.com/marta0garcia0/marvel_

To execute tests

```bash
npm run test
```

## Architecture

SPA with React managing client-side rendering, handles routing using react-router-dom, state management with Context and build tool Vite

```
/src
  ├── /assets
  │    └── (Images)
  ├── /components
  │    └── (Reusable components)
  ├── /pages
  │    └── (Main components for a page mapped with routes)
  ├── /context
  │    └── (Context to handle global state)
  ├── /services
  │    └── (Connection logic with external APIs)
  ├── /styles
  │    └── (global styles)
  ├── App.tsx
  ├── index.tsx

```

For the filter there is a bouncing time of 1 second to limit the number of request, it can be changed in the constants file
There is a limit of request to 50 items also in the constant file

The context storages the list of items without filter so the data is not rerendered
when the filter is removed
