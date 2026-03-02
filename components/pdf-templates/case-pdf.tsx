import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 11,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
        borderBottom: '2 solid #000',
        paddingBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 8,
        backgroundColor: '#f0f0f0',
        padding: 5,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    label: {
        width: '35%',
        fontWeight: 'bold',
    },
    value: {
        width: '65%',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 9,
        color: '#666',
        borderTop: '1 solid #ccc',
        paddingTop: 10,
    },
});

interface CaseData {
    numero: string;
    partes: string;
    estado: string;
    fecha: string;
    descripcion?: string;
    encargado?: string;
    fullData?: any;
}

interface CasePDFProps {
    caseData: CaseData;
}

export const CasePDF = ({ caseData }: CasePDFProps) => {
    const detainee = caseData.fullData?.detenido;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>REPORTE DE CASO</Text>
                    <Text style={styles.subtitle}>Policía Municipal de Cagua</Text>
                    <Text style={styles.subtitle}>Caso: {caseData.numero}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>INFORMACIÓN DEL CASO</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Número de Caso:</Text>
                        <Text style={styles.value}>{caseData.numero}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Partes:</Text>
                        <Text style={styles.value}>{caseData.partes}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Estado:</Text>
                        <Text style={styles.value}>{caseData.estado}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Fecha de Registro:</Text>
                        <Text style={styles.value}>{caseData.fecha}</Text>
                    </View>
                    {caseData.encargado && (
                        <View style={styles.row}>
                            <Text style={styles.label}>Funcionario Encargado:</Text>
                            <Text style={styles.value}>{caseData.encargado}</Text>
                        </View>
                    )}
                </View>

                {caseData.descripcion && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>DESCRIPCIÓN</Text>
                        <Text>{caseData.descripcion}</Text>
                    </View>
                )}

                {detainee && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>DATOS DEL DETENIDO</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Nombre:</Text>
                            <Text style={styles.value}>{detainee.nombre} {detainee.apellido}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Cédula:</Text>
                            <Text style={styles.value}>{detainee.numero_pasaporte}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Motivo:</Text>
                            <Text style={styles.value}>{detainee.motivo_detencion}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Situación Jurídica:</Text>
                            <Text style={styles.value}>{detainee.situacion_juridica}</Text>
                        </View>
                    </View>
                )}

                <View style={styles.footer}>
                    <Text>Documento generado el {new Date().toLocaleDateString('es-VE')}</Text>
                    <Text>Policía Municipal de Cagua - Sistema de Gestión Policial</Text>
                </View>
            </Page>
        </Document>
    );
};
