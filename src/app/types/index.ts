export enum ProductCategory {

    HDD = "Disco Duro Mecánico",
    SSD_SATA = "SSD SATA",
    SSD_M2_NVME = "SSD M.2 NVMe",
    MICRO_SD = "MicroSD",
    SD_CARD = "Tarjeta SD",
    USB = "Memoria USB"

  }
  
  export interface Product {
    
    id: number;
    name: string;
    brand: string;
    model: string;

    category: ProductCategory;

    capacity: string;
    speed: string;
    sku: string;
    description: string;
    price: number;
    available: boolean;
    deliveryOption: string;
    quantity: number;
    image: string;

  }

  export type CartItem = Product & { quantity: number };
   