/**
 * FAAX Imóveis — pré-cadastro de interessados em loteamento
 *
 * CONFIGURAÇÃO:
 * 1. Crie/abra sua planilha Google Sheets.
 * 2. Copie o ID entre /d/ e /edit na URL da planilha.
 * 3. Cole o ID em SPREADSHEET_ID abaixo.
 * 4. Publique como Aplicativo da web (executar como você).
 */

const SPREADSHEET_ID = "COLE_AQUI_O_ID_DA_PLANILHA";
const SHEET_NAME = "Inscricoes";

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, message: "Nenhum dado recebido." });
    }

    const data = JSON.parse(e.postData.contents);

    // Validação no servidor: não confiar apenas na validação do formulário.
    const nome = cleanText(data.nome, 120);
    const whatsapp = cleanText(data.whatsapp, 25);
    const email = cleanText(data.email, 160);
    const origem = cleanText(data.origem || "Site FAAX", 80);

    if (nome.length < 3) return jsonResponse({ ok: false, message: "Nome inválido." });
    if (whatsapp.replace(/\D/g, "").length < 10) return jsonResponse({ ok: false, message: "WhatsApp inválido." });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ ok: false, message: "E-mail inválido." });
    }

    if (SPREADSHEET_ID === "COLE_AQUI_O_ID_DA_PLANILHA") {
      throw new Error("Configure SPREADSHEET_ID antes de publicar.");
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      let sheet = spreadsheet.getSheetByName(SHEET_NAME);
      if (!sheet) {
        sheet = spreadsheet.insertSheet(SHEET_NAME);
        sheet.appendRow(["Data da inscrição", "Nome completo", "WhatsApp", "E-mail", "Origem"]);
        sheet.setFrozenRows(1);
      } else if (sheet.getLastRow() === 0) {
        sheet.appendRow(["Data da inscrição", "Nome completo", "WhatsApp", "E-mail", "Origem"]);
        sheet.setFrozenRows(1);
      }

      // Prefixo apostrofo evita que entradas iniciadas por =, +, - ou @ sejam interpretadas como fórmula.
      sheet.appendRow([
        new Date(),
        safeCellText(nome),
        safeCellText(whatsapp),
        safeCellText(email),
        safeCellText(origem)
      ]);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse({ ok: true, message: "Inscrição registrada." });
  } catch (err) {
    console.error(err);
    return jsonResponse({ ok: false, message: "Não foi possível registrar a inscrição." });
  }
}

function doGet() {
  return jsonResponse({ ok: true, message: "Endpoint de inscrições FAAX ativo." });
}

function cleanText(value, maxLength) {
  return String(value == null ? "" : value).replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, maxLength);
}

function safeCellText(value) {
  const text = String(value == null ? "" : value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse(object) {
  return ContentService
    .createTextOutput(JSON.stringify(object))
    .setMimeType(ContentService.MimeType.JSON);
}
