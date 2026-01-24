export interface Property {
    id: string;
    title: string;
    status: 'disponivel' | 'alugado' | 'manutencao';
    images: string[];
    address: {
        street: string;
        number: string;
        complement: string | null;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
    };
    details: {
        bedrooms: number | null;
        bathrooms: number | null;
        area: number | null;
        garage: boolean;
        garageSpots: number;
        acceptsPets: boolean;
        maxPeople: number | null;
        acceptsChildren: boolean;
    };
    rooms: string[];
    pricing: {
        rent: number;
        condominium: number;
        iptu: number;
        serviceFee: number;
    };
    included: {
        water: boolean;
        electricity: boolean;
        internet: boolean;
        gas: boolean;
    };
    observations: string | null;
    owner: {
        id: string;
        name: string;
        whatsapp: string;
    };
}

export interface HistoricalTenant {
    id: string;
    nome_completo: string;
    data_inicio: string;
    data_fim: string | null;
    status: 'ativo' | 'inativo';
    valor_aluguel: number;
}
