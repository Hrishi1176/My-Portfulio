"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote, Plus, ShieldCheck, Loader2, Sparkles } from "lucide-react";
import { ToastNotification } from "@/components/common/ToastNotification";
import { SectionHeader, Dialog, Input, Textarea, Button } from "@/components/ui";
import { TiltCard } from "@/components/3d/TiltCard";

export interface Review {
  _id: string;
  clientName: string;
  clientRole: string;
  company: string;
  rating: number;
  reviewText: string;
  createdAt?: string;
  isVerified?: boolean;
}

interface ReviewsProps {
  initialReviews?: Review[];
}

export function Reviews({ initialReviews }: ReviewsProps = {}) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(!initialReviews || initialReviews.length === 0);
  const [showToast, setShowToast] = useState(false);

  // Form State
  const [newReview, setNewReview] = useState({
    clientName: "",
    clientRole: "",
    company: "",
    rating: 5,
    reviewText: "",
  });

  const [submitStatus, setSubmitStatus] = useState<{
    submitting: boolean;
    success: boolean | null;
    message: string;
  }>({
    submitting: false,
    success: null,
    message: "",
  });

  // Fetch real reviews from MongoDB API
  useEffect(() => {
    let ignore = false;
    const loadReviews = async () => {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();
        if (!ignore && data.reviews) {
          setReviews(data.reviews);
        }
      } catch (err) {
        console.error("Error loading reviews from database:", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadReviews();
    return () => {
      ignore = true;
    };
  }, []);

  // Auto-play slider
  useEffect(() => {
    if (reviews.length <= 1 || isModalOpen) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [reviews.length, isModalOpen]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ submitting: true, success: null, message: "" });

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitStatus({
          submitting: false,
          success: true,
          message: "Thank you! Your testimonial has been published successfully.",
        });
        setShowToast(true);

        // Add new review dynamically to state and display it
        if (data.review) {
          setReviews((prev) => [data.review, ...prev]);
          setCurrentIndex(0);
        }

        setTimeout(() => {
          setIsModalOpen(false);
          setNewReview({
            clientName: "",
            clientRole: "",
            company: "",
            rating: 5,
            reviewText: "",
          });
        }, 1200);
      } else {
        setSubmitStatus({
          submitting: false,
          success: false,
          message: data.error || "Failed to publish review.",
        });
        setShowToast(true);
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus({
        submitting: false,
        success: false,
        message: "Network error submitting review.",
      });
      setShowToast(true);
    }
  };

  const currentReview = reviews[currentIndex];

  return (
    <section id="reviews" className="scroll-mt-24 py-16 sm:py-20 relative">
      {/* ── Reusable Toast Notification Component ── */}
      <ToastNotification
        show={showToast}
        type={submitStatus.success ? "success" : "error"}
        title={submitStatus.success ? "Review Published!" : "Submission Alert"}
        message={submitStatus.message}
        onClose={() => setShowToast(false)}
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65 }}
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <SectionHeader
            number="06."
            badge="Testimonials & Endorsements"
            title="Topping Out ·"
            gradientText="Client Reviews"
            className="mb-0 sm:mb-0"
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Write a Review
          </Button>
        </div>

        {/* Carousel Container */}
        <div className="p-4 sm:p-8 lg:p-10 relative overflow-hidden min-h-[300px] flex flex-col justify-between">

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500 mb-3" />
              <p className="text-xs text-slate-500">Fetching reviews from database...</p>
            </div>
          ) : reviews.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center py-12 px-4 space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
                <Sparkles className="h-7 w-7" />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Be the First Client to Leave a Review!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Have we worked together on a project? Share your experience and your review will appear live on this slider.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => setIsModalOpen(true)}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Submit Your Review
              </Button>
            </div>
          ) : currentReview ? (
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentReview._id || currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_e, { offset, velocity }) => {
                    const swipe = Math.abs(offset.x) * velocity.x;
                    if (swipe < -8000 || offset.x < -60) {
                      handleNext();
                    } else if (swipe > 8000 || offset.x > 60) {
                      handlePrev();
                    }
                  }}
                  className="space-y-6 cursor-grab active:cursor-grabbing touch-pan-y select-none"
                >
                  <TiltCard maxTilt={5} perspective={1000} scale={1} glareEffect={false}>
                    <div className="space-y-6">
                      {/* Top Bar: Quote icon & Star Rating */}
                      <div className="flex items-center justify-between">
                        <Quote className="h-10 w-10 text-purple-500/40" />

                        <div className="flex items-center gap-1.5">
                          {[...Array(5)].map((_, starIdx) => (
                            <Star
                              key={starIdx}
                              className={`h-5 w-5 ${starIdx < currentReview.rating
                                  ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                                  : "text-slate-300 dark:text-slate-700"
                                }`}
                            />
                          ))}
                          <span className="ml-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                            {currentReview.rating}.0
                          </span>
                        </div>
                      </div>

                      {/* Review Text */}
                      <p className="text-base sm:text-lg lg:text-xl font-medium leading-relaxed text-slate-700 dark:text-slate-200 italic">
                        &quot;{currentReview.reviewText}&quot;
                      </p>

                      {/* Client Info Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pt-4 border-t border-[var(--border)]">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white font-black text-base sm:text-lg shadow-md">
                            {currentReview.clientName.charAt(0)}
                          </div>

                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <span>{currentReview.clientName}</span>
                              {currentReview.isVerified && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  <ShieldCheck className="h-3 w-3" /> Verified
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {currentReview.clientRole} {currentReview.company ? `• ${currentReview.company}` : ""}
                            </div>
                          </div>
                        </div>

                        {/* Navigation Controls */}
                        {reviews.length > 1 && (
                          <div className="flex items-center justify-end gap-2 shrink-0">
                            <button
                              suppressHydrationWarning
                              onClick={handlePrev}
                              aria-label="Previous review"
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-white/70 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 hover:bg-purple-500 hover:text-white dark:hover:bg-purple-600 transition-colors shadow-sm cursor-pointer"
                            >
                              <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                              suppressHydrationWarning
                              onClick={handleNext}
                              aria-label="Next review"
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-white/70 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 hover:bg-purple-500 hover:text-white dark:hover:bg-purple-600 transition-colors shadow-sm cursor-pointer"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              </AnimatePresence>

              {/* Slider Pagination Dots */}
              {reviews.length > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {reviews.map((_, dotIdx) => (
                    <button
                      suppressHydrationWarning
                      key={dotIdx}
                      onClick={() => setCurrentIndex(dotIdx)}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 ${dotIdx === currentIndex
                          ? "w-8 bg-purple-500"
                          : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-purple-300"
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </motion.div>

      {/* ── Submit Review Modal ── */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Client Testimonial"
        description="Share your authentic feedback or project testimonial."
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <Input
            label="Your Name *"
            required
            placeholder="e.g. Alex Morgan"
            value={newReview.clientName}
            onChange={(e) => setNewReview({ ...newReview, clientName: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Role / Title"
              placeholder="e.g. CTO / Product Lead"
              value={newReview.clientRole}
              onChange={(e) => setNewReview({ ...newReview, clientRole: e.target.value })}
            />
            <Input
              label="Company / Org"
              placeholder="e.g. TechCorp Solutions"
              value={newReview.company}
              onChange={(e) => setNewReview({ ...newReview, company: e.target.value })}
            />
          </div>

          {/* Rating Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center gap-1 sm:gap-2">
              {[1, 2, 3, 4, 5].map((starNum) => (
                <button
                  suppressHydrationWarning
                  key={starNum}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: starNum })}
                  className="p-2 sm:p-1.5 min-w-[38px] min-h-[38px] flex items-center justify-center text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                  aria-label={`Rate ${starNum} stars`}
                >
                  <Star
                    className={`h-6 w-6 ${starNum <= newReview.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300 dark:text-slate-700"
                      }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-bold text-amber-400">
                {newReview.rating} Stars
              </span>
            </div>
          </div>

          {/* Review Message */}
          <Textarea
            label="Your Testimonial / Feedback *"
            required
            rows={4}
            placeholder="Share your experience working together..."
            value={newReview.reviewText}
            onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
          />

          {/* Submit button */}
          <Button
            type="submit"
            isLoading={submitStatus.submitting}
            className="w-full mt-2"
          >
            Publish Testimonial
          </Button>
        </form>
      </Dialog>
    </section>
  );
}
