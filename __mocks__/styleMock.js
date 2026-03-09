// Mock all CSS imports in tests
const mockCssModule = new Proxy({}, {
  get() {
    return '';
  }
});

export default mockCssModule;
