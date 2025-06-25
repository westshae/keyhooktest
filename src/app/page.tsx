import Link from 'next/link';
import { Calendar, Clock, Users, Building2, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Property Management
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Streamline your property viewings with our intuitive scheduling system
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
              Everything you need for property management
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From scheduling viewings to managing tenant bookings, we&apos;ve got you covered
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
                <h3 className="text-xl font-semibold text-foreground mb-3">Smart Scheduling</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Create and manage availability slots with our intuitive drag-and-drop interface. Perfect for property managers.
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
                <h3 className="text-xl font-semibold text-foreground mb-3">Easy Booking</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Tenants can easily book viewings with just a few clicks. Real-time availability updates ensure no double bookings.
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
                  Keep track of all your tenants and their bookings in one place. Manage multiple properties effortlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Get Started Today</h2>
            <p className="text-lg text-muted-foreground">
              Choose your role and start managing your property viewings
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Property Manager Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/20 hover:border-primary/40 transition-all duration-300">
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-4">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Property Manager</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Set up availability slots, manage bookings, and oversee all property viewings from one dashboard.
                </p>
                <Link 
                  href="/availability"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors duration-200"
                >
                  Manage Availability
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Tenant Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/5 to-blue-500/5 border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Tenant</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Browse available viewing slots and book appointments that work with your schedule.
                </p>
                <Link 
                  href="/book"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors duration-200"
                >
                  Book Viewing
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
          <p className="text-muted-foreground">
            © 2024 Property Management System. Built with modern web technologies.
          </p>
        </div>
      </footer>
    </div>
  );
}
