package com.autolink.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.autolink.services.VentaService;

@RestController
@RequestMapping("/ventas")
public class VentaController {

	@Autowired
	private VentaService ventaService;
}
