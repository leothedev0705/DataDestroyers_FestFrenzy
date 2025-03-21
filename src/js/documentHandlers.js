const { dialog } = require('electron');
const XLSX = require('xlsx');
const pptxgen = require('pptxgenjs');
const { Document, Packer, Paragraph } = require('docx');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const os = require('os');

class DocumentHandler {
    static getTempFilePath(extension) {
        return path.join(os.tmpdir(), `new_document_${Date.now()}.${extension}`);
    }

    static openFile(filePath) {
        // Use the system's default application to open the file
        switch (process.platform) {
            case 'win32':
                exec(`start "" "${filePath}"`);
                break;
            case 'darwin':
                exec(`open "${filePath}"`);
                break;
            case 'linux':
                exec(`xdg-open "${filePath}"`);
                break;
        }
    }

    static async createExcel() {
        try {
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.aoa_to_sheet([['', '', ''], ['', '', '']]);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            
            const tempFilePath = this.getTempFilePath('xlsx');
            XLSX.writeFile(workbook, tempFilePath);
            this.openFile(tempFilePath);
            
            return { success: true, filePath: tempFilePath };
        } catch (error) {
            console.error('Error creating Excel file:', error);
            return { success: false, error: error.message };
        }
    }

    static async createPowerPoint() {
        try {
            const pres = new pptxgen();
            const slide = pres.addSlide();
            slide.addText('New Presentation', {
                x: 1,
                y: 1,
                fontSize: 24,
                color: '363636'
            });
            
            const tempFilePath = this.getTempFilePath('pptx');
            await pres.writeFile({ fileName: tempFilePath });
            this.openFile(tempFilePath);
            
            return { success: true, filePath: tempFilePath };
        } catch (error) {
            console.error('Error creating PowerPoint file:', error);
            return { success: false, error: error.message };
        }
    }

    static async createWord() {
        try {
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: [
                        new Paragraph({
                            children: []
                        })
                    ],
                }],
            });
            
            const tempFilePath = this.getTempFilePath('docx');
            const buffer = await Packer.toBuffer(doc);
            fs.writeFileSync(tempFilePath, buffer);
            this.openFile(tempFilePath);
            
            return { success: true, filePath: tempFilePath };
        } catch (error) {
            console.error('Error creating Word file:', error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = DocumentHandler; 