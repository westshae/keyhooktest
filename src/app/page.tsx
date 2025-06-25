import Link from 'next/link';
import { Calendar, Clock, Users, Building2, ArrowRight, Database, Code, Zap, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Shae&apos;s Keyhook Coding Test
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              A property management viewing scheduler Proof of Concept.
            </p>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Explanation of features and techstack below.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/availability" 
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg shadow-glow hover:shadow-glow-purple transition-all duration-300 hover:scale-105"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Manage Availability
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/book" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-slate-800 text-foreground border-2 border-primary/20 rounded-xl font-semibold text-lg hover:border-primary/40 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Clock className="mr-2 h-5 w-5" />
                Book Viewing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Key Features of This Property Management System
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with modern web technologies to demonstrate full-stack development capabilities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Interactive Calendar Grid</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Drag-and-drop interface for creating and managing availability slots. Visual 15-minute time blocks with real-time updates.
                </p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 border border-border/50 hover:border-green-500/30 transition-all duration-300 hover:shadow-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Real-time Booking System</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Tenants can view available slots and book viewings instantly. Automatic conflict prevention and booking confirmation.
                </p>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 border border-border/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Tenant Management</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Pre-configured tenant profiles to emulate multiple tenants booking at a time. This is to demonstrate multiple tenants without auth.
                </p>
              </div>
            </div>

            {/* Feature Card 4 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 border border-border/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">SQLite Database</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Persistent data storage with Drizzle ORM. Automatic schema migrations and type-safe database operations.
                </p>
              </div>
            </div>

            {/* Feature Card 5 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 border border-border/50 hover:border-orange-500/30 transition-all duration-300 hover:shadow-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">RESTful API</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Clean API endpoints for availability and booking management. Proper error handling and data validation.
                </p>
              </div>
            </div>

            {/* Feature Card 6 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 border border-border/50 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Type Safety</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Full TypeScript implementation with Zod validation. End-to-end type safety from database to UI components.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Stack Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Built With Modern Technologies</h2>
            <p className="text-lg text-muted-foreground">
              This project demonstrates proficiency with current web development best practices
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Frontend Technologies */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                    <Code className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Frontend Stack</h3>
                </div>
                <ul className="text-muted-foreground space-y-2 mb-6">
                  <li>Next.js 15 with App Router</li>
                  <li>React 19 with TypeScript</li>
                  <li>Tailwind CSS for styling</li>
                  <li>Radix UI components</li>
                  <li>Lucide React icons</li>
                </ul>
              </div>
            </div>

            {/* Backend Technologies */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                    <Database className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Backend Stack</h3>
                </div>
                <ul className="text-muted-foreground space-y-2 mb-6">
                  <li>SQLite with Drizzle ORM</li>
                  <li>Next.js API routes</li>
                  <li>Zod for validation</li>
                  <li>Type-safe database operations</li>
                  <li>RESTful API design</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Instructions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How to Test the System</h2>
            <p className="text-lg text-muted-foreground">
              Follow these steps to explore the full functionality
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Property Manager Flow */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/20 hover:border-primary/40 transition-all duration-300">
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-4">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Property Manager</h3>
                </div>
                <ol className="text-muted-foreground space-y-2 mb-6">
                  <li>1. Click &quot;Manage Availability&quot;</li>
                  <li>2. Click &quot;Edit&quot; to add or remove availability slots.</li>
                  <li>3. Dragging click to create new slots for viewings.</li>
                  <li>4. View current bookings and delete them, with confirmations.</li>
                  <li>5. Save changes to persist data.</li>
                </ol>
                <Link 
                  href="/availability"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors duration-200"
                >
                  Start Managing Availability
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Tenant Flow */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/5 to-blue-500/5 border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Tenant</h3>
                </div>
                <ol className="text-muted-foreground space-y-2 mb-6">
                  <li>1. Click &quot;Book Viewing&quot;</li>
                  <li>2. Select a tenant from the dropdown</li>
                  <li>3. Browse available time slots</li>
                  <li>4. Click on a slot to book it</li>
                  <li>5. Confirm the booking.</li>
                  <li>6. Go back to the booking page and select a new tenant to trial multiple tenants.</li>
                  <li>7. Go back to the availability page and view the bookings and manage them there.</li>
                </ol>
                <Link 
                  href="/book"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors duration-200"
                >
                  Start Booking Process
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground mb-2">
            © 2025 Shae&apos;s Keyhook Coding Test. Property Management Viewing Booking System Demo.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with Next.js, TypeScript, Tailwind CSS, and SQLite. Demonstrates full-stack development capabilities.
          </p>
        </div>
      </footer>
    </div>
  );
}
