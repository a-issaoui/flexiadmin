// jest.polyfills.js

// Polyfill for TextEncoder/TextDecoder
const { TextEncoder, TextDecoder } = require('util')

Object.assign(global, { TextDecoder, TextEncoder })

// Mock window.location
if (typeof window !== 'undefined') {
  delete window.location
  window.location = { 
    assign: jest.fn(),
    href: 'http://localhost:3000',
    hostname: 'localhost',
    origin: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
  }
}

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
}

global.localStorage = localStorageMock
global.sessionStorage = localStorageMock

// Mock crypto for any uuid generation
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
    getRandomValues: (arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    }
  }
});

// Mock AbortSignal.timeout if it doesn't exist
if (typeof AbortSignal !== 'undefined' && !AbortSignal.timeout) {
  AbortSignal.timeout = (ms) => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), ms);
    return controller.signal;
  };
}