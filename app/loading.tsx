export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f7f8f4] px-6 py-24 text-[#141d13] dark:bg-[#10150f] dark:text-[#f5f7f2]">
      <div className="mx-auto max-w-7xl">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-[#dfe6dc] dark:bg-[#273425]" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-lg border border-[#d5ddd1] bg-white dark:border-[#334330] dark:bg-[#172017]"
            >
              <div className="aspect-[1.2] animate-pulse bg-[#dfe6dc] dark:bg-[#273425]" />
              <div className="space-y-4 p-4">
                <div className="h-6 w-24 animate-pulse rounded bg-[#dfe6dc] dark:bg-[#273425]" />
                <div className="h-5 w-40 animate-pulse rounded bg-[#dfe6dc] dark:bg-[#273425]" />
                <div className="h-5 w-32 animate-pulse rounded bg-[#dfe6dc] dark:bg-[#273425]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
