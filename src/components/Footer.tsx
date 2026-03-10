import { Link } from "react-router-dom";
import { Dog } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Dog className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg">PawTrust</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              India's trusted pet marketplace. Connecting loving homes with healthy, verified pets across the country.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm mb-3">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/dogs" className="block text-sm text-muted-foreground hover:text-foreground">Dogs for Sale</Link>
              <Link to="/cats" className="block text-sm text-muted-foreground hover:text-foreground">Cats for Sale</Link>
              <Link to="/blog" className="block text-sm text-muted-foreground hover:text-foreground">Pet Care Blog</Link>
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-foreground">About Us</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm mb-3">For Breeders</h4>
            <div className="space-y-2">
              <Link to="/seller/register" className="block text-sm text-muted-foreground hover:text-foreground">Register as Seller</Link>
              <Link to="/seller/dashboard" className="block text-sm text-muted-foreground hover:text-foreground">Seller Dashboard</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm mb-3">Support</h4>
            <div className="space-y-2">
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground">Contact Us</Link>
              <span className="block text-sm text-muted-foreground">support@pawtrust.in</span>
              <span className="block text-sm text-muted-foreground">+91 99999 99999</span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PawTrust. All rights reserved. India's Trusted Pet Marketplace.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
