function errorHandler(err, req, res, next) {
    if (err.name === 'No tiene Autorizacion') {
        // jwt authentication error
        return res.status(404).json({message: "usuario no autorizado"})
    }

    if (err.name === 'Validando Error') {
        //  validation error
        return res.status(404).json({message: err})
    }

    // default to 500 server error
    return res.status(500).json(err);
}

module.exports = errorHandler;