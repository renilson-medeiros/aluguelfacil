# Plano de Melhoria: Cadastro de Imóveis (Lugo)

## 1. Diagnóstico da Situação Atual

O processo de cadastro atual segue um fluxo linear e "pesado":

1.  **Insert Inicial**: Cria o registro no banco para obter o ID.
2.  **Upload Sequencial**: Sobe as fotos uma por uma para o Storage.
3.  **Update Final**: Atualiza o registro com o array de URLs das fotos.

**Gargalos Identificados:**

- **Sincronia Ineficiente**: O sistema espera cada foto terminar antes de começar a próxima. Se forem 8 fotos, o tempo total é a soma de cada upload.
- **Payload sem Tratamento**: Fotos originais de celular (5-10MB) são pesadas demais para conexões móveis.
- **Sensação de Travamento**: O loading único sem barra de progresso faz o usuário achar que o sistema "morreu".
- **Timeout Rígido**: Embora o timeout de 20s proteja a UI, ele interrompe uploads legítimos de fotos grandes em conexões lentas.

---

## 2. Proposta de Melhoria (Nível Especialista)

### A. Compressão de Imagens no Cliente (Prioridade 1)

Implementar compressão automática antes do upload usando `browser-image-compression`.

- **Benefício**: Reduz fotos de 5MB para ~800KB (90% menos banda).

### B. Upload em Paralelo (`Promise.all`)

Disparar todos os uploads simultaneamente.

- **Benefício**: O tempo total de upload cai para o tempo da foto mais pesada.

### C. Feedback de Progresso (UX Ativa)

Mostrar mensagens como "Enviando fotos (2 de 5)...".

- **Benefício**: Elimina a ansiedade do usuário e a sensação de bug.

### D. Refatoração de Estabilidade

Garantir que falhas em fotos não deixem o formulário bloqueado ou em loop infinito.

---

**Status**: Plano detalhado na pasta `docs/`.
