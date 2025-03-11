'use client'
import Image from "next/image"
import Link from "next/link"
import { MapPin, MessageSquare, Calendar, Info, Navigation, Cloud, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.jpg" alt="Juanito" className="rounded-full w-10 h-10" width={32} height={32} />
            <span className="text-xl font-bold">Juanito</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link href="#benefits" className="text-sm font-medium hover:text-primary">
              Benefits
            </Link>
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Get Started
            </Link>
          </nav>
          <Button size="sm" onClick={() => router.push("/")}>Get Started</Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20" />
          <div className="container relative flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Discover San Juan, Batangas
              <br />
              <span className="text-primary">Like a Local</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
              Your personal travel companion that helps you explore San Juan's beaches, hidden gems, and local culture
              in a sustainable and authentic way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2" onClick={() => router.push("/")}>
                <span>Get Started</span>
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* App Preview */}
        <section className="container py-12 md:py-24">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-xl bg-gradient-to-b from-blue-100 to-blue-50 dark:from-blue-900/50 dark:to-blue-800/50 p-4 md:p-8 shadow-xl">
            <Image
              src="/image.png"
              alt="Juanito App Preview"
              width={1200}
              height={600}
              className="rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end justify-center pb-8">
              <Button size="lg" className="gap-2" onClick={() => router.push("/")}>
                <span>See it in action</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-muted py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Main Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Juanito comes packed with everything you need to explore San Juan like a local.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-background rounded-lg p-6 shadow-md">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Navigation className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Interactive Map</h3>
                <p className="text-muted-foreground mb-4">
                  Explore San Juan with our interactive map showing tourist destinations, accommodations, and local
                  attractions.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-green-500 shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Green routes for sustainable travel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-green-500 shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Personalized recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-green-500 shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Real-time weather updates</span>
                  </li>
                </ul>
              </div>

              {/* Feature 2 */}
              <div className="bg-background rounded-lg p-6 shadow-md">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI Chatbot</h3>
                <p className="text-muted-foreground mb-4">
                  Get instant answers and recommendations from our AI-powered chatbot using Gemini API.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-green-500 shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Ask for local recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-green-500 shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Get detailed information about attractions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-green-500 shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Available 24/7 for your questions</span>
                  </li>
                </ul>
              </div>

              {/* Feature 3 */}
              <div className="bg-background rounded-lg p-6 shadow-md">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Event Calendar</h3>
                <p className="text-muted-foreground mb-4">
                  Stay updated with local events, festivals, and community activities in real-time.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-green-500 shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Local festivals and celebrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-green-500 shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Beach cleanups and eco-activities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-green-500 shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Community gatherings and markets</span>
                  </li>
                </ul>
              </div>

              {/* Extra Feature */}
              <div className="bg-background rounded-lg p-6 shadow-md md:col-span-2 lg:col-span-1">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Info className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Beach Rules & Best Practices</h3>
                <p className="text-muted-foreground mb-4">
                  Promoting responsible tourism with local guidelines and best practices for beach visitors.
                </p>
                <div className="bg-primary/5 rounded-lg p-4">
                  <p className="text-sm italic">
                    "Juanito helps visitors respect our beautiful beaches while enjoying everything San Juan has to
                    offer."
                  </p>
                  <p className="text-sm font-medium mt-2">— Local Tourism Office</p>
                </div>
              </div>

              {/* Additional Features */}
              <div className="bg-background rounded-lg p-6 shadow-md">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Cloud className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Weather Updates</h3>
                <p className="text-muted-foreground mb-4">
                  Get real-time weather information with beautiful visuals to plan your perfect beach day.
                </p>
                <div className="flex items-center justify-center">
                  <Image
                    src="/weather.png"
                    alt="Weather UI"
                    width={240}
                    height={120}
                    className="rounded-md shadow"
                  />
                </div>
              </div>

              <div className="bg-background rounded-lg p-6 shadow-md">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Local Products</h3>
                <p className="text-muted-foreground mb-4">
                  Discover and support local artisans, food producers, and businesses in San Juan.
                </p>
                <Button variant="outline" className="w-full">
                  Explore Local Products
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Juanito?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Experience San Juan, Batangas in a more meaningful and sustainable way.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src="/logo.jpg"
                  alt="Sustainable Tourism"
                  width={500}
                  height={500}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Sustainable Tourism</h3>
                  <p className="text-muted-foreground">
                    Our green routes and eco-friendly recommendations help preserve San Juan's natural beauty for
                    generations to come.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Support Local Communities</h3>
                  <p className="text-muted-foreground">
                    By promoting local products and businesses, Juanito helps support the livelihoods of San Juan
                    residents.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Authentic Experiences</h3>
                  <p className="text-muted-foreground">
                    Discover hidden gems and authentic experiences that go beyond typical tourist attractions.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Convenience</h3>
                  <p className="text-muted-foreground">
                    All the information you need in one place, available offline for when connectivity is limited.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-muted py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Travelers Say</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Hear from travelers who have explored San Juan with Juanito.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold">MR</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold">Maria Rodriguez</h4>
                    <p className="text-sm text-muted-foreground">Manila, Philippines</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">
                  "Juanito helped me discover beautiful hidden beaches I would have never found on my own. The AI
                  chatbot was like having a local friend guiding me!"
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5 text-yellow-500"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              </div>

              <div className="bg-background rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold">JT</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold">John Thompson</h4>
                    <p className="text-sm text-muted-foreground">Sydney, Australia</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">
                  "The interactive map made navigating San Juan so easy. I loved the green routes that took me through
                  scenic paths while being environmentally conscious."
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5 text-yellow-500"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              </div>

              <div className="bg-background rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold">LK</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold">Lisa Kim</h4>
                    <p className="text-sm text-muted-foreground">Seoul, South Korea</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">
                  "Thanks to Juanito's event calendar, I was able to participate in a local festival that became the
                  highlight of my trip. The beach guidelines were also very helpful!"
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill={i < 4 ? "currentColor" : "none"}
                      stroke={i >= 4 ? "currentColor" : "none"}
                      strokeWidth="2"
                      className="h-5 w-5 text-yellow-500"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Download Section */}
        <section id="download" className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20" />
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Explore San Juan?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Visit Juanito now and start your adventure in San Juan, Batangas with a local perspective.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                <Button size="lg" className="gap-2" onClick={() => router.push("/")}>
                  <span>Get Started</span>
                </Button>
              </div>
              <div className="flex justify-center space-x-8">
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Juanito</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Your personal travel companion for exploring San Juan, Batangas in a sustainable and authentic way.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-primary">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#benefits" className="text-muted-foreground hover:text-primary">
                    Benefits
                  </Link>
                </li>
                <li>
                  <Link href="#download" className="text-muted-foreground hover:text-primary">
                    Download
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>+63 123 456 7890</span>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span>info@juanito.app</span>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>San Juan, Batangas, Philippines</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Juanito App. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

