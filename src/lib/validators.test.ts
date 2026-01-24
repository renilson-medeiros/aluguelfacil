// src/lib/validators.test.ts
// Exemplo de testes para funções utilitárias

import {
  validarCPF,
  validarTelefone,
  validarCEP,
  validarEmail,
  validarSenha,
  formatarCPF,
  formatarTelefone,
  formatarCEP,
  formatarMoeda,
} from './validators';

// ============================================
// TESTES DE VALIDAÇÃO DE CPF
// ============================================
describe('validarCPF', () => {
  it('deve validar CPF correto', () => {
    expect(validarCPF('123.456.789-09')).toBe(true);
    expect(validarCPF('111.444.777-35')).toBe(true);
  });

  it('deve aceitar CPF sem formatação', () => {
    expect(validarCPF('12345678909')).toBe(true);
  });

  it('deve rejeitar CPF com todos os dígitos iguais', () => {
    expect(validarCPF('111.111.111-11')).toBe(false);
    expect(validarCPF('000.000.000-00')).toBe(false);
    expect(validarCPF('999.999.999-99')).toBe(false);
  });

  it('deve rejeitar CPF com tamanho incorreto', () => {
    expect(validarCPF('123.456.789')).toBe(false);
    expect(validarCPF('123')).toBe(false);
  });

  it('deve rejeitar CPF com dígitos verificadores incorretos', () => {
    expect(validarCPF('123.456.789-00')).toBe(false);
  });
});

// ============================================
// TESTES DE VALIDAÇÃO DE TELEFONE
// ============================================
describe('validarTelefone', () => {
  it('deve validar telefone celular (11 dígitos)', () => {
    expect(validarTelefone('(11) 98765-4321')).toBe(true);
    expect(validarTelefone('11987654321')).toBe(true);
  });

  it('deve validar telefone fixo (10 dígitos)', () => {
    expect(validarTelefone('(11) 3456-7890')).toBe(true);
    expect(validarTelefone('1134567890')).toBe(true);
  });

  it('deve rejeitar telefone com tamanho incorreto', () => {
    expect(validarTelefone('123')).toBe(false);
    expect(validarTelefone('123456789012')).toBe(false);
  });

  it('deve rejeitar telefone com todos os dígitos iguais', () => {
    expect(validarTelefone('11111111111')).toBe(false);
    expect(validarTelefone('0000000000')).toBe(false);
  });
});

// ============================================
// TESTES DE VALIDAÇÃO DE CEP
// ============================================
describe('validarCEP', () => {
  it('deve validar CEP correto', () => {
    expect(validarCEP('01310-100')).toBe(true);
    expect(validarCEP('12345-678')).toBe(true);
  });

  it('deve aceitar CEP sem formatação', () => {
    expect(validarCEP('01310100')).toBe(true);
  });

  it('deve rejeitar CEP com tamanho incorreto', () => {
    expect(validarCEP('123')).toBe(false);
    expect(validarCEP('123456789')).toBe(false);
  });
});

// ============================================
// TESTES DE VALIDAÇÃO DE EMAIL
// ============================================
describe('validarEmail', () => {
  it('deve validar email correto', () => {
    expect(validarEmail('usuario@example.com')).toBe(true);
    expect(validarEmail('teste.email@dominio.com.br')).toBe(true);
    expect(validarEmail('user+tag@gmail.com')).toBe(true);
  });

  it('deve rejeitar email sem @', () => {
    expect(validarEmail('usuarioexample.com')).toBe(false);
  });

  it('deve rejeitar email sem domínio', () => {
    expect(validarEmail('usuario@')).toBe(false);
  });

  it('deve rejeitar email com espaços', () => {
    expect(validarEmail('usuario @example.com')).toBe(false);
    expect(validarEmail('usuario@example .com')).toBe(false);
  });
});

// ============================================
// TESTES DE VALIDAÇÃO DE SENHA
// ============================================
describe('validarSenha', () => {
  it('deve validar senha forte', () => {
    const resultado = validarSenha('Senha123');
    expect(resultado.valida).toBe(true);
    expect(resultado.mensagem).toBe('Senha forte');
  });

  it('deve rejeitar senha muito curta', () => {
    const resultado = validarSenha('Sen1');
    expect(resultado.valida).toBe(false);
    expect(resultado.mensagem).toContain('mínimo 8 caracteres');
  });

  it('deve rejeitar senha sem letra maiúscula', () => {
    const resultado = validarSenha('senha123');
    expect(resultado.valida).toBe(false);
    expect(resultado.mensagem).toContain('letra maiúscula');
  });

  it('deve rejeitar senha sem letra minúscula', () => {
    const resultado = validarSenha('SENHA123');
    expect(resultado.valida).toBe(false);
    expect(resultado.mensagem).toContain('letra minúscula');
  });

  it('deve rejeitar senha sem número', () => {
    const resultado = validarSenha('SenhaForte');
    expect(resultado.valida).toBe(false);
    expect(resultado.mensagem).toContain('número');
  });
});

// ============================================
// TESTES DE FORMATAÇÃO DE CPF
// ============================================
describe('formatarCPF', () => {
  it('deve formatar CPF completo', () => {
    expect(formatarCPF('12345678909')).toBe('123.456.789-09');
  });

  it('deve formatar CPF parcial', () => {
    expect(formatarCPF('123')).toBe('123');
    expect(formatarCPF('123456')).toBe('123.456');
    expect(formatarCPF('123456789')).toBe('123.456.789');
  });

  it('deve remover caracteres não numéricos', () => {
    expect(formatarCPF('123.456.789-09')).toBe('123.456.789-09');
  });
});

// ============================================
// TESTES DE FORMATAÇÃO DE TELEFONE
// ============================================
describe('formatarTelefone', () => {
  it('deve formatar telefone celular completo', () => {
    expect(formatarTelefone('11987654321')).toBe('(11) 98765-4321');
  });

  it('deve formatar telefone fixo completo', () => {
    expect(formatarTelefone('1134567890')).toBe('(11) 3456-7890');
  });

  it('deve formatar telefone parcial', () => {
    expect(formatarTelefone('11')).toBe('11');
    expect(formatarTelefone('119876')).toBe('(11) 9876');
  });
});

// ============================================
// TESTES DE FORMATAÇÃO DE CEP
// ============================================
describe('formatarCEP', () => {
  it('deve formatar CEP completo', () => {
    expect(formatarCEP('01310100')).toBe('01310-100');
  });

  it('deve formatar CEP parcial', () => {
    expect(formatarCEP('01310')).toBe('01310');
  });
});

// ============================================
// TESTES DE FORMATAÇÃO DE MOEDA
// ============================================
describe('formatarMoeda', () => {
  it('deve formatar número como moeda', () => {
    // Nota: toLocaleString usa espaço não-quebrável (\u00A0) entre R$ e o valor
    expect(formatarMoeda(1000)).toContain('1.000,00');
    expect(formatarMoeda(1234.56)).toContain('1.234,56');
  });

  it('deve formatar string como moeda', () => {
    expect(formatarMoeda('100000')).toContain('1.000,00');
  });

  it('deve formatar zero', () => {
    expect(formatarMoeda(0)).toContain('0,00');
  });

  it('deve formatar valores decimais', () => {
    expect(formatarMoeda(99.99)).toContain('99,99');
  });
});

