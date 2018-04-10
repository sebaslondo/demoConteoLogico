/**
 * @fileOverview modulo para el manejo y lectura de archivos
 * @author 
 * 
 */

const fs = require('fs');

function checkContent(programSequence) {
    
    if (programSequence.length === 0) {
        return 'El archivo esta vacio'
    }

    return;
}

function checkFile(err) {

    if (err.code === 'EPERM') {        
        return 'El archivo tiene permisos de lectura';        
    }    

    if (err.code == 'ENOENT') {
        return 'El archivo no existe';        
    }

    return;
}

/**
 * abrir archivos
 * @param {string} path - la ruta del archivo
 * @param callback - un callback. el callback recibe el contenido del archivo: una cadena de caracteres
 */
function openFile(path, callback) {

    fs.readFile(path, 'utf8', function (err, buffer) {

       if (err) { 

            let message = 'Error al abrir el archivo';
            callback(message, null);
            return;
        }

       callback(null, buffer.toString());
    });
}

// nombre: file
module.exports = {
    checkContent,
    checkFile,
    openFile,
};