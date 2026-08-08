// Проверка: в tests/ не должно быть ни одного waitForTimeout — это антипаттерн
// (ждёт вслепую фиксированное время вместо конкретного условия).
// Падает с ненулевым exit code, если находит совпадение — годится и для CI.

const fs = require('fs');
const path = require('path');

const testsDir = path.join(__dirname, '..', 'tests');
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.spec.ts'));

let found = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(testsDir, file), 'utf-8');
  if (content.includes('waitForTimeout')) {
    found.push(file);
  }
}

if (found.length > 0) {
  console.error('waitForTimeout найден в файлах:', found.join(', '));
  process.exit(1);
}

console.log('OK: waitForTimeout не найден ни в одном тесте.');
process.exit(0);
