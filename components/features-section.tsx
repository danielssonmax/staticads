export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* First Features Block */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight max-w-4xl mx-auto">
            The{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">modern</span>{" "}
            <span className="text-orange-500">way</span> to make static ads that win, from the world's largest library
            of{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              proven ad templates
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="rounded-2xl border bg-white p-8">
            <h3 className="text-2xl font-bold mb-4">Over 1900+ Unique Templates</h3>
            <p className="text-gray-600 mb-6">
              Select from over 1900+ templates in our extensive library, you can find any creative, for any test, at
              anytime.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <img
                src="/images/design-mode/1058.webp"
                alt="Template Example 1"
                className="rounded-lg w-full aspect-square object-cover"
              />
              <img
                src="/images/design-mode/1057.webp"
                alt="Template Example 2"
                className="rounded-lg w-full aspect-square object-cover"
              />
              <img
                src="/images/design-mode/1056.webp"
                alt="Template Example 3"
                className="rounded-lg w-full aspect-square object-cover"
              />
            </div>
          </div>
          <div className="rounded-2xl border bg-white p-8">
            <h3 className="text-2xl font-bold mb-4">50 New Templates Every Week</h3>
            <p className="text-gray-600 mb-6">
              Our team is constantly researching what's working across the top brands around the world, adding a minimum
              of 50 new ad templates per week to the Staticflow ad library.
            </p>
            <img
              src="/images/design-mode/1055.webp"
              alt="Weekly Templates"
              className="rounded-lg w-full aspect-video object-cover"
            />
          </div>
        </div>

        {/* Performance Criteria Section */}
        <div className="mb-16">
          <h3 className="text-2xl text-purple-600 font-semibold mb-4">What sets our templates apart?</h3>
          <h2 className="text-4xl font-bold mb-6">
            Each template meets our{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              performance
            </span>{" "}
            <span className="text-orange-500">criteria</span>
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Each week, we search the Meta Ads Library to carefully select the best static ads and transform them into
            easy to use templates. An ad is chosen only if it meets at least two of the following criteria →
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl border bg-white p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🌟</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Has been running for over 30+ days</h4>
              <p className="text-gray-600">Longer duration is a sign it's producing strong metrics.</p>
            </div>
            <div className="rounded-xl border bg-white p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Fast growing $1M+ brands</h4>
              <p className="text-gray-600">We consider only the best brands from around the world.</p>
            </div>
            <div className="rounded-xl border bg-white p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Unique concepts or visuals</h4>
              <p className="text-gray-600">Fresh creatives with unique concepts that grab attention and stand out.</p>
            </div>
            <div className="rounded-xl border bg-white p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">✍️</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Strong hook or copy</h4>
              <p className="text-gray-600">Effective hooks and copy are crucial for grabbing attention.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
