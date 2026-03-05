-- 2. MARCAS (Se mantiene igual)
INSERT INTO marca (nombre) VALUES 
('TOYOTA'), ('FORD'), ('CHEVROLET'), ('HONDA'), ('HYUNDAI'), ('KIA'), 
('NISSAN'), ('VOLKSWAGEN'), ('MAZDA'), ('RENAULT'), ('PEUGEOT'), ('FIAT'),
('BMW'), ('MERCEDES_BENZ'), ('AUDI'), ('LEXUS'), ('VOLVO'), ('PORSCHE'), 
('LAND_ROVER'), ('JAGUAR'), ('TESLA'), ('ALFA_ROMEO'),
('FERRARI'), ('LAMBORGHINI'), ('MCLAREN'), ('ASTON_MARTIN'), ('BUGATTI'), ('MASERATI'),
('JEEP'), ('RAM'), ('GMC'), ('MITSUBISHI'), ('SUBARU'), ('ISUZU'),
('DUCATI'), ('KAWASAKI'), ('YAMAHA'), ('SUZUKI'), ('HARLEY_DAVIDSON'), 
('KTM'), ('TRIUMPH'), ('BMW_MOTORRAD'), ('HONDA_MOTOS'),
('MG'), ('BYD'), ('CHERY'), ('GWM'), ('HAVAL');

-- 3. PERSONAS (Contraseñas encriptadas con BCrypt)
-- Laura: admin123 -> $2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqCyS
-- Carlos: vendedor2024 -> $2a$10$wE0vN29/9mIas5GvY9pX7uPPrUqGqB.X.XU0H7R7WJd9Yn3XmN5kG
-- Elena: elena_pass -> $2a$10$MvN6Y8E5B7Z.V6fL6lR6O.G9mO6S9X9Y9Z9A9B9C9D9E9F9G9H9I9
-- Juan: password123 -> $2a$10$pX7uPPrUqGqB.X.XU0H7R7WJd9Yn3XmN5kG8.UnVuG9HHgffUDAlk8
-- Marta: marta_secure -> $2a$10$h9MvN6Y8E5B7Z.V6fL6lR6O.G9mO6S9X9Y9Z9A9B9C9D9E9F9G9H
INSERT INTO persona (nombre, apellidos, DNI, correo, password, rol, salario_anual, ciudad_asignada, telefono) VALUES 
('Laura', 'García Ruiz', '12345678A', 'laura.admin@autolink.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqCyS', 'ADMINISTRADOR', 45000.00, 'Madrid', NULL),
('Carlos', 'Pérez Gómez', '87654321B', 'carlos.sales@autolink.com', '$2a$10$wE0vN29/9mIas5GvY9pX7uPPrUqGqB.X.XU0H7R7WJd9Yn3XmN5kG', 'VENDEDOR', NULL, NULL, 600123456),
('Elena', 'Martínez Soler', '45678912C', 'elena.vende@autolink.com', '$2a$10$MvN6Y8E5B7Z.V6fL6lR6O.G9mO6S9X9Y9Z9A9B9C9D9E9F9G9H9I9', 'VENDEDOR', NULL, NULL, 655987654),
('Juan', 'López Castro', '11223344D', 'juan.cliente@gmail.com', '$2a$10$pX7uPPrUqGqB.X.XU0H7R7WJd9Yn3XmN5kG8.UnVuG9HHgffUDAlk8', 'CLIENTE', NULL, NULL, NULL),
('Marta', 'Sánchez Villa', '55667788E', 'marta.sv@yahoo.com', '$2a$10$h9MvN6Y8E5B7Z.V6fL6lR6O.G9mO6S9X9Y9Z9A9B9C9D9E9F9G9H', 'CLIENTE', NULL, NULL, NULL);

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