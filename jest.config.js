import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Caminho para o app Next.js
  dir: './',
});

const customJestConfig = {
  // Setup após o ambiente ser criado
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Ambiente de testes (jsdom simula o navegador)
  testEnvironment: 'jest-environment-jsdom',
  
  // Mapeia os aliases do TypeScript (@/...)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Arquivos para calcular cobertura
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
  ],
  
  // Padrões de arquivos de teste
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  
  // Ignora node_modules e .next
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};

export default createJestConfig(customJestConfig);

