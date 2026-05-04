package com.autolink.services.exceptions;

public class VehiculoValidationException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public VehiculoValidationException(String message) {
        super(message);
    }
}
