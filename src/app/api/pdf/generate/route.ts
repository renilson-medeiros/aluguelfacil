import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import jsPDF from 'jspdf';

export const dynamic = 'force-dynamic';

interface ReceiptData {
    referenceMonth: string;
    referenceYear: string;
    tenantName: string;
    tenantCpf: string;
    propertyName: string;
    propertyAddress: string;
    rentValue: string;
    condoValue?: string;
    iptuValue?: string;
    otherValue?: string;
    totalValue: string;
    paymentDate: string;
    observations?: string;
}

interface RequestBody {
    data: ReceiptData;
    userId: string;
    propertyId: string;
    tenantId: string;
}

const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export async function POST(request: NextRequest) {
    try {
        // Criar cliente Supabase autenticado
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    },
                },
            }
        );

        const body: RequestBody = await request.json();
        const { data, userId, propertyId } = body;

        // Criar PDF com jsPDF
        const doc = new jsPDF();
        const monthName = months[parseInt(data.referenceMonth) - 1];

        // Configurar fonte e cores
        doc.setFont('helvetica');

        // Header
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('COMPROVANTE DE PAGAMENTO', 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(`Referente a ${monthName}/${data.referenceYear}`, 105, 28, { align: 'center' });

        // Linha separadora
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 32, 190, 32);

        // Informações do Inquilino
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        let yPos = 45;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('Inquilino:', 20, yPos);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(data.tenantName, 50, yPos);

        yPos += 7;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('CPF:', 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(data.tenantCpf, 50, yPos);

        yPos += 7;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('Imóvel:', 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(data.propertyName, 50, yPos);

        yPos += 7;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('Endereço:', 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        const addressLines = doc.splitTextToSize(data.propertyAddress, 140);
        doc.text(addressLines, 50, yPos);

        yPos += (addressLines.length * 7) + 5;

        // Linha separadora
        doc.line(20, yPos, 190, yPos);
        yPos += 10;

        // Valores
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('Aluguel', 20, yPos);
        doc.setTextColor(0, 0, 0);
        doc.text(data.rentValue, 190, yPos, { align: 'right' });

        if (data.condoValue && data.condoValue !== "R$ 0,00") {
            yPos += 7;
            doc.setTextColor(100, 100, 100);
            doc.text('Condomínio', 20, yPos);
            doc.setTextColor(0, 0, 0);
            doc.text(data.condoValue, 190, yPos, { align: 'right' });
        }

        if (data.iptuValue && data.iptuValue !== "R$ 0,00") {
            yPos += 7;
            doc.setTextColor(100, 100, 100);
            doc.text('IPTU', 20, yPos);
            doc.setTextColor(0, 0, 0);
            doc.text(data.iptuValue, 190, yPos, { align: 'right' });
        }

        if (data.otherValue && data.otherValue !== "R$ 0,00") {
            yPos += 7;
            doc.setTextColor(100, 100, 100);
            doc.text('Outros', 20, yPos);
            doc.setTextColor(0, 0, 0);
            doc.text(data.otherValue, 190, yPos, { align: 'right' });
        }

        yPos += 10;
        doc.line(20, yPos, 190, yPos);
        yPos += 7;

        // Total
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Total', 20, yPos);
        doc.setTextColor(37, 99, 235); // Blue-600
        doc.text(data.totalValue, 190, yPos, { align: 'right' });

        yPos += 15;

        // Data do pagamento
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        const paymentDate = new Date(data.paymentDate);
        doc.text(`Data do pagamento: ${paymentDate.toLocaleDateString('pt-BR')}`, 105, yPos, { align: 'center' });

        // Observações
        if (data.observations) {
            yPos += 10;
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text('Observações:', 20, yPos);
            yPos += 5;
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(55, 65, 81);
            const obsLines = doc.splitTextToSize(data.observations, 170);
            doc.text(obsLines, 20, yPos);
        }

        // Footer
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(156, 163, 175);
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 270, 190, 270);
        const now = new Date();
        doc.text(
            `Comprovante gerado automaticamente via plataforma Lugo (Alugue Fácil) em ${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR')}`,
            105,
            275,
            { align: 'center' }
        );

        // Converter para buffer
        const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

        // Upload para Supabase Storage
        const fileName = `${userId}/${propertyId}/comprovantes/${Date.now()}-${data.tenantName.replace(/\s+/g, '-')}.pdf`;

        const { error: uploadError } = await supabase.storage
            .from('imoveis-fotos')
            .upload(fileName, pdfBuffer, {
                contentType: 'application/pdf',
                upsert: false
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            throw uploadError;
        }

        // Obter URL pública
        const { data: { publicUrl } } = supabase.storage
            .from('imoveis-fotos')
            .getPublicUrl(fileName);

        // Retornar URL e buffer
        return NextResponse.json({
            success: true,
            pdfUrl: publicUrl,
            pdfBuffer: Array.from(pdfBuffer),
        });

    } catch (error: any) {
        console.error('Error generating PDF:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to generate PDF' },
            { status: 500 }
        );
    }
}
