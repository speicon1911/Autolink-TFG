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

-- 5. VENTAS (Se mantiene igual)
INSERT INTO venta (fecha, estado, precio, id_vendedor, id_cliente) VALUES 
('2024-02-10', 'REALIZADA', 27000.00, 2, 4),
('2024-02-14', 'EN_PROGRESO', 45000.00, 3, 5),
('2024-02-20', 'ANULADA', 12000.00, 2, 5);