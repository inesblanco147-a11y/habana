import PageLayout from "@/components/PageLayout";

const PoliticaPrivacidadPage = () => {
  return (
    <PageLayout>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Aviso de Privacidad
          </h1>
          <p className="text-sm text-muted-foreground mb-10">
            Última actualización: 24 de febrero de 2025
          </p>

          <div className="prose prose-slate max-w-none space-y-8 text-foreground/80 leading-relaxed">
            <p>
              En cumplimiento con lo dispuesto por la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y su Reglamento, Habana Salud Center pone a disposición del titular el presente Aviso de Privacidad.
            </p>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">I. Identidad y Domicilio del Responsable</h2>
              <p>
                Habana Salud Center, con domicilio en Querétaro, Querétaro, México, es responsable del tratamiento de los datos personales que usted nos proporcione a través de nuestro sitio web y demás medios de contacto.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">II. Datos Personales que se Recaban</h2>
              <p className="mb-3">Para llevar a cabo las finalidades descritas en el presente Aviso, recabamos las siguientes categorías de datos personales:</p>
              
              <h3 className="text-lg font-medium text-foreground mb-2">Datos de identificación y contacto:</h3>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Nombre completo</li>
                <li>Número de teléfono</li>
                <li>Correo electrónico</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mb-2">Datos sensibles de salud:</h3>
              <p className="mb-2">
                En virtud de la naturaleza de nuestros servicios de rehabilitación, podemos recabar datos considerados como sensibles en términos de la LFPDPPP, tales como:
              </p>
              <ul className="list-disc pl-6 space-y-1 mb-3">
                <li>Motivo de consulta o rehabilitación</li>
                <li>Historial médico relevante para la atención solicitada</li>
                <li>Padecimientos, lesiones o condiciones de salud</li>
              </ul>
              <p>
                El tratamiento de datos sensibles se realizará con su consentimiento expreso y únicamente para las finalidades aquí descritas, observando las medidas de seguridad reforzadas que establece la ley.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">III. Finalidades del Tratamiento</h2>
              <p className="mb-3">Sus datos personales serán utilizados para las siguientes finalidades primarias, las cuales son necesarias para el servicio que solicita:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Agendar y gestionar citas médicas o de rehabilitación.</li>
                <li>Apartar y reservar productos terapéuticos o de salud.</li>
                <li>Proporcionar informes sobre los servicios, programas y tratamientos de la clínica.</li>
                <li>Dar seguimiento a su atención y citas programadas.</li>
                <li>Contactarle para confirmar, recordar o reprogramar citas.</li>
              </ul>
              <p className="mb-3">De manera secundaria, y siempre que usted no manifieste su oposición, sus datos podrán utilizarse para:</p>
              <ul className="list-disc pl-6 space-y-1 mb-3">
                <li>Envío de información sobre nuevos servicios, promociones o eventos de la clínica.</li>
                <li>Realización de encuestas de satisfacción para mejorar nuestros servicios.</li>
              </ul>
              <p>
                Si desea que sus datos no sean tratados para las finalidades secundarias, puede manifestarlo enviando un correo a nuestra dirección de contacto o acudiendo directamente a nuestras instalaciones.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">IV. Transferencia de Datos Personales</h2>
              <p>
                Sus datos personales no serán transferidos a terceros sin su consentimiento, salvo en los casos previstos por el artículo 37 de la LFPDPPP, o cuando sea necesario para la prestación del servicio médico (por ejemplo, referencia a otros especialistas o instituciones de salud con su conocimiento).
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">V. Derechos ARCO</h2>
              <p className="mb-3">
                Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse (derechos ARCO) al tratamiento de sus datos personales. Para ejercerlos, puede presentar su solicitud:
              </p>
              <ul className="list-disc pl-6 space-y-1 mb-3">
                <li>Acudiendo directamente a nuestras instalaciones en Querétaro, Querétaro.</li>
                <li>Enviando un correo electrónico a través de los medios de contacto disponibles en nuestro sitio web.</li>
              </ul>
              <p>
                Su solicitud deberá incluir: nombre completo, descripción clara de los datos sobre los que se ejercerá el derecho, y cualquier documento que facilite su localización. Responderemos en un plazo máximo de 20 días hábiles.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">VI. Revocación del Consentimiento</h2>
              <p>
                Usted puede revocar su consentimiento para el tratamiento de sus datos personales en cualquier momento, siempre que no exista una obligación legal que impida hacerlo. Para iniciar el procedimiento de revocación, utilice los mismos medios indicados para el ejercicio de los derechos ARCO.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">VII. Uso de Cookies y Tecnologías de Rastreo</h2>
              <p>
                Nuestro sitio web puede utilizar cookies y tecnologías similares para mejorar la experiencia de navegación y recopilar información estadística de uso. Estas tecnologías no recaban datos personales de manera directa. Usted puede desactivar el uso de cookies a través de la configuración de su navegador, aunque esto podría limitar algunas funcionalidades del Sitio.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">VIII. Medidas de Seguridad</h2>
              <p>
                Habana Salud Center ha implementado medidas de seguridad administrativas, técnicas y físicas para proteger sus datos personales contra daño, pérdida, alteración, destrucción, uso, acceso o tratamiento no autorizado.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">IX. Modificaciones al Aviso de Privacidad</h2>
              <p>
                El presente Aviso de Privacidad puede ser modificado en cualquier momento. Cualquier cambio será comunicado a través de nuestro sitio web. La fecha de la última actualización se indica al inicio de este documento.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">X. Autoridad</h2>
              <p>
                Si considera que su derecho a la protección de datos personales ha sido vulnerado, puede acudir al Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI) en{" "}
                <a href="https://www.inai.org.mx" target="_blank" rel="noopener noreferrer" className="text-hasace-red hover:underline">
                  www.inai.org.mx
                </a>.
              </p>
            </div>

            <div className="pt-6 border-t border-border text-sm text-muted-foreground">
              <p>© 2026 Habana Salud Center. Todos los derechos reservados. | Querétaro, Querétaro, México</p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default PoliticaPrivacidadPage;
