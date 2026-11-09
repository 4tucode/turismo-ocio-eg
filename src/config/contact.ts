// Datos de contacto que se muestran en el pie y en los espacios de publicidad.
// Un campo vacío no se muestra.
export const CONTACT = {
  // Número tal como se verá, con prefijo: '+240 222 000 000'
  phone: '+240 555 52 92 92',
  email: ''
}

// Enlace tel: sin espacios ni guiones
export const phoneHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`
