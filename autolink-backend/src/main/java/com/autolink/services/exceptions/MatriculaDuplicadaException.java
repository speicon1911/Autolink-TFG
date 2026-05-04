package com.autolink.services.exceptions;

public class MatriculaDuplicadaException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public MatriculaDuplicadaException(String matricula) {
        super("El vehículo con matrícula " + matricula + " ya existe en el sistema.");
    }
}
