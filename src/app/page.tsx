export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          <span className="text-good-600">一日一善</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          毎日1つの善行で、より良い自分と社会を築こう
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="#"
            className="rounded-md bg-good-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-good-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-good-600"
          >
            始める
          </a>
          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            詳しく見る <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
} 