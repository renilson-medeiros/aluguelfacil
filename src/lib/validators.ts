// src/lib/validators.ts
// Validadores e sanitizadores centralizados

/**
 * Valida CPF brasileiro
 */
export function validarCPF(cpf: string): boolean {
    const cleanCpf = cpf.replace(/[^\d]/g, '');

    if (cleanCpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += Number(cleanCpf[i]) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== Number(cleanCpf[9])) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += Number(cleanCpf[i]) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== Number(cleanCpf[10])) return false;

    return true;
}

/**
 * Valida telefone brasileiro (celular ou fixo)
 */
export function validarTelefone(telefone: string): boolean {
    const cleanPhone = telefone.replace(/[^\d]/g, '');

    // Aceita 10 dígitos (fixo) ou 11 dígitos (celular)
    if (cleanPhone.length !== 10 && cleanPhone.length !== 11) return false;

    // Verifica se não são todos números iguais
    if (/^(\d)\1+$/.test(cleanPhone)) return false;

    return true;
}

/**
 * Valida CEP brasileiro
 */
export function validarCEP(cep: string): boolean {
    const cleanCep = cep.replace(/[^\d]/g, '');
    return cleanCep.length === 8;
}

/**
 * Valida email
 */
export function validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Valida força da senha
 * Retorna objeto com resultado e mensagem
 */
export function validarSenha(senha: string): { valida: boolean; mensagem: string } {
    if (senha.length < 8) {
        return { valida: false, mensagem: 'A senha deve ter no mínimo 8 caracteres' };
    }

    if (!/[A-Z]/.test(senha)) {
        return { valida: false, mensagem: 'A senha deve conter pelo menos uma letra maiúscula' };
    }

    if (!/[a-z]/.test(senha)) {
        return { valida: false, mensagem: 'A senha deve conter pelo menos uma letra minúscula' };
    }

    if (!/[0-9]/.test(senha)) {
        return { valida: false, mensagem: 'A senha deve conter pelo menos um número' };
    }

    return { valida: true, mensagem: 'Senha forte' };
}

/**
 * Sanitiza string para prevenir XSS
 */
export function sanitizarString(texto: string): string {
    return texto
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/**
 * Formata CPF
 */
export function formatarCPF(cpf: string): string {
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
}

/**
 * Formata telefone
 */
export function formatarTelefone(telefone: string): string {
    const numbers = telefone.replace(/\D/g, '');

    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
}

/**
 * Formata CEP
 */
export function formatarCEP(cep: string): string {
    const numbers = cep.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
}

/**
 * Formata valor monetário
 */
export function formatarMoeda(valor: string | number): string {
    const numericValue = typeof valor === 'string'
        ? parseFloat(valor.replace(/[^\d]/g, '')) / 100
        : valor;

    return numericValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}

/**
 * Converte moeda formatada para número
 */
export function parseMoeda(valorFormatado: string): number {
    const numbers = valorFormatado.replace(/[^\d]/g, '');
    return parseInt(numbers || '0') / 100;
}

/**
 * Valida tamanho de arquivo (em bytes)
 */
export function validarTamanhoArquivo(arquivo: File, maxSizeMB: number): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return arquivo.size <= maxSizeBytes;
}

/**
 * Valida tipo de arquivo
 */
export function validarTipoArquivo(arquivo: File, tiposPermitidos: string[]): boolean {
    return tiposPermitidos.some(tipo => arquivo.type.startsWith(tipo));
}

/**
 * Gera nome de arquivo seguro
 */
export function gerarNomeArquivoSeguro(nomeOriginal: string, userId: string): string {
    const extensao = nomeOriginal.split('.').pop()?.toLowerCase() || 'jpg';
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `${userId}/${timestamp}-${random}.${extensao}`;
}
