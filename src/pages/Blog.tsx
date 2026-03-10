import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: "1",
    title: "How to Choose the Right Dog Breed for Your Family",
    excerpt: "A comprehensive guide to selecting a dog breed that matches your lifestyle, living space, and family dynamics.",
    date: "March 5, 2026",
    category: "Dogs",
  },
  {
    id: "2",
    title: "Essential Vaccination Guide for Puppies in India",
    excerpt: "Everything you need to know about puppy vaccinations, schedules, and why they matter for your pet's health.",
    date: "February 28, 2026",
    category: "Health",
  },
  {
    id: "3",
    title: "Cat Care 101: A First-Time Owner's Complete Guide",
    excerpt: "From nutrition to grooming, learn the basics of caring for your new feline companion.",
    date: "February 20, 2026",
    category: "Cats",
  },
  {
    id: "4",
    title: "Understanding Pet Quality vs Show Quality Dogs",
    excerpt: "What do these terms mean, and which is right for you? We break down the differences.",
    date: "February 15, 2026",
    category: "Dogs",
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-display text-4xl mb-3">Pet Care Blog</h1>
        <p className="text-muted-foreground mb-10">Expert advice for pet parents across India</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-card rounded-lg border border-border shadow-card p-6 hover:shadow-card-hover transition-shadow"
            >
              <span className="inline-block px-2.5 py-1 bg-badge text-badge-foreground text-[11px] font-semibold rounded-md mb-3">
                {post.category}
              </span>
              <h2 className="font-display text-xl mb-2">{post.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.date}
                </span>
                <Link
                  to="#"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Read More <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
