import PageLayout from "@/components/PageLayout";

const TerminosCondicionesPage = () => {
  return (
    <PageLayout>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Términos y Condiciones de Uso del Sitio Web
          </h1>
          <p className="text-sm text-muted-foreground mb-10">
            Última actualización: 24 de febrero de 2025
          </p>

          <div className="prose prose-slate max-w-none space-y-8 text-foreground/80 leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Aceptación de los Términos</h2>
              <p>
                Al acceder y utilizar el sitio web de Habana Salud Center (en adelante "el Sitio"), usted acepta cumplir y quedar obligado por los presentes Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, le solicitamos que no utilice nuestro Sitio.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Descripción de los Servicios</h2>
              <p className="mb-3">
                Habana Salud Center es una clínica de rehabilitación ubicada en Querétaro, Querétaro. A través de nuestro Sitio, ofrecemos los siguientes servicios en línea:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Agendamiento de citas médicas y de rehabilitación.</li>
                <li>Reserva y apartado de productos terapéuticos y de salud.</li>
                <li>Solicitud de informes sobre nuestros servicios y programas de rehabilitación.</li>
                <li>Consulta de información general sobre tratamientos y especialidades.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Uso Permitido del Sitio</h2>
              <p className="mb-3">
                El usuario se compromete a utilizar el Sitio únicamente para fines lícitos y de manera que no infrinja los derechos de terceros. Queda estrictamente prohibido:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Proporcionar información falsa o engañosa al agendar citas o solicitar informes.</li>
                <li>Usar el Sitio para fines distintos a los expresamente indicados.</li>
                <li>Intentar acceder sin autorización a sistemas o datos de la clínica.</li>
                <li>Reproducir, copiar o distribuir el contenido del Sitio sin autorización escrita.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Agendamiento de Citas</h2>
              <p>
                Las citas agendadas a través del Sitio están sujetas a disponibilidad y confirmación por parte del personal de la clínica. La clínica se reserva el derecho de reprogramar o cancelar citas por causas justificadas, notificando al paciente con la mayor anticipación posible. El usuario deberá presentarse puntualmente a su cita con identificación oficial. En caso de no poder asistir, deberá cancelar con al menos 24 horas de anticipación.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Apartado de Productos</h2>
              <p>
                El apartado de productos a través del Sitio constituye únicamente una reserva temporal y no implica la transferencia de propiedad hasta que se complete el proceso de pago en las instalaciones de la clínica o por el medio acordado. Los productos apartados estarán disponibles por un periodo máximo de 48 horas a partir de la confirmación. Transcurrido dicho plazo sin completar la adquisición, el apartado podrá ser cancelado.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Exactitud de la Información</h2>
              <p>
                Habana Salud Center se esfuerza por mantener la información del Sitio actualizada y precisa. Sin embargo, no garantizamos que el contenido esté libre de errores. La información publicada tiene carácter orientativo y no sustituye la evaluación médica presencial. Cualquier decisión de salud debe tomarse en consulta directa con nuestros profesionales.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Propiedad Intelectual</h2>
              <p>
                Todos los contenidos del Sitio, incluyendo textos, imágenes, logotipos y diseño gráfico, son propiedad de Habana Salud Center o se utilizan con autorización de sus titulares. Queda prohibida su reproducción total o parcial sin consentimiento escrito previo.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Limitación de Responsabilidad</h2>
              <p>
                Habana Salud Center no será responsable por daños directos, indirectos o consecuentes derivados del uso o imposibilidad de uso del Sitio, incluyendo interrupciones del servicio por mantenimiento, fallas técnicas o causas de fuerza mayor.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Modificaciones</h2>
              <p>
                Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en el Sitio. El uso continuado del Sitio después de dichas modificaciones implicará la aceptación de los nuevos términos.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">10. Legislación Aplicable</h2>
              <p>
                Estos Términos y Condiciones se rigen por las leyes de los Estados Unidos Mexicanos. Para cualquier controversia derivada del uso del Sitio, las partes se someten a la jurisdicción de los tribunales competentes en Querétaro, Querétaro, renunciando a cualquier otro fuero que pudiera corresponderles.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">11. Contacto</h2>
              <p>
                Para cualquier duda o aclaración sobre estos Términos y Condiciones, puede contactarnos a través de los medios disponibles en nuestro Sitio o acudir directamente a nuestras instalaciones en Querétaro, Querétaro.
              </p>
            </div>

            <div className="pt-6 border-t border-border text-sm text-muted-foreground">
              <p>© 2026 Habana Salud Center. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default TerminosCondicionesPage;
