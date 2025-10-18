import { vi } from 'vitest';

// Mock Firebase
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  where: vi.fn(),
}));

// Mock canvas APIs
const mockCanvasContext = {
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  arc: vi.fn(),
  fillText: vi.fn(),
  strokeText: vi.fn(),
};

const mockCanvas = {
  getContext: vi.fn(() => mockCanvasContext),
  width: 800,
  height: 600,
  toDataURL: vi.fn(() => 'data:image/png;base64,mock'),
  toBlob: vi.fn((callback) => callback(new Blob())),
};

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: mockCanvas.getContext,
});

Object.defineProperty(HTMLCanvasElement.prototype, 'toDataURL', {
  value: mockCanvas.toDataURL,
});

Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
  value: mockCanvas.toBlob,
});

// Mock WebGL
const mockWebGLContext = {
  createShader: vi.fn(),
  shaderSource: vi.fn(),
  compileShader: vi.fn(),
  createProgram: vi.fn(),
  attachShader: vi.fn(),
  linkProgram: vi.fn(),
  useProgram: vi.fn(),
  getUniformLocation: vi.fn(),
  uniformMatrix4fv: vi.fn(),
  enable: vi.fn(),
  clear: vi.fn(),
  viewport: vi.fn(),
};

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: function(contextType: string) {
    if (contextType === 'webgl' || contextType === 'experimental-webgl') {
      return mockWebGLContext;
    }
    return mockCanvasContext;
  },
});

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => 1);
global.cancelAnimationFrame = vi.fn();

// Mock performance.now
global.performance = {
  ...global.performance,
  now: vi.fn(() => Date.now()),
};

// Mock fetch
global.fetch = vi.fn();

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});