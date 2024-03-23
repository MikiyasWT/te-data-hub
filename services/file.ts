import api from "./api"


//export file to csv
export interface exportCSVPayload{

}

export async function exportCSV() {
    try {
        return await api.get('/file/exportCsv')
    } catch (error) {
       console.error('Unable to export file to csv :', error);
       throw error;
    }
}

//print  File to PDF
export interface printPayload{

}

export async function print() {
    try {
        return await api.get('/file/printPdf')
    } catch (error) {
       console.error('Unable to export file to PDF :', error);
       throw error;
    }
}

//export file to excel
export interface exportExcelPayload{

}

export async function exportExcel() {
    try {
        return await api.get('/file/exportExcel')
    } catch (error) {
       console.error('Unable to export file to excel :', error);
       throw error;
    }
}
