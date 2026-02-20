-- 2. INSERTS DE MARCAS (Basado en tu Enum MarcaVehiculos)
INSERT INTO marca (nombre) VALUES 
-- Populares
('TOYOTA'), ('FORD'), ('CHEVROLET'), ('HONDA'), ('HYUNDAI'), ('KIA'), 
('NISSAN'), ('VOLKSWAGEN'), ('MAZDA'), ('RENAULT'), ('PEUGEOT'), ('FIAT'),
-- Lujo
('BMW'), ('MERCEDES_BENZ'), ('AUDI'), ('LEXUS'), ('VOLVO'), ('PORSCHE'), 
('LAND_ROVER'), ('JAGUAR'), ('TESLA'), ('ALFA_ROMEO'),
-- Exóticos
('FERRARI'), ('LAMBORGHINI'), ('MCLAREN'), ('ASTON_MARTIN'), ('BUGATTI'), ('MASERATI'),
-- SUVs y Trabajo
('JEEP'), ('RAM'), ('GMC'), ('MITSUBISHI'), ('SUBARU'), ('ISUZU'),
-- Motos
('DUCATI'), ('KAWASAKI'), ('YAMAHA'), ('SUZUKI'), ('HARLEY_DAVIDSON'), 
('KTM'), ('TRIUMPH'), ('BMW_MOTORRAD'), ('HONDA_MOTOS'),
-- Chinas
('MG'), ('BYD'), ('CHERY'), ('GWM'), ('HAVAL');

-- 3. INSERTS DE PERSONAS (Atributo 'rol')
-- Nota: id_persona será 1, 2, 3, 4, 5 respectivamente
INSERT INTO persona (nombre, apellidos, DNI, correo, password, rol, salario_anual, ciudad_asignada, telefono) VALUES 
('Laura', 'García Ruiz', '12345678A', 'laura.admin@autolink.com', 'admin123', 'ADMINISTRADOR', 45000.00, 'Madrid', NULL),
('Carlos', 'Pérez Gómez', '87654321B', 'carlos.sales@autolink.com', 'vendedor2024', 'VENDEDOR', NULL, NULL, 600123456),
('Elena', 'Martínez Soler', '45678912C', 'elena.vende@autolink.com', 'elena_pass', 'VENDEDOR', NULL, NULL, 655987654),
('Juan', 'López Castro', '11223344D', 'juan.cliente@gmail.com', 'password123', 'CLIENTE', NULL, NULL, NULL),
('Marta', 'Sánchez Villa', '55667788E', 'marta.sv@yahoo.com', 'marta_secure', 'CLIENTE', NULL, NULL, NULL);

-- 4. INSERTS DE VEHÍCULOS (Relacionados por id_marca)
-- Toyota es ID 1, BMW es ID 13, Volkswagen es ID 8, Ferrari es ID 23, Yamaha es ID 37
INSERT INTO vehiculo (precio, plazas, potencia, puertas, kilometraje, color, tipo_vehiculo, id_marca, modelo, disponible, verificado, fecha_fabricacion) VALUES 
(28500, 5, 150, 5, 0, 'Blanco', 'SUV', 1, 'RAV4', true, true, '2023-11-10'),
(42000, 4, 250, 3, 15000, 'Negro', 'COUPE', 13, 'M2', true, true, '2021-06-15'),
(15000, 5, 95, 5, 60000, 'Gris', 'HATCHBACK', 8, 'Polo', false, true, '2019-03-22'),
(210000, 2, 720, 2, 10, 'Rojo', 'SUPERCAR', 23, 'F8 Tributo', true, true, '2024-01-05'),
(11500, 2, 119, 0, 0, 'Azul', 'MOTOCICLETA', 37, 'MT-09', true, true, '2023-09-30');

-- 5. INSERTS DE VENTAS (Relacionadas por id_vendedor e id_cliente)
INSERT INTO venta (fecha, estado, precio, id_vendedor, id_cliente) VALUES 
('2024-02-10', 'REALIZADA', 18000.00, 2, 4),
('2024-02-14', 'EN_PROGRESO', 45000.00, 3, 5),
('2024-01-20', 'ANULADA', 25000.00, 2, 5);