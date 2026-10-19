# Site de pré-cadastro de terrenos — FAAX Imóveis

Este pacote contém:
- `index.html`: site responsivo com visual preto/vermelho neon e formulário.
- `Code.gs`: endpoint Google Apps Script que grava as inscrições no Google Sheets.

## Antes de publicar

O formulário coleta nome completo e WhatsApp (obrigatórios) e e-mail (opcional). O site exige consentimento para contato. O pré-cadastro não é reserva nem promessa de preço, disponibilidade ou condição de pagamento.

### 1. Criar a planilha
1. Crie uma planilha no Google Sheets.
2. Copie o ID da URL. Exemplo: em `https://docs.google.com/spreadsheets/d/ABC123/edit`, o ID é `ABC123`.
3. A planilha pode começar vazia; o script criará a aba `Inscricoes` e os cabeçalhos automaticamente.

### 2. Publicar o Apps Script
1. Acesse https://script.google.com/ e crie um projeto.
2. Apague o conteúdo inicial e cole o código de `Code.gs`.
3. Substitua `COLE_AQUI_O_ID_DA_PLANILHA` pelo ID real da planilha.
4. Salve.
5. Clique em **Implantar → Nova implantação**.
6. Selecione o tipo **Aplicativo da web**.
7. Em **Executar como**, escolha sua conta.
8. Em **Quem tem acesso**, escolha a opção pública disponível para permitir que visitantes enviem o formulário. Em contas corporativas, essa opção pode estar bloqueada por política do administrador.
9. Clique em **Implantar**, autorize as permissões e copie a URL que termina em `/exec`.

Não compartilhe o acesso de edição da planilha. A implantação pública permite que qualquer pessoa que conheça o endpoint tente enviar dados; por isso, revise os cadastros, monitore abuso e não use o formulário para informações sensíveis. Para uma campanha de grande volume, adicione CAPTCHA ou outro controle anti-spam antes de divulgar amplamente.

### 3. Conectar o site à planilha
1. Abra `index.html` em um editor de texto.
2. Encontre esta linha:
   `const SCRIPT_URL = "COLE_AQUI_A_URL_DO_APPS_SCRIPT";`
3. Substitua o texto dentro das aspas pela URL `/exec` copiada na etapa anterior.
4. Salve.

O site usa `fetch` em modo `no-cors`, pois o Apps Script pode não liberar a resposta para o navegador. Assim, o navegador não consegue confirmar tecnicamente se a gravação foi concluída; a mensagem após o envio indica que a solicitação foi enviada, não uma confirmação auditável de gravação. Faça o teste descrito abaixo antes de divulgar.

### 4. Publicar no GitHub Pages
1. Crie um repositório no GitHub, por exemplo `inscricao-loteamento-faax`.
2. Envie `index.html` para a raiz do repositório. O `Code.gs` pode ficar guardado localmente ou em repositório privado; ele não precisa estar no site público.
3. Abra **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione a branch `main` e a pasta `/(root)`, depois salve.
6. Aguarde a publicação e abra o endereço exibido em Pages.

### 5. Testar antes de anunciar
1. Abra o link publicado em uma janela anônima.
2. Envie um cadastro de teste com seus próprios dados.
3. Abra a planilha e confirme que uma nova linha apareceu na aba `Inscricoes`.
4. Teste também o envio sem e-mail e a validação de WhatsApp.
5. Se não aparecer a linha, confira o ID da planilha, a URL `/exec`, as permissões da implantação e o histórico de execuções no Apps Script.

## Privacidade e LGPD
- Informe claramente a finalidade do cadastro e quem é o responsável pelo tratamento.
- Disponibilize um aviso de privacidade com canal de contato, prazo/critério de retenção e forma de solicitar acesso, correção ou exclusão.
- Restrinja o acesso à planilha às pessoas da equipe que realmente precisam.
- Não colete CPF, documentos ou outros dados desnecessários nesta etapa.
- O texto padrão do formulário é um ponto de partida e deve ser revisado pela FAAX antes de entrar em produção.

## Observação importante sobre confirmação
O endpoint é simples e não inclui CAPTCHA, limite por IP ou confirmação verificável pelo navegador. Para uma campanha pública, especialmente com anúncios, considere adicionar anti-spam e um mecanismo de confirmação do registro antes de considerar o site pronto para produção.
