# Manual de Utilização – EscalaFácil

## 1. Apresentação

O EscalaFácil é um sistema acadêmico desenvolvido para demonstrar a aplicação de conceitos de Matemática Discreta, especialmente Grafos e Matrizes de Adjacência, na organização de equipes e geração de escalas de trabalho.

O sistema permite cadastrar funcionários, definir disponibilidades, visualizar compatibilidades, gerar escalas automaticamente e armazenar o histórico das escalas criadas.

---

# 2. Acesso ao Sistema

Ao acessar o sistema, será exibida a tela de login.

## Login

1. Informe o e-mail cadastrado.
2. Digite sua senha.
3. Clique em **Entrar**.

Caso ainda não possua uma conta:

1. Clique em **Criar conta**.
2. Informe nome, e-mail e senha.
3. Finalize o cadastro.

---

# 3. Dashboard

Após o login, o usuário será direcionado para o Dashboard.

Nesta tela são exibidas informações gerais do sistema, incluindo:

* Quantidade de funcionários cadastrados;
* Compatibilidades registradas;
* Métricas relacionadas ao grafo;
* Informações sobre o funcionamento do sistema.

O menu lateral permite navegar entre todas as funcionalidades disponíveis.

---

# 4. Cadastro de Funcionários

Acesse a seção **Funcionários**.

## Como cadastrar

1. Clique em **Adicionar Funcionário**.
2. Informe:

   * Nome;
   * Cargo;
   * Disponibilidade de horários.
3. Salve o cadastro.

Os funcionários cadastrados serão utilizados na geração das escalas e na construção do grafo de compatibilidade.

## Excluir funcionário

1. Localize o funcionário desejado.
2. Clique no ícone de exclusão.
3. Confirme a operação na janela exibida.

---

# 5. Matriz de Adjacência

A seção **Matriz** apresenta a representação matemática das relações entre os funcionários.

Cada célula da matriz pode possuir:

* Valor 1: funcionários compatíveis;
* Valor 0: funcionários sem compatibilidade registrada.

A matriz é utilizada como base para os cálculos realizados pelo sistema.

---

# 6. Visualização do Grafo

Na seção **Grafos**, os funcionários são representados por vértices.

As conexões entre eles representam as compatibilidades registradas.

### Elementos do Grafo

* Vértice: funcionário;
* Aresta: relação de compatibilidade;
* Grau do vértice: quantidade de conexões de um funcionário.

Esta visualização auxilia na compreensão dos conceitos de Matemática Discreta aplicados ao projeto.

---

# 7. Geração de Escalas

Acesse a seção **Gerador de Escalas**.

## Passos para gerar uma escala

1. Selecione os funcionários desejados.
2. Clique em **Gerar Escala**.
3. Aguarde o processamento.

O sistema:

* Verifica a disponibilidade dos funcionários;
* Analisa as compatibilidades registradas;
* Calcula o grau de conectividade de cada colaborador;
* Seleciona automaticamente os funcionários mais compatíveis para cada turno.

Após a geração, a escala será exibida na tela e armazenada no histórico.

---

# 8. Histórico

Na seção **Histórico**, é possível visualizar todas as escalas geradas anteriormente.

As informações registradas incluem:

* Data e hora da geração;
* Funcionários considerados;
* Quantidade de conexões encontradas;
* Resultado da escala produzida.

---

# 9. Sugestões

A seção **Sugestões** permite o envio de feedback sobre o sistema.

## Como enviar

1. Informe seu nome.
2. Escreva a sugestão.
3. Clique em **Enviar**.

Além de serem registradas no sistema, as sugestões são encaminhadas automaticamente para o e-mail do administrador.

---

# 10. Menu Mobile

Em dispositivos móveis:

1. Toque no botão de menu localizado no canto superior esquerdo.
2. Selecione a funcionalidade desejada.
3. Toque fora do menu para fechá-lo.

---

# 11. Conceitos Matemáticos Aplicados

O EscalaFácil utiliza os seguintes conceitos de Matemática Discreta:

### Grafos

Representação dos funcionários e suas compatibilidades.

### Vértices

Cada funcionário cadastrado.

### Arestas

Conexões entre funcionários compatíveis.

### Matriz de Adjacência

Representação tabular das relações do grafo.

### Grau do Vértice

Quantidade de conexões de cada funcionário.

Esses conceitos são utilizados pelo sistema para auxiliar na geração automática das escalas.

---

# 12. Encerramento

O EscalaFácil demonstra como conceitos de Matemática Discreta podem ser aplicados em situações reais de organização de equipes e geração de escalas, integrando teoria e prática em uma solução web funcional e intuitiva.
