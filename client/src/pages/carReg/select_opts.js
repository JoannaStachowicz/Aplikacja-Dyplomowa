// plik do opcji i stylizacji inputu typu select

export const selectOptions_type = [

    { value: "Samochód osobowy", label: "Samochód osobowy" },
    { value: "Samochód ciężarowy", label: "Samochód ciężarowy" },
    { value: "Motocykl", label: "Motocykl" }

];

// marki

export const selectOptions = [
    { value: "Abarth", label: "Abarth" },
    { value: "Alfa Romeo", label: "Alfa Romeo" },
    { value: "Aston Martin", label: "Aston Martin" },
    { value: "Audi", label: "Audi" },
    { value: "BMW", label: "BMW" },
    { value: "Bugatti", label: "Bugatti" },
    { value: "Buick", label: "Buick" },
    { value: "Cadillac", label: "Cadillac" },
    { value: "Chevrolet", label: "Chevrolet" },
    { value: "Chrysler", label: "Chrysler" },
    { value: "Citroën", label: "Citroën" },
    { value: "Dacia", label: "Dacia" },
    { value: "Daewoo", label: "Daewoo" },
    { value: "Dodge", label: "Dodge" },
    { value: "Fiat", label: "Fiat" },
    { value: "Ford", label: "Ford" },
    { value: "Genesis", label: "Genesis" },
    { value: "GMC", label: "GMC" },
    { value: "Honda", label: "Honda" },
    { value: "Hyundai", label: "Hyundai" },
    { value: "Infiniti", label: "Infiniti" },
    { value: "Jaguar", label: "Jaguar" },
    { value: "Jeep", label: "Jeep" },
    { value: "Kia", label: "Kia" },
    { value: "Lamborghini", label: "Lamborghini" },
    { value: "Land Rover", label: "Land Rover" },
    { value: "Lexus", label: "Lexus" },
    { value: "Lincoln", label: "Lincoln" },
    { value: "Maserati", label: "Maserati" },
    { value: "Mazda", label: "Mazda" },
    { value: "McLaren", label: "McLaren" },
    { value: "Mercedes-Benz", label: "Mercedes-Benz" },
    { value: "Mini", label: "Mini" },
    { value: "Mitsubishi", label: "Mitsubishi" },
    { value: "Nissan", label: "Nissan" },
    { value: "Pagani", label: "Pagani" },
    { value: "Peugeot", label: "Peugeot" },
    { value: "Porsche", label: "Porsche" },
    { value: "Ram", label: "Ram" },
    { value: "Renault", label: "Renault" },
    { value: "Rolls-Royce", label: "Rolls-Royce" },
    { value: "Saab", label: "Saab" },
    { value: "Saturn", label: "Saturn" },
    { value: "Škoda", label: "Škoda" },
    { value: "Subaru", label: "Subaru" },
    { value: "Suzuki", label: "Suzuki" },
    { value: "Tesla", label: "Tesla" },
    { value: "Toyota", label: "Toyota" },
    { value: "Volkswagen", label: "Volkswagen" },
    { value: "Volvo", label: "Volvo" },
    { value: "Zastava", label: "Zastava" },
    { value: "Harley-Davidson", label: "Harley-Davidson" },
    { value: "Yamaha", label: "Yamaha" },
    { value: "Kawasaki", label: "Kawasaki" },
    { value: "Triumph", label: "Triumph" },
    { value: "Indian", label: "Indian" },
    { value: "Ducati", label: "Ducati" },
    { value: "KTM", label: "KTM" }
];

// rodzaje nadwozia

export const selectOption_body = [
    { value: "suv", label: "SUV" },
    { value: "hatchback", label: "Hatchback" },
    { value: "sedan", label: "Sedan" },
    { value: "kombi", label: "Kombi" },
    { value: "coupe", label: "Coupé" },
    { value: "van", label: "Van" },
    { value: "minivan", label: "Minivan" },
    { value: "cabriolet", label: "Kabriolet" },
    { value: "cruiser", label: "Cruiser" },
    { value: "sport", label: "Sport" },
    { value: "touring", label: "Touring" },
    { value: "standard", label: "Standard" },
    { value: "adventure", label: "Adventure" },
    { value: "dual-sport", label: "Dual-Sport" },
    { value: "dirt-bike", label: "Dirt Bike" },
    { value: "naked", label: "Naked" },
    { value: "scooter", label: "Scooter" },
    { value: "cafe-racer", label: "Cafe Racer" },
    { value: "bobber", label: "Bobber" },
    { value: "chopper", label: "Chopper" },
    { value: "electric", label: "Electric" }
];

// styl dla inputu typu select

export const selectStyles = {
    control: (provided) => ({
        ...provided,
        height: '60px', 
        minHeight: '60px',
        border: '1px solid lightgray',
        borderRadius: '10px',

    }),
    valueContainer: (provided) => ({
        ...provided,
        height: '60px',
        padding: '0 10px',
        display: 'flex',
    }),
    singleValue: (provided) => ({
        ...provided,
        lineHeight: '60px', 
    }),

    dropdownIndicator: (provided) => ({
        ...provided,
    }),

    placeholder: (provided) => ({
        ...provided,
        fontSize: '14px',
        color: 'gray',    
    })
};
