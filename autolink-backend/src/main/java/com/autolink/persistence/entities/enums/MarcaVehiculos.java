package com.autolink.persistence.entities.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum MarcaVehiculos {
	// 🚗 Marcas Populares / Generalistas
    TOYOTA("Toyota"), FORD("Ford"), CHEVROLET("Chevrolet"), HONDA("Honda"), 
    HYUNDAI("Hyundai"), KIA("Kia"), NISSAN("Nissan"), VOLKSWAGEN("Volkswagen"), 
    MAZDA("Mazda"), RENAULT("Renault"), PEUGEOT("Peugeot"), FIAT("Fiat"),
    
    // 💎 Lujo y Premium
    BMW("BMW"), MERCEDES_BENZ("Mercedes-Benz"), AUDI("Audi"), LEXUS("Lexus"), 
    VOLVO("Volvo"), PORSCHE("Porsche"), LAND_ROVER("Land Rover"), JAGUAR("Jaguar"),
    TESLA("Tesla"), ALFA_ROMEO("Alfa Romeo"),

    // 🏎️ Superdeportivos y Exóticos
    FERRARI("Ferrari"), LAMBORGHINI("Lamborghini"), MCLAREN("McLaren"), 
    ASTON_MARTIN("Aston Martin"), BUGATTI("Bugatti"), MASERATI("Maserati"),

    // 🛻 Trabajo y SUVs
    JEEP("Jeep"), RAM("RAM"), GMC("GMC"), MITSUBISHI("Mitsubishi"), 
    SUBARU("Subaru"), ISUZU("Isuzu"),

    // 🏍️ Motocicletas
    DUCATI("Ducati"), KAWASAKI("Kawasaki"), YAMAHA("Yamaha"), SUZUKI("Suzuki"), 
    HARLEY_DAVIDSON("Harley-Davidson"), KTM("KTM"), TRIUMPH("Triumph"), 
    BMW_MOTORRAD("BMW Motorrad"), HONDA_MOTOS("Honda Motos"),

    // 🇨🇳 Emergentes / Chinas (Alta presencia actual)
    MG("MG"), BYD("BYD"), CHERY("Chery"), GWM("GWM"), HAVAL("Haval");

    private final String nombreComercial;
}
