/**
 * @fileOverview modulo para el manejo y reconocimiento de caracteres
 * @author 
 */

/**
 * Utilidad para remover espacios en blanco
 * @private
 * @param {String} string - secuencia a sanitar
 * @return {string} - linea de caracteres sin espacios
 */
function removeWhiteSpaces(string) {
    return string.replace(/ /g,'');
}

/**
 * Utilidad para retornar un arreglo de lineas de codigo. Una linea se delimita por un salto de linea (\n)
 * @private
 * @param programSequence - la cadena de caracteres que representa al programa
 * @return {[String]} - Un arreglo de cadenas. En donde una posicion en el arreglo, es una linea
 */
function getLines(programSequence) {    
    return programSequence.match(/.+\n/g);
}

/**
 * Verifica si una linea, es una linea estandar de codigo. Una linea estandar, es una linea que termina
 * en ';'
 * @private
 * @param codeLine - la linea de codigo a verificar
 * @return {number} - retorna 1, si la linea es una linea estandar, 0 de lo contrario
 */
function verifyDefaultLine(codeLine) {

    let matched = codeLine.match(/(\s|.*)\/\/.*/g);
    
    if (!matched) {
        
        matched = codeLine.match(/.*;/g);

        if (!matched) {

            return 0;

        } else {

            return 1;
        }        

    } else {

        return 0;
    }
    
}

/**
 * Verifica que una linea contenga la sentencia 'else'
 * @private
 * @param codeLine - la linea de codigo a verificar
 * @return {number} - retorna 1, si la linea contiene la sentencia, 0 de lo contrario
 */
function verifyElseKeyword(codeLine) {

    let matched = codeLine.match(/\s.*else\s{/g);

    if (!matched) {

        return 0;

    } else {

        return 1;
    }
}

/**
 * Verifica que una linea contenga almenos una ocurrencia en el grupo de sentencias 'for, while, if, else if'
 * @private
 * @param codeLine - la linea de codigo a verificar
 * @return {number} - retorna 1, si la linea contiene almenos 1 sentencia del grupo de sentencias, 0 de lo contrario
 */
function verifyCommonKeywords(codeLine) {

    let matched = codeLine.match(/(for|while|if|else if)\s\(.*\)/g);

    if (!matched) {

        return 0;

    } else {

        return 1;
    }
}

/**
 * Verifica que una linea contenga una funcion flecha
 * @private
 * @param codeLine - la linea de codigo a verificar
 * @return {number} - retorna 1, si la linea contiene una funcion flecha, 0 de lo contrario
 */
function verifyArrowFunction(codeLine){

    let count = verifyDefaultLine(codeLine);
    
    if(count === 0) {

        let matched = codeLine.match(/.*=>.*/g);

        if (!matched) {

            return 0;

        } else {

            return 1;
        }

    } else {

        return 0;
    }    
}

/**
 * Verifica que una linea de codigo sea la propiedad de un literal
 * @private
 * @param codeLine - la linea de codigo a verificar
 * @return {number} - retorna 1, si la linea hace parte de un literal, 0 de lo contrario
 */
function verifyLiteralProperties(codeLine){
    let matched = codeLine.match(/.*:\s.+,/g);

    if (!matched) {
        return 0;
    } else {
        return 1;
    }
}

/**
 * Verifica que una linea contenga la palabra clave 'function'
 * @private
 * @param codeLine - la linea de codigo a verificar
 * @return {number} - retorna 1, si la linea contiene una funcion, 0 de lo contrario
 */
function verifyFunctionLine(codeLine) {

    let matched = codeLine.match(/function\s\w+\(.*\)/g);

    if (!matched) {

        return 0;

    } else {
        return 1;
    }
}

/**
 * Verifica y obtiene el nombre de un modulo
 * @private
 * @param codeLines - un arreglo que contenga las lineas de codigo del programa
 * @param index - el indice; la posicion actual que se quiera procesar
 * @return {{nameFound: string, index: number}} - un objeto que contiene el nombre del modulo, en caso tal que lo haya,
 * y el indice, que se posiciona luego de terminar la sentencia completa
 */
function verifyModuleLine(codeLines, index) {

    let codeLine = codeLines[index];
    let matched = codeLine.match(/\/\/\s*nombre:.*/g);
    let nameFound;

    if (!matched) {
        return;
    }

    nameFound = matched[0].split(":")[1];

    if (!nameFound){
        return;
    } 

    index++;
    codeLine = codeLines[index];

    let closingBracketFound = codeLine && !!codeLine.match(/}/g) ;

    while (!closingBracketFound) {

        index++;
        codeLine = codeLines[index];
        closingBracketFound = codeLine && !!codeLine.match(/}/g);
    }

    return {
        nameFound: removeWhiteSpaces(nameFound),
        index: index,
    };
}

/**
 * Obtiene los modulos en una cadena de caracteres, que representa el programa completo.
 * @private
 * @param programSequence - la cadena de caracteres, el programa
 * @return {Array} - un arreglo de objetos. Cada objeto es un modulo. El objeto tendra el nombre del modulo,
 * con su respectiva cantidad de lineas, y funciones
 */
function getModules(programSequence) {

    let lines = getLines(programSequence);

    let functionsCounter = 0;
    let moduleLines = 0;    
    let modulesArray = [];

    for (let index = 0; index < lines.length; index++) {

        let currentLine = lines[index];
        //console.log("Current: " + currentLine);        

        moduleLines += verifyDefaultLine(currentLine);
        moduleLines += verifyCommonKeywords(currentLine);
        moduleLines += verifyArrowFunction(currentLine);
        moduleLines += verifyLiteralProperties(currentLine);
        moduleLines += verifyElseKeyword(currentLine);

        let functionCounter = verifyFunctionLine(currentLine);
        console.log("function", functionCounter);
        functionsCounter += functionCounter;
        moduleLines += functionCounter;

        let moduleInfo = verifyModuleLine(lines, index);

        if (moduleInfo) {

            index = moduleInfo.index;
            moduleLines++;

            let module = {
                name: moduleInfo.nameFound,
                lines: moduleLines,
                functions: functionsCounter,
            };

            console.log("module", module);

            modulesArray.push(module);            
            moduleLines = 0;
            functionsCounter = 0;
        }
    }

    return modulesArray;
}

/**
 * Obtiene la cantidad de lineas de un programa, y la informacion correspondiente a sus modulos que lo componen
 * @param programSequence - la cadena de caracteres, el programa
 * @return {{size: number, modules: Array}} - un objeto. El objeto contiene dos claves, la cantidad de lineas del
 * programa, y un arreglo con la informacion de los modulos que lo componen.
 */
function getProgramSize(programSequence) {

    let modulesArray = getModules(programSequence);
    let totalSize = 0;

    modulesArray.forEach(module => {
        totalSize += module.lines;
    });    

    return {
        size: totalSize,
        modules: modulesArray,
    };
}

// nombre: string
module.exports = {
     getLines,
     verifyDefaultLine,
     verifyFunctionLine,     
     verifyModuleLine,
     verifyArrowFunction,
     verifyLiteralProperties,
     verifyCommonKeywords,
     getModules,
     getProgramSize,
 };