import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import PropertyDetail from "@/modules/PropertyDetail";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();

    const { data: imovel } = await supabase
        .from('imoveis')
        .select(`
      *,
      profiles(nome_completo)
    `)
        .eq('id', id)
        .single();

    if (!imovel) {
        return {
            title: {
                absolute: 'Alugue Fácil | Imóvel não encontrado'
            },
            description: 'O imóvel solicitado não foi encontrado.',
        };
    }

    const title = imovel.titulo || `${imovel.endereco_rua}, ${imovel.endereco_numero} - ${imovel.endereco_bairro}`;
    const price = imovel.valor_aluguel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const description = `Confira este imóvel: ${imovel.tipo} com ${imovel.quartos} quartos em ${imovel.endereco_cidade}. Aluguel por apenas ${price}. Veja mais detalhes e fotos no Alugue Fácil!`;

    const firstImage = imovel.fotos?.[0] || '/frame-preview.png';

    return {
        title: {
            absolute: `Alugue Fácil | ${title}`
        },
        description,
        openGraph: {
            title: `Alugue Fácil | ${title}`,
            description,
            images: [firstImage],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `Alugue Fácil | ${title}`,
            description,
            images: [firstImage],
        },
    };
}

export default function PropertyDetailPage() {
    return <PropertyDetail />;
}
