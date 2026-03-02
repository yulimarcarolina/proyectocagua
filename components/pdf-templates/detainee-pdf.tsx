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
        width: '40%',
        fontWeight: 'bold',
    },
    value: {
        width: '60%',
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

interface DetaineeData {
    nombre: string;
    apellido: string;
    numero_pasaporte: string;
    fecha_nacimiento: string;
    nacionalidad: string;
    estado_civil: string;
    profesion: string;
    direccion: string;
    telefono: string;
    motivo_detencion: string;
    fecha_detencion: string;
    situacion_juridica: string;
}

interface DetaineePDFProps {
    detainee: DetaineeData;
    caseNumber: string;
}

export const DetaineePDF = ({ detainee, caseNumber }: DetaineePDFProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>FICHA DE DETENIDO</Text>
                <Text style={styles.subtitle}>Policía Municipal de Cagua</Text>
                <Text style={styles.subtitle}>Caso: {caseNumber}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>DATOS PERSONALES</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Nombre Completo:</Text>
                    <Text style={styles.value}>{detainee.nombre} {detainee.apellido}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Cédula/Pasaporte:</Text>
                    <Text style={styles.value}>{detainee.numero_pasaporte}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Fecha de Nacimiento:</Text>
                    <Text style={styles.value}>{detainee.fecha_nacimiento}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Nacionalidad:</Text>
                    <Text style={styles.value}>{detainee.nacionalidad}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Estado Civil:</Text>
                    <Text style={styles.value}>{detainee.estado_civil}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Profesión:</Text>
                    <Text style={styles.value}>{detainee.profesion}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>DATOS DE CONTACTO</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Dirección:</Text>
                    <Text style={styles.value}>{detainee.direccion}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Teléfono:</Text>
                    <Text style={styles.value}>{detainee.telefono}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>INFORMACIÓN LEGAL</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Motivo de Detención:</Text>
                    <Text style={styles.value}>{detainee.motivo_detencion}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Fecha de Detención:</Text>
                    <Text style={styles.value}>{detainee.fecha_detencion}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Situación Jurídica:</Text>
                    <Text style={styles.value}>{detainee.situacion_juridica}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Text>Documento generado el {new Date().toLocaleDateString('es-VE')}</Text>
                <Text>Policía Municipal de Cagua - Sistema de Gestión Policial</Text>
            </View>
        </Page>
    </Document>
);
