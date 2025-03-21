const { dialog } = require('electron');
const XLSX = require('xlsx');
const pptxgen = require('pptxgenjs');
const { Document } = require('docx');
const fs = require('fs');

class DocumentHandler {
  static async createExcel() {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([['', '', ''], ['', '', '']]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    const filePath = await dialog.showSaveDialog({
      filters: [{ name: 'Excel Files', extensions: ['xlsx'] }]
    });

    if (!filePath.canceled) {
      XLSX.writeFile(workbook, filePath.filePath);
      return filePath.filePath;
    }
  }

  static async createPowerPoint() {
    const pres = new pptxgen();
    pres.addSlide();
    
    const filePath = await dialog.showSaveDialog({
      filters: [{ name: 'PowerPoint Files', extensions: ['pptx'] }]
    });

    if (!filePath.canceled) {
      await pres.writeFile({ fileName: filePath.filePath });
      return filePath.filePath;
    }
  }

  static async createWord() {
    const doc = new Document();
    
    const filePath = await dialog.showSaveDialog({
      filters: [{ name: 'Word Files', extensions: ['docx'] }]
    });

    if (!filePath.canceled) {
      const buffer = await Packer.toBuffer(doc);
      fs.writeFileSync(filePath.filePath, buffer);
      return filePath.filePath;
    }
  }
}

module.exports = DocumentHandler; 