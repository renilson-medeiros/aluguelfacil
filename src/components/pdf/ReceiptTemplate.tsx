import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register a nice font if possible, or use standard ones
// For simplicity in this first version, we'll use standard fonts

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    margin: 10,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontSize: 10,
    color: '#6B7280',
    width: 80,
  },
  value: {
    fontSize: 10,
    fontWeight: 'bold',
    flex: 1,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginVertical: 10,
  },
  valuesSection: {
    marginTop: 10,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  valueLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  valueAmount: {
    fontSize: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563EB', // Blue-600
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
    borderStyle: 'dashed',
  },
  footerText: {
    fontSize: 8,
    color: '#9CA3AF',
  },
});

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
  paymentDate: Date;
  observations?: string;
}

interface ReceiptTemplateProps {
  data: ReceiptData;
}

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export const ReceiptTemplate = ({ data }: ReceiptTemplateProps) => {
  const monthName = months[parseInt(data.referenceMonth) - 1];
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Comprovante de Pagamento</Text>
          <Text style={styles.subtitle}>Referente a {monthName}/{data.referenceYear}</Text>
        </View>

        {/* Tenant Info */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Inquilino:</Text>
            <Text style={styles.value}>{data.tenantName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>CPF:</Text>
            <Text style={styles.value}>{data.tenantCpf}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Imóvel:</Text>
            <Text style={styles.value}>{data.propertyName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Endereço:</Text>
            <Text style={styles.value}>{data.propertyAddress}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Values */}
        <View style={[styles.section, styles.valuesSection]}>
          <View style={styles.valueRow}>
            <Text style={styles.valueLabel}>Aluguel</Text>
            <Text style={styles.valueAmount}>{data.rentValue}</Text>
          </View>
          
          {data.condoValue && data.condoValue !== "R$ 0,00" && (
            <View style={styles.valueRow}>
              <Text style={styles.valueLabel}>Condomínio</Text>
              <Text style={styles.valueAmount}>{data.condoValue}</Text>
            </View>
          )}
          
          {data.iptuValue && data.iptuValue !== "R$ 0,00" && (
            <View style={styles.valueRow}>
              <Text style={styles.valueLabel}>IPTU</Text>
              <Text style={styles.valueAmount}>{data.iptuValue}</Text>
            </View>
          )}

          {data.otherValue && data.otherValue !== "R$ 0,00" && (
            <View style={styles.valueRow}>
              <Text style={styles.valueLabel}>Outros</Text>
              <Text style={styles.valueAmount}>{data.otherValue}</Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>{data.totalValue}</Text>
          </View>
        </View>

        {/* Payment Date */}
        <View style={styles.section}>
            <Text style={{ fontSize: 10, color: '#6B7280', textAlign: 'center', marginTop: 20 }}>
                Data do pagamento: {data.paymentDate.toLocaleDateString('pt-BR')}
            </Text>
        </View>

        {/* Observations */}
        {data.observations && (
          <View style={styles.section}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 5 }}>Observações:</Text>
            <Text style={{ fontSize: 10, color: '#374151' }}>{data.observations}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Comprovante gerado automaticamente via plataforma Lugo (Alugue Fácil) em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
