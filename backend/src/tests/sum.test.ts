// Función simple para sumar dos números
function sum(a: number, b: number): number {
  return a + b;
}

// Prueba unitaria para la función sum
test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
