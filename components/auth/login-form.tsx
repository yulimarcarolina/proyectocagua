"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Lock, Mail, Eye, EyeOff, UserPlus, HelpCircle, ArrowLeft } from "lucide-react"
import { DEMO_CREDENTIALS, validateCredentials } from "@/lib/auth-credentials"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ViewState = "login" | "register" | "recovery" | "locked" | "security-questions"

export default function LoginForm({ onAuthenticate }: { onAuthenticate: (user: any) => void }) {
  const [view, setView] = useState<ViewState>("login")

  // Login State
  const [usuario, setUsuario] = useState("")
  const [contraseña, setContraseña] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Registration State
  const [regData, setRegData] = useState({
    nombre: "",
    usuario: "",
    contraseña: "",
    confirmarContraseña: "",
    ciudadNacimiento: "",
    nombrePadre: "",
    nombreMadre: "",
  })

  // Security Questions State (for login verification)
  const [securityAnswers, setSecurityAnswers] = useState({
    ciudadNacimiento: "",
    nombrePadre: "",
    nombreMadre: "",
  })
  const [pendingUser, setPendingUser] = useState<any>(null)

  // Recovery State
  const [recoveryData, setRecoveryData] = useState({
    usuario: "",
    respuesta: "",
    nuevaContraseña: "",
  })

  // Lockout State
  const [failedAttempts, setFailedAttempts] = useState<Record<string, number>>({})
  const [lockedUsers, setLockedUsers] = useState<Record<string, boolean>>({})

  // Simulated Database (in-memory + demo)
  const [users, setUsers] = useState(DEMO_CREDENTIALS)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Check if locked
    if (lockedUsers[usuario]) {
      setView("locked")
      setLoading(false)
      return
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const user = users.find(u => u.usuario === usuario && u.contraseña === contraseña)

    if (user) {
      // Credentials valid, now show security questions
      setPendingUser(user)
      setView("security-questions")
      setSecurityAnswers({ ciudadNacimiento: "", nombrePadre: "", nombreMadre: "" })
    } else {
      // Increment failed attempts
      const attempts = (failedAttempts[usuario] || 0) + 1
      setFailedAttempts(prev => ({ ...prev, [usuario]: attempts }))

      if (attempts >= 3) {
        setLockedUsers(prev => ({ ...prev, [usuario]: true }))
        setView("locked")
        setError("Cuenta bloqueada por múltiples intentos fallidos.")
      } else {
        setError(`Credenciales incorrectas. Intentos restantes: ${3 - attempts}`)
      }
    }
    setLoading(false)
  }

  const handleSecurityQuestions = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    await new Promise(resolve => setTimeout(resolve, 500))

    if (!pendingUser) {
      setError("Error de sesión. Por favor intenta nuevamente.")
      setLoading(false)
      return
    }

    // Verify all three security answers (case insensitive)
    const ciudad = securityAnswers.ciudadNacimiento.toLowerCase().trim()
    const padre = securityAnswers.nombrePadre.toLowerCase().trim()
    const madre = securityAnswers.nombreMadre.toLowerCase().trim()

    const ciudadCorrect = pendingUser.ciudadNacimiento?.toLowerCase().trim() === ciudad
    const padreCorrect = pendingUser.nombrePadre?.toLowerCase().trim() === padre
    const madreCorrect = pendingUser.nombreMadre?.toLowerCase().trim() === madre

    if (ciudadCorrect && padreCorrect && madreCorrect) {
      // All answers correct - grant access
      setFailedAttempts(prev => ({ ...prev, [usuario]: 0 }))
      onAuthenticate(pendingUser)
    } else {
      // Increment failed attempts for security questions
      const attempts = (failedAttempts[usuario] || 0) + 1
      setFailedAttempts(prev => ({ ...prev, [usuario]: attempts }))

      if (attempts >= 3) {
        setLockedUsers(prev => ({ ...prev, [usuario]: true }))
        setView("locked")
        setError("Cuenta bloqueada por múltiples respuestas incorrectas.")
      } else {
        setError(`Respuestas incorrectas. Intentos restantes: ${3 - attempts}`)
      }
      setPendingUser(null)
      setView("login")
    }
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (regData.contraseña !== regData.confirmarContraseña) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (users.some(u => u.usuario === regData.usuario)) {
      setError("El usuario ya existe")
      return
    }

    // Validate security questions are filled
    if (!regData.ciudadNacimiento || !regData.nombrePadre || !regData.nombreMadre) {
      setError("Debes completar todas las preguntas de seguridad")
      return
    }

    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))

    const newUser = {
      usuario: regData.usuario,
      contraseña: regData.contraseña,
      nombre: regData.nombre,
      rol: "usuario", // Default role
      jerarquia: "Oficial", // Default
      ciudadNacimiento: regData.ciudadNacimiento,
      nombrePadre: regData.nombrePadre,
      nombreMadre: regData.nombreMadre,
    }

    setUsers([...users, newUser])
    setLoading(false)
    setView("login")
    setUsuario(regData.usuario)
    setContraseña("")
    alert("Usuario registrado exitosamente")
  }

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const user = users.find(u => u.usuario === recoveryData.usuario)

    if (!user) {
      setError("Usuario no encontrado")
      setLoading(false)
      return
    }

    // Verify security answer (case insensitive for better UX)
    if (user.respuestaSeguridad?.toLowerCase() === recoveryData.respuesta.toLowerCase()) {
      // Unlock account
      setLockedUsers(prev => ({ ...prev, [recoveryData.usuario]: false }))
      setFailedAttempts(prev => ({ ...prev, [recoveryData.usuario]: 0 }))

      // Update password if provided (optional logic, but good for recovery)
      if (recoveryData.nuevaContraseña) {
        const updatedUsers = users.map(u =>
          u.usuario === recoveryData.usuario ? { ...u, contraseña: recoveryData.nuevaContraseña } : u
        )
        setUsers(updatedUsers)
      }

      setLoading(false)
      alert("Cuenta recuperada/desbloqueada exitosamente. Por favor inicia sesión.")
      setView("login")
      setUsuario(recoveryData.usuario)
      setContraseña("")
    } else {
      setError("Respuesta de seguridad incorrecta")
      setLoading(false)
    }
  }

  const getSecurityQuestion = () => {
    const user = users.find(u => u.usuario === (view === "locked" ? usuario : recoveryData.usuario))
    return user?.preguntaSeguridad || "¿Cuál es tu pregunta de seguridad?"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
              PST
            </div>
          </div>
          <CardTitle className="text-center text-2xl">Sistema PST</CardTitle>
          <CardDescription className="text-center">
            {view === "login" && "Gestión de Expedientes Judiciales"}
            {view === "register" && "Crear Nueva Cuenta"}
            {view === "recovery" && "Recuperación de Cuenta"}
            {view === "locked" && "Cuenta Bloqueada"}
            {view === "security-questions" && "Verificación de Seguridad"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* LOGIN VIEW */}
          {view === "login" && (
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Ingresar</TabsTrigger>
                <TabsTrigger value="demo">Credenciales</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="usuario">Usuario</Label>
                    <Input
                      id="usuario"
                      type="email"
                      placeholder="usuario@pst.gov"
                      value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="contraseña">Contraseña</Label>
                      <button
                        type="button"
                        onClick={() => setView("recovery")}
                        className="text-xs text-primary hover:underline"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="contraseña"
                        type={showPassword ? "text" : "password"}
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Verificando..." : "Ingresar"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setView("register")}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Registrarse
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="demo" className="space-y-3">
                {/* Demo credentials list (kept same as before) */}
                <p className="text-sm text-muted-foreground mb-3">Cuentas de demostración (no bloqueables):</p>
                {DEMO_CREDENTIALS.map((cred) => (
                  <div
                    key={cred.usuario}
                    className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => {
                      setUsuario(cred.usuario)
                      setContraseña(cred.contraseña)
                    }}
                  >
                    <div className="font-semibold text-sm">{cred.nombre}</div>
                    <div className="text-xs text-muted-foreground">{cred.rol}</div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          )}

          {/* REGISTER VIEW */}
          {view === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre Completo</Label>
                  <Input
                    value={regData.nombre}
                    onChange={(e) => setRegData({ ...regData, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Usuario (Email)</Label>
                  <Input
                    type="email"
                    value={regData.usuario}
                    onChange={(e) => setRegData({ ...regData, usuario: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Contraseña</Label>
                <Input
                  type="password"
                  value={regData.contraseña}
                  onChange={(e) => setRegData({ ...regData, contraseña: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Confirmar Contraseña</Label>
                <Input
                  type="password"
                  value={regData.confirmarContraseña}
                  onChange={(e) => setRegData({ ...regData, confirmarContraseña: e.target.value })}
                  required
                />
              </div>
              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-semibold mb-3 text-muted-foreground">Preguntas de Seguridad</p>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>¿En qué ciudad naciste?</Label>
                    <Input
                      placeholder="Ej. Caracas"
                      value={regData.ciudadNacimiento}
                      onChange={(e) => setRegData({ ...regData, ciudadNacimiento: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>¿Cómo se llama tu papá?</Label>
                    <Input
                      placeholder="Nombre del padre"
                      value={regData.nombrePadre}
                      onChange={(e) => setRegData({ ...regData, nombrePadre: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>¿Cómo se llama tu mamá?</Label>
                    <Input
                      placeholder="Nombre de la madre"
                      value={regData.nombreMadre}
                      onChange={(e) => setRegData({ ...regData, nombreMadre: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={() => setView("login")}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Registrando..." : "Crear Cuenta"}
                </Button>
              </div>
            </form>
          )}

          {/* SECURITY QUESTIONS VIEW */}
          {view === "security-questions" && (
            <form onSubmit={handleSecurityQuestions} className="space-y-4">
              <div className="p-3 bg-primary/10 text-primary rounded-md text-sm mb-4 flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Credenciales válidas. Por favor responde las preguntas de seguridad para completar el acceso.
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>¿En qué ciudad naciste?</Label>
                  <Input
                    placeholder="Ingresa tu ciudad de nacimiento"
                    value={securityAnswers.ciudadNacimiento}
                    onChange={(e) => setSecurityAnswers({ ...securityAnswers, ciudadNacimiento: e.target.value })}
                    required
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <Label>¿Cómo se llama tu papá?</Label>
                  <Input
                    placeholder="Nombre de tu padre"
                    value={securityAnswers.nombrePadre}
                    onChange={(e) => setSecurityAnswers({ ...securityAnswers, nombrePadre: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>¿Cómo se llama tu mamá?</Label>
                  <Input
                    placeholder="Nombre de tu madre"
                    value={securityAnswers.nombreMadre}
                    onChange={(e) => setSecurityAnswers({ ...securityAnswers, nombreMadre: e.target.value })}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setView("login")
                    setPendingUser(null)
                    setSecurityAnswers({ ciudadNacimiento: "", nombrePadre: "", nombreMadre: "" })
                  }}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Verificando..." : "Verificar"}
                </Button>
              </div>
            </form>
          )}

          {/* RECOVERY / LOCKED VIEW */}
          {(view === "recovery" || view === "locked") && (
            <form onSubmit={handleRecovery} className="space-y-4">
              {view === "locked" && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm mb-4 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Tu cuenta ha sido bloqueada por seguridad. Responde tu pregunta secreta para desbloquearla.
                </div>
              )}

              <div className="space-y-2">
                <Label>Usuario a recuperar</Label>
                <Input
                  value={view === "locked" ? usuario : recoveryData.usuario}
                  onChange={(e) => setRecoveryData({ ...recoveryData, usuario: e.target.value })}
                  disabled={view === "locked"}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Pregunta de Seguridad
                </Label>
                <div className="p-3 bg-muted rounded-md text-sm font-medium">
                  {getSecurityQuestion()}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Respuesta</Label>
                <Input
                  type="password"
                  value={recoveryData.respuesta}
                  onChange={(e) => setRecoveryData({ ...recoveryData, respuesta: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Nueva Contraseña (Opcional)</Label>
                <Input
                  type="password"
                  placeholder="Dejar en blanco para mantener la actual"
                  value={recoveryData.nuevaContraseña}
                  onChange={(e) => setRecoveryData({ ...recoveryData, nuevaContraseña: e.target.value })}
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={() => setView("login")}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Verificando..." : "Recuperar Cuenta"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
