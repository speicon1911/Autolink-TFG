-- 2. MARCAS (Actualizado con coches y motos adicionales)
INSERT INTO marca (nombre) VALUES 
('TOYOTA'), ('FORD'), ('CHEVROLET'), ('HONDA'), ('HYUNDAI'), ('KIA'), 
('NISSAN'), ('VOLKSWAGEN'), ('MAZDA'), ('RENAULT'), ('PEUGEOT'), ('FIAT'),
('BMW'), ('MERCEDES_BENZ'), ('AUDI'), ('LEXUS'), ('VOLVO'), ('PORSCHE'), 
('LAND_ROVER'), ('JAGUAR'), ('TESLA'), ('ALFA_ROMEO'),
('FERRARI'), ('LAMBORGHINI'), ('MCLAREN'), ('ASTON_MARTIN'), ('BUGATTI'), ('MASERATI'),
('JEEP'), ('RAM'), ('GMC'), ('MITSUBISHI'), ('SUBARU'), ('ISUZU'),
('DUCATI'), ('KAWASAKI'), ('YAMAHA'), ('SUZUKI'), ('HARLEY-DAVIDSON'), 
('KTM'), ('TRIUMPH'), ('BMW_MOTORRAD'), ('HONDA_MOTOS'),
('MG'), ('BYD'), ('CHERY'), ('GWM'), ('HAVAL'),

-- Marcas adicionales de coches
('ABARTH'), ('ALPINA'), ('CADILLAC'), ('CHRYSLER'), ('CUPRA'), ('DACIA'),
('DAEWOO'), ('DAIHATSU'), ('DODGE'), ('DS_AUTOMOBILES'), ('INFINITI'),
('LADA'), ('LANCIA'), ('PEUGEOT_VEHICULOS_COMERCIALES'), ('SAAB'), ('SMART'),
('SSANGYONG');

-- Marcas adicionales de motos
INSERT INTO marca (nombre) VALUES
('APRILIA'), ('BENELLI'), ('BETA'), ('BIMOTA'), ('BRIXTON'), ('CAGIVA'),
('CFMOTO'), ('DAELIM'), ('DERBI'), ('FANTIC'), ('GASGAS'), ('GILERA'),
('HERO'), ('HUSABERG'), ('HUSQVARNA'), ('HYOSUNG'), ('INDIAN'), ('KEEWAY'),
('LAMBRETTA'), ('MALAGUTI'), ('MASH'), ('MOTO_GUZZI'), ('MOTO_MORINI'),
('MV_AGUSTA'), ('NORTON'), ('PEUGEOT_MOTOCYCLES'), ('PIAGGIO'), ('RIEJU'),
('ROYAL_ENFIELD'), ('SHERCO'), ('SWM'), ('ZERO_MOTORCYCLES'), ('ZONTES');
-- 3. PERSONAS (Contraseñas encriptadas con BCrypt)
-- Laura: admin123 -> $2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqCyS
-- Carlos: vendedor2024 -> $2a$12$jKGscMlB.LYJ8TwH9tUDquhXdmTs9ZwwLH2vGONw6bckpUhKWxKMq
-- Elena: elena_pass -> $2a$12$5By9U2m7GH5eiGWRruRNAOATLdlv4yco39QS0RaG1gVAbVTNoOwTW
-- Juan: password123 -> $2a$12$mogVLm0DEb29E5LtVjSLWujEa/gVwa8kj2PWm64psxXyzhsm2GAkS
-- Marta: marta_secure -> $2a$12$Ob2IPKQUtjutgAUZwH9Jn.lBVszOgILUaatuXJ/7amPeZ2wZ7j2ry
INSERT INTO persona (nombre, apellidos, DNI, correo, password, rol, salario_anual, ciudad_asignada, telefono) VALUES 
('Laura', 'García Ruiz', '12345678A', 'laura.admin@autolink.com', '$2a$12$sB0EoxwLvrR8WDnHvYWRe.1cu93d6GzbxKKb8LZtiQiIgnWkka/xu', 'ADMINISTRADOR', 45000.00, 'Madrid', NULL),
('Carlos', 'Pérez Gómez', '87654321B', 'carlos.sales@autolink.com', '$2a$12$jKGscMlB.LYJ8TwH9tUDquhXdmTs9ZwwLH2vGONw6bckpUhKWxKMq', 'VENDEDOR', NULL, NULL, 600123456),
('Elena', 'Martínez Soler', '45678912C', 'elena.vende@autolink.com', '$2a$12$5By9U2m7GH5eiGWRruRNAOATLdlv4yco39QS0RaG1gVAbVTNoOwTW', 'VENDEDOR', NULL, NULL, 655987654),
('Juan', 'López Castro', '11223344D', 'juan.cliente@gmail.com', '$2a$12$mogVLm0DEb29E5LtVjSLWujEa/gVwa8kj2PWm64psxXyzhsm2GAkS', 'CLIENTE', NULL, NULL, NULL),
('Marta', 'Sánchez Villa', '55667788E', 'marta.sv@yahoo.com', '$2a$12$Ob2IPKQUtjutgAUZwH9Jn.lBVszOgILUaatuXJ/7amPeZ2wZ7j2ry', 'CLIENTE', NULL, NULL, NULL);

-- 4. VEHÍCULOS (Se mantiene igual)
INSERT INTO vehiculo (precio, plazas, potencia, puertas, kilometraje, color, tipo_vehiculo, id_marca, id_vendedor, modelo, disponible, verificado, fecha_fabricacion, fecha_verificacion) VALUES 
(28500, 5, 150, 5, 0, 'Blanco', 'SUV', 1, 2, 'RAV4', true, true, '2023-11-10', '2026-02-21'),
(42000, 4, 250, 3, 15000, 'Negro', 'COUPE', 13, 2, 'M2', true, true, '2021-06-15', '2026-02-21'),
(15000, 5, 95, 5, 60000, 'Gris', 'HATCHBACK', 8, 2, 'Polo', true, false, '2019-03-22', NULL),
(210000, 2, 720, 2, 10, 'Rojo', 'SUPERCAR', 23, 3, 'F8 Tributo', true, false, '2024-01-05', NULL),
(11500, 2, 119, 0, 0, 'Azul', 'MOTOCICLETA', 37, 3, 'MT-09', true, false, '2023-09-30', NULL);
INSERT INTO vehiculo (precio, plazas, potencia, puertas, kilometraje, color, tipo_vehiculo, id_marca, id_vendedor, modelo, disponible, verificado, fecha_fabricacion, fecha_verificacion) VALUES 

-- TOYOTA
(24000, 5, 140, 5, 12000, 'Gris', 'SUV', 1, 2, 'Corolla Cross', true, true, '2022-05-12', '2026-02-20'),
(18000, 5, 122, 5, 30000, 'Blanco', 'SEDAN', 1, 3, 'Corolla', true, false, '2021-03-10', NULL),

-- FORD
(32000, 5, 190, 5, 10000, 'Azul', 'SUV', 2, 2, 'Kuga', true, true, '2023-04-11', '2026-02-22'),
(27000, 5, 155, 5, 22000, 'Rojo', 'SUV', 2, 3, 'Puma', true, false, '2022-06-14', NULL),

-- CHEVROLET
(21000, 5, 130, 5, 40000, 'Negro', 'SUV', 3, 2, 'Captiva', true, false, '2020-07-15', NULL),

-- HONDA
(19500, 5, 129, 5, 28000, 'Gris', 'SEDAN', 4, 3, 'Civic', true, true, '2021-02-10', '2026-02-20'),

-- HYUNDAI
(23000, 5, 150, 5, 18000, 'Blanco', 'SUV', 5, 2, 'Tucson', true, true, '2022-09-01', '2026-02-19'),
(17000, 5, 100, 5, 35000, 'Azul', 'HATCHBACK', 5, 3, 'i30', true, false, '2021-01-12', NULL),

-- KIA
(26000, 5, 160, 5, 14000, 'Negro', 'SUV', 6, 2, 'Sportage', true, true, '2023-03-05', '2026-02-18'),

-- NISSAN
(20000, 5, 140, 5, 26000, 'Gris', 'SUV', 7, 3, 'Qashqai', true, false, '2021-07-09', NULL),

-- VOLKSWAGEN
(22000, 5, 150, 5, 24000, 'Blanco', 'SUV', 8, 2, 'T-Roc', true, true, '2022-04-18', '2026-02-21'),
(16000, 5, 110, 5, 50000, 'Rojo', 'HATCHBACK', 8, 3, 'Golf', true, false, '2019-05-10', NULL),

-- MAZDA
(25000, 5, 165, 5, 15000, 'Gris', 'SUV', 9, 2, 'CX-5', true, true, '2022-08-17', '2026-02-20'),

-- RENAULT
(17500, 5, 115, 5, 34000, 'Azul', 'SUV', 10, 3, 'Captur', true, false, '2020-09-13', NULL),
(14000, 5, 95, 5, 45000, 'Blanco', 'HATCHBACK', 10, 2, 'Clio', true, false, '2019-02-21', NULL),

-- PEUGEOT
(21000, 5, 130, 5, 30000, 'Gris', 'SUV', 11, 3, '3008', true, true, '2021-06-11', '2026-02-20'),

-- FIAT
(13000, 4, 85, 3, 42000, 'Rojo', 'HATCHBACK', 12, 2, '500', true, false, '2018-03-19', NULL),

-- BMW
(48000, 5, 258, 5, 12000, 'Negro', 'SEDAN', 13, 3, '330i', true, true, '2023-01-12', '2026-02-22'),

-- MERCEDES
(52000, 5, 265, 5, 10000, 'Gris', 'SEDAN', 14, 2, 'C300', true, true, '2023-02-10', '2026-02-22'),

-- AUDI
(47000, 5, 245, 5, 17000, 'Blanco', 'SUV', 15, 3, 'Q5', true, true, '2022-03-11', '2026-02-21'),

-- TESLA
(60000, 5, 351, 5, 9000, 'Negro', 'SEDAN', 21, 2, 'Model 3', true, true, '2023-05-22', '2026-02-23'),

-- PORSCHE
(98000, 4, 350, 5, 8000, 'Gris', 'SUV', 18, 3, 'Cayenne', true, true, '2023-01-01', '2026-02-23'),

-- LAND ROVER
(85000, 5, 300, 5, 12000, 'Verde', 'SUV', 19, 2, 'Range Rover Evoque', true, true, '2022-11-01', '2026-02-21'),

-- JAGUAR
(72000, 5, 296, 5, 15000, 'Negro', 'SUV', 20, 3, 'F-Pace', true, true, '2022-04-12', '2026-02-21'),

-- MOTOS
(9800, 2, 110, 0, 2000, 'Negro', 'MOTOCICLETA', 36, 3, 'Ninja 650', true, false, '2023-06-10', NULL),
(7200, 2, 75, 0, 5000, 'Azul', 'MOTOCICLETA', 37, 2, 'YZF-R7', true, false, '2022-08-10', NULL),
(6800, 2, 70, 0, 8000, 'Rojo', 'MOTOCICLETA', 38, 3, 'GSX-8S', true, false, '2022-10-05', NULL),
(15500, 2, 150, 0, 3000, 'Naranja', 'MOTOCICLETA', 40, 2, '1290 Super Duke', true, false, '2023-03-10', NULL),
(13500, 2, 120, 0, 4000, 'Negro', 'MOTOCICLETA', 41, 3, 'Street Triple', true, false, '2023-04-15', NULL),
(17000, 2, 136, 0, 3500, 'Gris', 'MOTOCICLETA', 42, 2, 'S1000R', true, false, '2023-01-20', NULL);

-- 5. VENTAS (Se mantiene igual)
INSERT INTO venta (fecha, estado, precio, id_vendedor, id_cliente) VALUES 
('2024-02-10', 'REALIZADA', 27000.00, 2, 4),
('2024-02-14', 'EN_PROGRESO', 45000.00, 3, 5),
('2024-02-20', 'ANULADA', 12000.00, 2, 5);