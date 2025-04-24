/* ob: Interfaces auxiliares para métodos de pago y direcciones */

export interface PaymentMethod {
    id: number,
    type: string; // Ejemplo: 'Tarjeta', 'PayPal', etc.
    cardNumber: string; // Ejemplo: '**** **** **** 1234'
    expiry: string;
}

export interface DeliveryAddress {
    id: number;
    alias: string; // Ejemplo: 'Casa', 'Trabajo'
    street: string;
    city: string;    
    zip: string;
}

/* ob: Interfaz principal del usuario con datos extendidos */
export interface User {
    id: number;
    name: string;
    age: number;
    gender: string;
    email: string;
    username: string;
    password: string;    
    admin: boolean;

    /* ar: Métodos de pago deñ usuario */    
    paymentMethods: PaymentMethod[];

    /* ar: Direcciones de entrega del usuario */
    deliveryAddresses: DeliveryAddress[];
}