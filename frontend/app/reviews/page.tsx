'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/toast-notification';
import { getAllReviews, createReview, updateReview, deleteReview, getAverageRating } from '@/lib/storage';
import type { ReviewDTO } from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Star, Plus, Edit, Trash2, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ReviewsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewDTO | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    const allReviews = await getAllReviews();
    setReviews(allReviews);
    const avg = await getAverageRating();
    setAverageRating(avg);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!user) {
      showToast('Please login to submit a review', 'error');
      return;
    }

    if (!comment.trim()) {
      showToast('Please write a comment', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingReview) {
        const result = await updateReview(editingReview.id, { rating, comment });
        if (result.success) {
          showToast('Review updated successfully!', 'success');
        } else {
          showToast(result.message, 'error');
        }
      } else {
        const result = await createReview(user.id, user.name, rating, comment);
        if (result.success) {
          showToast('Review submitted successfully!', 'success');
        } else {
          showToast(result.message, 'error');
        }
      }

      setIsDialogOpen(false);
      resetForm();
      loadReviews();
    } catch {
      showToast('Failed to submit review', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    const result = await deleteReview(reviewId);
    if (result.success) {
      showToast('Review deleted', 'success');
      loadReviews();
    } else {
      showToast(result.message, 'error');
    }
  };

  const startEdit = (review: ReviewDTO) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingReview(null);
    setRating(5);
    setComment('');
  };

  const StarRating = ({
    value,
    onChange,
    readOnly = false,
    size = 'md',
  }: {
    value: number;
    onChange?: (rating: number) => void;
    readOnly?: boolean;
    size?: 'sm' | 'md' | 'lg';
  }) => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(star)}
            className={cn(
              'transition-colors',
              !readOnly && 'cursor-pointer hover:scale-110'
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                star <= value
                  ? 'fill-warning text-warning'
                  : 'text-muted-foreground'
              )}
            />
          </button>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reviews</h1>
          <p className="mt-2 text-muted-foreground">
            See what our guests are saying
          </p>
        </div>

        {user && (
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Write a Review
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingReview ? 'Edit Your Review' : 'Write a Review'}
                </DialogTitle>
                <DialogDescription>
                  Share your dining experience with others
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <Label>Your Rating</Label>
                  <StarRating value={rating} onChange={setRating} size="lg" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="comment">Your Review</Label>
                  <Textarea
                    id="comment"
                    placeholder="Tell us about your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : editingReview ? (
                    'Update Review'
                  ) : (
                    'Submit Review'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Average Rating */}
      {reviews.length > 0 && (
        <Card className="mb-8">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-8 sm:flex-row sm:gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-foreground">{averageRating}</div>
              <p className="text-sm text-muted-foreground">out of 5</p>
            </div>
            <div className="flex flex-col items-center gap-2 sm:items-start">
              <StarRating value={Math.round(averageRating)} readOnly size="lg" />
              <p className="text-sm text-muted-foreground">
                Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Star className="mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">No Reviews Yet</h2>
            <p className="mt-2 text-muted-foreground">
              Be the first to share your experience!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{review.userName}</CardTitle>
                      <CardDescription>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating value={review.rating} readOnly size="sm" />
                    {user && user.id === review.userId && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => startEdit(review)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(review.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
