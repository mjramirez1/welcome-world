// Módulos
const http = require('http')
const url = require('url')
const fs = require('fs')

// Server
http.createServer(function (req, res) {
    const parametros = url.parse(req.url, true).query
    console.log(url.parse(req.url, true))
    const nombreArchivo = parametros.archivo
    const contenidoArchivo = parametros.contenido
    const nuevoNombreArchivo = parametros.nuevoNombre

    // Crear archivo
    if (req.url.includes('/crear')) {
        fs.stat(`${nombreArchivo}`, function (err) {
            if (err == null) {
                res.write("El archivo existe")
                res.end()
            } else if (err.code == 'ENOENT') {
                fs.writeFile(nombreArchivo, `El archivo fue creado con fecha: ${new Date} \n ${contenidoArchivo}`, 'utf-8', (errWrite) => {
                    if (errWrite) {
                        res.write('Error, no se pudo crear el archivo')
                        res.end()
                    } else {
                        res.write('Archivo creado con éxito!')
                        res.end()
                    }
                })
            } else {
                res.write("ERROR")
                res.end()
            }
        })
    }

    // Leer archivo
    if (req.url.includes('/leer')) {
        fs.readFile(nombreArchivo, (err, data) => {
            if (err) {
                res.write('El archivo que intentas leer no existe. Intenta con otro nombre')
                res.end()
            } else {
                res.write(`El archivo solicitado es: ${nombreArchivo} \n Su contenido es: \n ${data}`)
                res.end()
            }
        })
    }

    // Renombrar  archivo
    if (req.url.includes('/renombrar')) {
        fs.rename(nombreArchivo, nuevoNombreArchivo, (err, data) => {
            if (err) {
                res.write('El archivo que intentas renombrar no existe')
                res.end()
            } else {
                res.write(`El archivo ${nombreArchivo} ha sido renombrado como ${nuevoNombreArchivo}`)
                res.end()
            }
        })
    }

    // Eliminar archivo
    if (req.url.includes('/eliminar')) {

        fs.unlink(nombreArchivo, (err, data) => {
            if (err) {
                res.write('El archivo que intentas eliminar no existe.')
                res.end()
            } else {
                res.write(`Tu solicitud para eliminar el archivo ${nombreArchivo} se está procesando...`)
                setTimeout(() => {
                    res.write(`Archivo ${nombreArchivo} eliminado con éxito!`)
                    res.end()
                }, 3000)

            }
        })

    }
}).listen(8080, () => console.log('Escuchando el puerto 8080'))