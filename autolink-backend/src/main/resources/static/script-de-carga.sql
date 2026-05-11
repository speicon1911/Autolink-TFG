-- 1. MARCAS
INSERT INTO marca (nombre) VALUES 
('TOYOTA'), ('FORD'), ('CHEVROLET'), ('HONDA'), ('HYUNDAI'), ('KIA'), 
('NISSAN'), ('VOLKSWAGEN'), ('MAZDA'), ('RENAULT'), ('PEUGEOT'), ('FIAT'),
('BMW'), ('MERCEDES_BENZ'), ('AUDI'), ('LEXUS'), ('VOLVO'), ('PORSCHE'), 
('LAND_ROVER'), ('JAGUAR'), ('TESLA'), ('ALFA_ROMEO'),
('FERRARI'), ('LAMBORGHINI'), ('MCLAREN'), ('ASTON_MARTIN'), ('BUGATTI'), ('MASERATI'),
('JEEP'), ('RAM'), ('GMC'), ('MITSUBISHI'), ('SUBARU'), ('ISUZU'),
('DUCATI'), ('KAWASAKI'), ('YAMAHA'), ('SUZUKI'), ('HARLEY-DAVIDSON'), 
('KTM'), ('TRIUMPH'), ('BMW_MOTORRAD'), ('HONDA_MOTOS'),
('MG'), ('BYD'), ('CHERY'), ('GWM'), ('HAVAL'), ('OPEL'),
('ABARTH'), ('ALPINA'), ('CADILLAC'), ('CHRYSLER'), ('CUPRA'), ('DACIA'),
('DAEWOO'), ('DAIHATSU'), ('DODGE'), ('DS_AUTOMOBILES'), ('INFINITI'),
('LADA'), ('LANCIA'), ('PEUGEOT_VEHICULOS_COMERCIALES'), ('SAAB'), ('SMART'),
('SSANGYONG');

INSERT INTO marca (nombre) VALUES
('APRILIA'), ('BENELLI'), ('BETA'), ('BIMOTA'), ('BRIXTON'), ('CAGIVA'),
('CFMOTO'), ('DAELIM'), ('DERBI'), ('FANTIC'), ('GASGAS'), ('GILERA'),
('HERO'), ('HUSABERG'), ('HUSQVARNA'), ('HYOSUNG'), ('INDIAN'), ('KEEWAY'),
('LAMBRETTA'), ('MALAGUTI'), ('MASH'), ('MOTO_GUZZI'), ('MOTO_MORINI'),
('MV_AGUSTA'), ('NORTON'), ('PEUGEOT_MOTOCYCLES'), ('PIAGGIO'), ('RIEJU'),
('ROYAL_ENFIELD'), ('SHERCO'), ('SWM'), ('ZERO_MOTORCYCLES'), ('ZONTES');

INSERT INTO marca (nombre) VALUES
-- Superdeportivos y Exclusivos
('PAGANI'), ('KOENIGSEGG'), ('RIMAC'), ('LOTUS'), ('ARIEL'), ('NOBLE'), ('SPYKER'),
-- Nuevos Eléctricos
('POLESTAR'), ('RIVIAN'), ('LUCID'), ('NIO'), ('XPENG'), ('FISKER'),
-- Clásicos e Históricos
('HUMMER'), ('PONTIAC'), ('ROVER'), ('OLDSMOBILE'), ('PLYMOUTH'), ('AUSTIN'), ('MORRIS'), ('TRIUMPH_CARS'),
-- Vehículos Pesados / Industriales
('IVECO'), ('SCANIA'), ('MAN'), ('DAF'), ('MACK'), ('KENWORTH'), ('PETERBILT'), ('FREIGHTLINER'),
-- Motos Adicionales (Scooters, Clásicas, Nuevas)
('KYMCO'), ('SYM'), ('MONTESA'), ('BULTACO'), ('OSSA'), ('VESPA'), ('VOGE'), ('MACBOR');


-- 2. PERSONAS (Contraseña por defecto para todos: admin123 -> $2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqCyS)
-- ID 1: Administrador
INSERT INTO persona (nombre, apellidos, DNI, correo, password, rol, salario_anual, ciudad_asignada, telefono, activo) VALUES 
('Admin', 'Principal', '11111111A', 'speicon1911@g.educaand.es', '$2a$12$XsC4.ft3Gg6s1sUS5477UuVWendoVVuhrEXYhag2fdJTQpprfOrLq', 'ADMINISTRADOR', 45000.00, 'Madrid', 600000001, true);

-- ID 2: Vendedor Oficial
INSERT INTO persona (nombre, apellidos, DNI, correo, password, rol, salario_anual, ciudad_asignada, telefono, activo) VALUES 
('Salvador', 'Peinado', '22222222B', 'salvadorpeinado111906@gmail.com', '$2a$12$XsC4.ft3Gg6s1sUS5477UuVWendoVVuhrEXYhag2fdJTQpprfOrLq', 'VENDEDOR', 32000.00, 'Málaga', 600000002, true);

-- ID 3: Cliente Principal
INSERT INTO persona (nombre, apellidos, DNI, correo, password, rol, salario_anual, ciudad_asignada, telefono, activo) VALUES 
('Black', 'Ruby', '33333333C', 'blackruby2o0g@gmail.com', '$2a$12$XsC4.ft3Gg6s1sUS5477UuVWendoVVuhrEXYhag2fdJTQpprfOrLq', 'CLIENTE', NULL, NULL, 600000003, true);

-- IDS 4 al 23: Clientes Falsos para Paginación
INSERT INTO persona (nombre, apellidos, DNI, correo, password, rol, salario_anual, ciudad_asignada, telefono, activo) VALUES 
('Carlos', 'Sánchez', '44444444D', 'carlos.cliente1@falso.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqCyS', 'CLIENTE', NULL, NULL, 600000004, true),
('María', 'García', '55555555E', 'maria.cliente2@falso.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqCyS', 'CLIENTE', NULL, NULL, 600000005, true),
('Juan', 'López', '66666666F', 'juan.cliente3@falso.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqCyS', 'CLIENTE', NULL, NULL, 600000006, true),
('Elena', 'Martínez', '77777777G', 'elena.cliente4@falso.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqCyS', 'CLIENTE', NULL, NULL, 600000007, true),
('Laura', 'Fernández', '88888888H', 'laura.cliente5@falso.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqCyS', 'CLIENTE', NULL, NULL, 600000008, true),
('David', 'Gómez', '99999999J', 'david.cliente6@falso.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqCyS', 'CLIENTE', NULL, NULL, 600000009, true),
('Ana', 'Ruiz', '12121212K', 'ana.cliente7@falso.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqCyS', 'CLIENTE', NULL, NULL, 600000010, true),
('Sergio', 'Díaz', '13131313L', 'sergio.cliente8@falso.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqCyS', 'CLIENTE', NULL, NULL, 600000011, true),
('Marta', 'Álvarez', '14141414M', 'marta.cliente9@falso.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqCyS', 'CLIENTE', NULL, NULL, 600000012, true),
('Javier', 'Romero', '15151515N', 'javier.cliente10@falso.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqCyS', 'CLIENTE', NULL, NULL, 600000013, true),
('Lucía', 'Alonso', '16161616P', 'lucia.cliente11@falso.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqCyS', 'CLIENTE', NULL, NULL, 600000014, true),
('Daniel', 'Torres', '17171717Q', 'daniel.cliente12@falso.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqCyS', 'CLIENTE', NULL, NULL, 600000015, true),
('Paula', 'Navarro', '18181818R', 'paula.cliente13@falso.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqCyS', 'CLIENTE', NULL, NULL, 600000016, true),
('Alejandro', 'Castro', '19191919S', 'alejandro.cliente14@falso.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqCyS', 'CLIENTE', NULL, NULL, 600000017, true),
('Sofía', 'Gil', '20202020T', 'sofia.cliente15@falso.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqCyS', 'CLIENTE', NULL, NULL, 600000018, true),
('Pablo', 'Serrano', '21212121V', 'pablo.cliente16@falso.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqCyS', 'CLIENTE', NULL, NULL, 600000019, true),
('Alba', 'Blanco', '23232323W', 'alba.cliente17@falso.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqCyS', 'CLIENTE', NULL, NULL, 600000020, true),
('Hugo', 'Molina', '24242424X', 'hugo.cliente18@falso.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqCyS', 'CLIENTE', NULL, NULL, 600000021, true),
('Sara', 'Morales', '25252525Y', 'sara.cliente19@falso.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqCyS', 'CLIENTE', NULL, NULL, 600000022, true),
('Diego', 'Ortega', '26262626Z', 'diego.cliente20@falso.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqCyS', 'CLIENTE', NULL, NULL, 600000023, true);


-- 3. VEHÍCULOS (Todos asignados al vendedor con ID 2: salvadorpeinado111906@gmail.com)
INSERT INTO vehiculo (precio, plazas, potencia, puertas, kilometraje, color, combustible, tipo_vehiculo, id_marca, id_vendedor, modelo, disponible, verificado, anio_fabricacion, fecha_verificacion, matricula, fecha_matriculacion, vencimiento_itv, etiqueta_medioambiental, descripcion, ciudad) VALUES 
(28500, 5, 150, 5, 0, 'Blanco', 'HIBRIDO', 'SUV', 1, 2, 'RAV4', true, true, 2023, '2026-02-21', '1234BBB', '2023-01-15', '2027-01-15', 'ECO', 'Híbrido autorrecargable en excelente estado, etiqueta ECO.', 'Madrid'),
(42000, 4, 250, 3, 15000, 'Negro', 'GASOLINA', 'COUPE', 13, 2, 'M2', true, true, 2021, '2026-02-21', '5678CCC', '2021-06-10', '2025-06-10', 'C', 'Pura potencia alemana, muy cuidado, siempre en garaje.', 'Málaga'),
(15000, 5, 95, 5, 60000, 'Gris', 'GASOLINA', 'HATCHBACK', 8, 2, 'Polo', true, false, 2019, NULL, '9012DDD', '2019-03-20', '2025-03-20', 'C', 'Compacto fiable y de bajo consumo, ideal para el día a día.', 'Sevilla'),
(210000, 2, 720, 2, 10, 'Rojo', 'GASOLINA', 'SUPERCAR', 23, 2, 'F8 Tributo', true, false, 2024, NULL, '3456FFF', '2024-02-01', '2028-02-01', 'C', 'Vehículo de colección, prácticamente a estrenar.', 'Barcelona'),
(11500, 2, 119, 0, 0, 'Azul', 'GASOLINA', 'MOTOCICLETA', 37, 2, 'MT-09', true, false, 2023, NULL, '7890GGG', '2023-05-12', '2027-05-12', 'C', 'Moto naked agresiva con tecnología de última generación.', 'Valencia'),
(24000, 5, 140, 5, 12000, 'Gris', 'HIBRIDO', 'SUV', 1, 2, 'Corolla Cross', true, true, 2022, '2026-02-20', '1122HHH', '2022-09-10', '2026-09-10', 'ECO', 'Familiar y eficiente, perfecto para viajes largos.', 'Zaragoza'),
(18000, 5, 122, 5, 30000, 'Blanco', 'HIBRIDO', 'SEDAN', 1, 2, 'Corolla', true, false, 2021, NULL, '3344JJJ', '2021-04-15', '2025-04-15', 'ECO', 'Berlina clásica con motorización híbrida de bajo mantenimiento.', 'Bilbao'),
(32000, 5, 190, 5, 10000, 'Azul', 'DIESEL', 'SUV', 2, 2, 'Kuga', true, true, 2023, '2026-02-22', '5566KKK', '2023-02-20', '2027-02-20', 'ECO', 'Equipamiento completo Titanium, gran confort de marcha.', 'Murcia'),
(27000, 5, 155, 5, 22000, 'Rojo', 'HIBRIDO', 'SUV', 2, 2, 'Puma', true, false, 2022, NULL, '7788LLL', '2022-11-05', '2026-11-05', 'ECO', 'Diseño deportivo y maletero Megabox muy versátil.', 'Alicante'),
(21000, 5, 130, 5, 40000, 'Negro', 'DIESEL', 'SUV', 3, 2, 'Captiva', true, false, 2020, NULL, '9900MMM', '2020-07-22', '2024-07-22', 'C', '7 plazas espacioso y cómodo para toda la familia.', 'Córdoba'),
(19500, 5, 129, 5, 28000, 'Gris', 'GASOLINA', 'SEDAN', 4, 2, 'Civic', true, true, 2021, '2026-02-20', '1212NNN', '2021-01-30', '2025-01-30', 'C', 'Dinámica de conducción excepcional y diseño futurista.', 'Valladolid'),
(23000, 5, 150, 5, 18000, 'Blanco', 'DIESEL', 'SUV', 5, 2, 'Tucson', true, true, 2022, '2019-02-19', '3434PPP', '2022-03-15', '2026-03-15', 'ECO', 'Líder en ventas, tecnología avanzada y diseño rompedor.', 'Vigo'),
(17000, 5, 100, 5, 35000, 'Azul', 'GASOLINA', 'HATCHBACK', 5, 2, 'i30', true, false, 2021, NULL, '5656QQQ', '2021-08-10', '2025-08-10', 'C', 'Equilibrio perfecto entre precio y equipamiento.', 'Gijón'),
(26000, 5, 160, 5, 14000, 'Negro', 'DIESEL', 'SUV', 6, 2, 'Sportage', true, true, 2023, '2026-02-18', '7878RRR', '2023-04-12', '2027-04-12', 'ECO', 'Interiores premium y gran maletero.', 'Granada'),
(20000, 5, 140, 5, 26000, 'Gris', 'GASOLINA', 'SUV', 7, 2, 'Qashqai', true, false, 2021, NULL, '9090SSS', '2021-12-05', '2025-12-05', 'ECO', 'El pionero de los SUV, muy fiable.', 'Elche'),
(22000, 5, 150, 5, 24000, 'Blanco', 'GASOLINA', 'SUV', 8, 2, 'T-Roc', true, true, 2022, '2026-02-21', '1313TTT', '2022-05-18', '2026-05-18', 'C', 'Calidad Volkswagen en formato compacto.', 'Oviedo'),
(16000, 5, 110, 5, 50000, 'Rojo', 'DIESEL', 'HATCHBACK', 8, 2, 'Golf', true, false, 2019, NULL, '2424VVV', '2019-10-25', '2025-10-25', 'C', 'Un clásico que nunca falla, revisión recién hecha.', 'Badajoz'),
(25000, 5, 165, 5, 15000, 'Gris', 'GASOLINA', 'SUV', 9, 2, 'CX-5', true, true, 2022, '2026-02-20', '3535WWW', '2022-02-28', '2026-02-28', 'C', 'Diseño Kodo y acabados interiores de lujo.', 'Salamanca'),
(17500, 5, 115, 5, 34000, 'Azul', 'GASOLINA', 'SUV', 10, 2, 'Captur', true, false, 2020, NULL, '4646XXX', '2020-11-15', '2024-11-15', 'C', 'Ágil y versátil para el entorno urbano.', 'Huelva'),
(14000, 5, 95, 5, 45000, 'Blanco', 'GASOLINA', 'HATCHBACK', 10, 2, 'Clio', true, false, 2019, NULL, '5757YYY', '2019-06-30', '2025-06-30', 'C', 'Bajo consumo y fácil de aparcar.', 'Lérida'),
(21000, 5, 130, 5, 30000, 'Gris', 'DIESEL', 'SUV', 11, 2, '3008', true, true, 2021, '2026-02-20', '6868ZZZ', '2021-09-05', '2025-09-05', 'C', 'i-Cockpit y conducción muy intuitiva.', 'Tarragona'),
(13000, 4, 85, 3, 42000, 'Rojo', 'GASOLINA', 'HATCHBACK', 12, 2, '500', true, false, 2018, NULL, '7979ABB', '2018-05-12', '2024-05-12', 'C', 'Estilo italiano inconfundible.', 'Burgos'),
(48000, 5, 258, 5, 12000, 'Negro', 'GASOLINA', 'SEDAN', 13, 2, '330i', true, true, 2023, '2026-02-22', '8080ACC', '2023-07-18', '2027-07-18', 'C', 'Elegancia y deportividad en una sola pieza.', 'Albacete'),
(52000, 5, 265, 5, 10000, 'Gris', 'GASOLINA', 'SEDAN', 14, 2, 'C300', true, true, 2023, '2026-02-22', '9191ADD', '2023-01-10', '2027-01-10', 'C', 'El referente en confort y lujo tecnológico.', 'Castellón'),
(47000, 5, 245, 5, 17000, 'Blanco', 'DIESEL', 'SUV', 15, 2, 'Q5', true, true, 2022, '2026-02-21', '0202AEE', '2022-08-22', '2026-08-22', 'C', 'Tracción Quattro y gran capacidad de carga.', 'Logroño'),
(60000, 5, 351, 5, 9000, 'Negro', 'ELECTRICO', 'SEDAN', 21, 2, 'Model 3', true, true, 2023, '2026-02-23', '1313AFF', '2023-11-20', '2027-11-20', 'CERO', 'Tecnología eléctrica de vanguardia y aceleración instantánea.', 'Málaga'),
(98000, 4, 350, 5, 8000, 'Gris', 'GASOLINA', 'SUV', 18, 2, 'Cayenne', true, true, 2023, '2026-02-23', '2424AGG', '2023-03-15', '2027-03-15', 'C', 'Prestaciones de deportivo en un cuerpo de SUV.', 'Madrid'),
(85000, 5, 300, 5, 12000, 'Verde', 'DIESEL', 'SUV', 19, 2, 'Range Rover Evoque', true, true, 2022, '2026-02-21', '3535AHH', '2022-06-30', '2026-06-30', 'C', 'Capacidad off-road con el máximo lujo.', 'Málaga'),
(72000, 5, 296, 5, 15000, 'Negro', 'DIESEL', 'SUV', 20, 2, 'F-Pace', true, true, 2022, '2026-02-21', '4646AJJ', '2022-12-05', '2026-12-05', 'C', 'Un Jaguar con alma de SUV deportivo.', 'Sevilla'),
(9800, 2, 110, 0, 2000, 'Negro', 'GASOLINA', 'MOTOCICLETA', 36, 2, 'Ninja 650', true, false, 2023, NULL, '5757AKK', '2023-04-10', '2027-04-10', 'C', 'Moto sport-turismo ideal para iniciarse con el A2.', 'Valencia'),
(7200, 2, 75, 0, 5000, 'Azul', 'GASOLINA', 'MOTOCICLETA', 37, 2, 'YZF-R7', true, false, 2022, NULL, '6868ALL', '2022-02-14', '2026-02-14', 'C', 'ADN de competición para disfrutar en curvas.', 'Málaga'),
(6800, 2, 70, 0, 8000, 'Rojo', 'GASOLINA', 'MOTOCICLETA', 38, 2, 'GSX-8S', true, false, 2022, NULL, '7979AMM', '2022-10-01', '2026-10-01', 'C', 'Equilibrio y agilidad urbana.', 'Málaga'),
(15500, 2, 150, 0, 3000, 'Naranja', 'GASOLINA', 'MOTOCICLETA', 40, 2, '1290 Super Duke', true, false, 2023, NULL, '8080ANN', '2023-06-25', '2027-06-25', 'C', 'La "Bestia" con toda la potencia de KTM.', 'Granada'),
(13500, 2, 120, 0, 4000, 'Negro', 'GASOLINA', 'MOTOCICLETA', 41, 2, 'Street Triple', true, false, 2023, NULL, '9191APP', '2023-09-12', '2027-09-12', 'C', 'Agilidad legendaria y motor tricilíndrico.', 'Madrid'),
(17000, 2, 136, 0, 3500, 'Gris', 'GASOLINA', 'MOTOCICLETA', 42, 2, 'S1000R', true, false, 2023, NULL, '0202AQQ', '2023-05-20', '2027-05-20', 'C', 'Referente en el segmento Maxinaked.', 'Madrid');


-- 4. VENTAS
-- Generamos algunas ventas entre el Vendedor 2 y diferentes clientes, con diferentes estados
INSERT INTO venta (fecha, estado, precio, id_vendedor, id_cliente, id_vehiculo) VALUES 
('2024-01-15', 'REALIZADA', 28500.00, 2, 3, 1),
('2024-02-10', 'REALIZADA', 42000.00, 2, 4, 2),
('2024-03-05', 'EN_PROGRESO', 15000.00, 2, 5, 3),
('2024-03-20', 'ANULADA', 210000.00, 2, 6, 4),
('2024-04-01', 'REALIZADA', 11500.00, 2, 7, 5),
('2024-04-10', 'EN_PROGRESO', 24000.00, 2, 8, 6),
('2024-04-15', 'REALIZADA', 18000.00, 2, 9, 7),
('2024-04-18', 'ANULADA', 32000.00, 2, 10, 8),
('2024-04-20', 'EN_PROGRESO', 27000.00, 2, 11, 9),
('2024-04-22', 'REALIZADA', 21000.00, 2, 12, 10),
('2024-04-23', 'EN_PROGRESO', 19500.00, 2, 13, 11),
('2024-04-24', 'REALIZADA', 23000.00, 2, 14, 12),
('2024-03-12', 'ANULADA', 17000.00, 2, 15, 13),
('2024-02-28', 'REALIZADA', 26000.00, 2, 16, 14),
('2024-01-05', 'REALIZADA', 20000.00, 2, 17, 15);
