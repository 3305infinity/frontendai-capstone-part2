interface ProductResponse {
  title: string;
}

async function getProduct(): Promise<ProductResponse> {
  const response = await fetch("https://dummyjson.com/products/1", {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch product data");
  }

  return response.json() as Promise<ProductResponse>;
}

export default async function HealthPage() {
  const product = await getProduct();

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text)] sm:text-4xl">
          Health Check
        </h1>
        <p className="max-w-2xl text-base text-[var(--color-muted)] sm:text-lg">
          Server-rendered status page using a live external API response.
        </p>
      </header>

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm sm:p-8">
        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-[var(--color-muted)]">Status</dt>
            <dd className="mt-1 text-lg font-semibold text-[var(--color-accent)]">OK</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[var(--color-muted)]">Product title</dt>
            <dd className="mt-1 text-lg text-[var(--color-text)]">{product.title}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
