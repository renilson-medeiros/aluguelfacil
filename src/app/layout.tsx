import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
    title: {
        default: "Alugue Fácil - Gestão Inteligente de Imóveis",
        template: "%s | Alugue Fácil",
    },
    description: "A plataforma completa para proprietários gerenciarem aluguéis, inquilinos e comprovantes com praticidade, segurança e profissionalismo.",
    keywords: [
        "gestão de imóveis",
        "aluguel de imóveis",
        "gerenciamento de inquilinos",
        "comprovante de aluguel",
        "contrato de locação",
        "proprietário",
        "alugue fácil",
        "sistema imobiliário"
    ],
    authors: [{ name: "Renilson Medeiros" }],
    creator: "Renilson Medeiros",
    publisher: "Alugue Fácil",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: "website",
        locale: "pt_BR",
        url: "https://aluguefacil.vercel.app", 
        siteName: "Alugue Fácil",
        title: "Alugue Fácil - Gestão Inteligente de Imóveis",
        description: "Simplifique a administração dos seus aluguéis. Gestão de inquilinos, geração de comprovantes e controle total do seu patrimônio.",
        images: [
            {
                url: "/og-image.png", 
                width: 1200,
                height: 630,
                alt: "Alugue Fácil - Preview",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Alugue Fácil - Gestão Inteligente de Imóveis",
        description: "Simplifique a administração dos seus aluguéis com o Alugue Fácil.",
        creator: "@renilson",
        images: ["/og-image.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
