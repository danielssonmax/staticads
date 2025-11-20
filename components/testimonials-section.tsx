import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Milan T.",
    avatar: "/placeholder.svg?height=64&width=64",
    quote:
      "Staticadtemplates templates have been seriously good for our creative strategy. Performance across the board has increased massively!",
    stars: 5,
  },
  {
    name: "Ethan S.",
    avatar: "/placeholder.svg?height=64&width=64",
    quote:
      "Great for any brand owner looking for a fast and easy way to crank out new ads quickly. I have no design experience but these templates are super beginner friendly and it makes launching new ads a breeze",
    stars: 5,
  },
  {
    name: "Sofia R.",
    avatar: "/placeholder.svg?height=64&width=64",
    quote:
      "Any time I'm struggling to create new ads for our brand, I head straight over to Staticflow. The templates are great, super easy to use and speed up the process ten fold... I love it.",
    stars: 5,
  },
  {
    name: "Clara P.",
    avatar: "/placeholder.svg?height=64&width=64",
    quote:
      "Spent $500 at a 35 CAC. So far so good. These templates are beating all of our current static ads, so this platform is looking promising for launching winning ads!",
    stars: 5,
  },
  {
    name: "Hugo R.",
    avatar: "/placeholder.svg?height=64&width=64",
    quote:
      "Staticadtemplates.com helps us create winning ads for our clients' brands. Performance has never been better across all of our client accounts.",
    stars: 5,
  },
  {
    name: "Alice N.",
    avatar: "/placeholder.svg?height=64&width=64",
    quote:
      "Before Staticadtemplates.com, I had to scout ad library for hours to find inspiration. Now all our creative reference is stored in one place. I'm obsessed...",
    stars: 5,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Not convinced? Here's what our{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              customers
            </span>{" "}
            have to say
          </h2>
          <p className="text-xl text-gray-600">Sounds like they love it?... We're sure you will too!</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="bg-white rounded-xl border p-6">
              <div className="flex gap-1 mb-4">
                {Array(testimonial.stars)
                  .fill(null)
                  .map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
              </div>
              <p className="text-gray-600 mb-6">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
