// src/components/ui/button.test.tsx
// Exemplo de testes para componente React

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

// ============================================
// TESTES DE RENDERIZAÇÃO
// ============================================
describe('Button - Renderização', () => {
  it('deve renderizar com texto correto', () => {
    render(<Button>Clique aqui</Button>);
    
    const button = screen.getByRole('button', { name: /clique aqui/i });
    expect(button).toBeInTheDocument();
  });

  it('deve renderizar com children customizado', () => {
    render(
      <Button>
        <span>Ícone</span>
        <span>Texto</span>
      </Button>
    );
    
    expect(screen.getByText('Ícone')).toBeInTheDocument();
    expect(screen.getByText('Texto')).toBeInTheDocument();
  });
});

// ============================================
// TESTES DE VARIANTES
// ============================================
describe('Button - Variantes', () => {
  it('deve aplicar variante default por padrão', () => {
    render(<Button>Botão</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary');
  });

  it('deve aplicar variante destructive', () => {
    render(<Button variant="destructive">Deletar</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');
  });

  it('deve aplicar variante outline', () => {
    render(<Button variant="outline">Cancelar</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border');
  });

  it('deve aplicar variante ghost', () => {
    render(<Button variant="ghost">Sutil</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-accent');
  });
});

// ============================================
// TESTES DE TAMANHOS
// ============================================
describe('Button - Tamanhos', () => {
  it('deve aplicar tamanho default por padrão', () => {
    render(<Button>Botão</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-10');
  });

  it('deve aplicar tamanho small', () => {
    render(<Button size="sm">Pequeno</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-9');
  });

  it('deve aplicar tamanho large', () => {
    render(<Button size="lg">Grande</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-11');
  });

  it('deve aplicar tamanho icon', () => {
    render(<Button size="icon">🔍</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-10', 'w-10');
  });
});

// ============================================
// TESTES DE INTERAÇÃO
// ============================================
describe('Button - Interação', () => {
  it('deve chamar onClick quando clicado', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    
    render(<Button onClick={handleClick}>Clique</Button>);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onClick múltiplas vezes', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    
    render(<Button onClick={handleClick}>Clique</Button>);
    
    const button = screen.getByRole('button');
    await user.click(button);
    await user.click(button);
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(3);
  });

  it('não deve chamar onClick quando desabilitado', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    
    render(<Button onClick={handleClick} disabled>Clique</Button>);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });
});

// ============================================
// TESTES DE ESTADO DISABLED
// ============================================
describe('Button - Estado Disabled', () => {
  it('deve renderizar como desabilitado', () => {
    render(<Button disabled>Desabilitado</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('deve ter opacidade reduzida quando desabilitado', () => {
    render(<Button disabled>Desabilitado</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('deve ter pointer-events-none quando desabilitado', () => {
    render(<Button disabled>Desabilitado</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('disabled:pointer-events-none');
  });
});

// ============================================
// TESTES DE ACESSIBILIDADE
// ============================================
describe('Button - Acessibilidade', () => {
  it('deve ser acessível via teclado', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    
    render(<Button onClick={handleClick}>Acessível</Button>);
    
    const button = screen.getByRole('button');
    button.focus();
    
    expect(button).toHaveFocus();
    
    // Simula Enter
    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalled();
  });

  it('deve ter role="button"', () => {
    render(<Button>Botão</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('deve aceitar aria-label customizado', () => {
    render(<Button aria-label="Fechar modal">X</Button>);
    
    const button = screen.getByRole('button', { name: /fechar modal/i });
    expect(button).toBeInTheDocument();
  });
});

// ============================================
// TESTES DE PROPS CUSTOMIZADAS
// ============================================
describe('Button - Props Customizadas', () => {
  it('deve aceitar className customizado', () => {
    render(<Button className="custom-class">Botão</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('deve aceitar type="submit"', () => {
    render(<Button type="submit">Enviar</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('deve aceitar data attributes', () => {
    render(<Button data-testid="custom-button">Botão</Button>);
    
    const button = screen.getByTestId('custom-button');
    expect(button).toBeInTheDocument();
  });
});

// ============================================
// TESTES DE SNAPSHOT (OPCIONAL)
// ============================================
describe('Button - Snapshots', () => {
  it('deve corresponder ao snapshot - variante default', () => {
    const { container } = render(<Button>Default</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('deve corresponder ao snapshot - variante destructive', () => {
    const { container } = render(<Button variant="destructive">Deletar</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });
});
