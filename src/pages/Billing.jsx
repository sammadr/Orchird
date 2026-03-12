import PageHeader from '../components/organisms/PageHeader'

function Billing() {
  const draft = JSON.parse(localStorage.getItem('orchirdCheckoutDraft') ?? 'null')

  return (
    <>
      <PageHeader title="Facturación" description="Vista de facturación del producto seleccionado." />
      <section className="container-x pb-16">
        <div className="rounded-2xl border border-(--orchird-lilac)/60 bg-white p-6 shadow-sm">
          <p className="text-sm text-(--orchird-black)/75">
            Esta vista se completara en el siguiente paso con direccion, metodo de pago y resumen final.
          </p>

          {draft ? (
            <div className="mt-5 rounded-xl bg-(--orchird-smoke) p-4 text-sm">
              <p><strong>Producto ID:</strong> {draft.productId}</p>
              <p><strong>Cantidad:</strong> {draft.quantity}</p>
              <p><strong>Total:</strong> RD$ {Number(draft.total ?? 0).toLocaleString('en-US')}</p>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}

export default Billing
