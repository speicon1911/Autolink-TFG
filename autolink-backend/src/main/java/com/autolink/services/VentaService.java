package com.autolink.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.autolink.persistence.repositories.VentaRepository;

@Service
public class VentaService {

	@Autowired
	private VentaRepository ventaRepository;
}
