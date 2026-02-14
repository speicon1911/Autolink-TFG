-- Administradores
INSERT INTO persona (nombre, apellidos, DNI, correo, password, tipo_usuario, salario_anual, ciudad_asignada) 
VALUES ('Laura', 'García Ruiz', '12345678A', 'laura.admin@autolink.com', 'admin123', 'ADMINISTRADOR', 45000.00, 'Madrid');

-- Vendedores
INSERT INTO persona (nombre, apellidos, DNI, correo, password, tipo_usuario, telefono) 
VALUES ('Carlos', 'Pérez Gómez', '87654321B', 'carlos.sales@autolink.com', 'vendedor2024', 'VENDEDOR', 600123456);

INSERT INTO persona (nombre, apellidos, DNI, correo, password, tipo_usuario, telefono) 
VALUES ('Elena', 'Martínez Soler', '45678912C', 'elena.vende@autolink.com', 'elena_pass', 'VENDEDOR', 655987654);

-- Clientes
INSERT INTO persona (nombre, apellidos, DNI, correo, password, tipo_usuario) 
VALUES ('Juan', 'López Castro', '11223344D', 'juan.cliente@gmail.com', 'password123', 'CLIENTE');

INSERT INTO persona (nombre, apellidos, DNI, correo, password, tipo_usuario) 
VALUES ('Marta', 'Sánchez Villa', '55667788E', 'marta.sv@yahoo.com', 'marta_secure', 'CLIENTE');

-- Vehiculos
-- Un SUV familiar moderno
INSERT INTO vehiculo (precio, plazas, potencia, puertas, kilometraje, color, tipo_vehiculo, marca, modelo, disponible, fecha_fabricacion) 
VALUES (28500, 5, 150, 5, 0, 'Blanco', 'SUV', 'TOYOTA', 'RAV4', true, '2023-11-10');

-- Un deportivo con un par de años
INSERT INTO vehiculo (precio, plazas, potencia, puertas, kilometraje, color, tipo_vehiculo, marca, modelo, disponible, fecha_fabricacion) 
VALUES (42000, 4, 250, 3, 15000, 'Negro', 'COUPE', 'BMW', 'M2', true, '2021-06-15');

-- Un utilitario económico
INSERT INTO vehiculo (precio, plazas, potencia, puertas, kilometraje, color, tipo_vehiculo, marca, modelo, disponible, fecha_fabricacion) 
VALUES (15000, 5, 95, 5, 60000, 'Gris', 'HATCHBACK', 'VOLKSWAGEN', 'Polo', false, '2019-03-22');

-- Un superdeportivo recién salido de fábrica
INSERT INTO vehiculo (precio, plazas, potencia, puertas, kilometraje, color, tipo_vehiculo, marca, modelo, disponible, fecha_fabricacion) 
VALUES (210000, 2, 720, 2, 10, 'Rojo', 'SUPERCAR', 'FERRARI', 'F8 Tributo', true, '2024-01-05');

-- Una moto deportiva
INSERT INTO vehiculo (precio, plazas, potencia, puertas, kilometraje, color, tipo_vehiculo, marca, modelo, disponible, fecha_fabricacion) 
VALUES (11500, 2, 119, 0, 0, 'Azul', 'MOTOCICLETA', 'YAMAHA', 'MT-09', true, '2023-09-30');

-- ventas
-- Venta realizada por Carlos (ID 2) a Juan (ID 4)
INSERT INTO venta (fecha, estado, precio, id_vendedor, id_cliente) 
VALUES ('2024-02-10', 'REALIZADA', 18000.00, 2, 4);

-- Venta en progreso de Elena (ID 3) a Marta (ID 5)
INSERT INTO venta (fecha, estado, precio, id_vendedor, id_cliente) 
VALUES ('2024-02-14', 'EN_PROGRESO', 45000.00, 3, 5);

-- Venta anulada
INSERT INTO venta (fecha, estado, precio, id_vendedor, id_cliente) 
VALUES ('2024-01-20', 'ANULADA', 25000.00, 2, 5);