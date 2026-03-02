export interface Credential {
  usuario: string
  contraseña: string
  nombre: string
  rol: string
  jerarquia: string
  // Three mandatory security questions
  ciudadNacimiento: string
  nombrePadre: string
  nombreMadre: string
  // Legacy field for backward compatibility
  preguntaSeguridad?: string
  respuestaSeguridad?: string
}

export const DEMO_CREDENTIALS: Credential[] = [
  {
    usuario: "director@pst.gov",
    contraseña: "123456",
    nombre: "Carlos Director",
    rol: "DIRECTOR",
    jerarquia: "Comisario General",
    ciudadNacimiento: "Caracas",
    nombrePadre: "José",
    nombreMadre: "María",
    preguntaSeguridad: "¿Nombre de tu primera mascota?",
    respuestaSeguridad: "firulais",
  },
  {
    usuario: "coordinador@pst.gov",
    contraseña: "123456",
    nombre: "María Coordinadora",
    rol: "COORDINADOR",
    jerarquia: "Inspector Jefe",
    ciudadNacimiento: "Cagua",
    nombrePadre: "Pedro",
    nombreMadre: "Ana",
    preguntaSeguridad: "¿Ciudad de nacimiento?",
    respuestaSeguridad: "cagua",
  },
  {
    usuario: "funcionario@pst.gov",
    contraseña: "123456",
    nombre: "Juan Funcionario",
    rol: "FUNCIONARIO",
    jerarquia: "Oficial",
    ciudadNacimiento: "Maracay",
    nombrePadre: "Luis",
    nombreMadre: "Carmen",
    preguntaSeguridad: "¿Comida favorita?",
    respuestaSeguridad: "pizza",
  },
]

export function validateCredentials(usuario: string, contraseña: string): Credential | null {
  const credential = DEMO_CREDENTIALS.find((cred) => cred.usuario === usuario && cred.contraseña === contraseña)
  return credential || null
}
