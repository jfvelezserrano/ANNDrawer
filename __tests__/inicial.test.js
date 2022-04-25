const initializeDrawSettings = require('../js/neurotronik');
test('Los ajustes iniciales son los predeterminados', () => {
    expect(initializeDrawSettings()).toBe(3);
});