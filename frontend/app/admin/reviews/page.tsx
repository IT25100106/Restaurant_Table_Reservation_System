'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/toast-notification';
import { getAllReviews, deleteReview, getAverageRating } from '@/lib/storage';
import type { ReviewDTO } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Star, Search, Filter, Trash2, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminReviewsPage() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<ReviewDTO[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [averageRating, setAverageRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [searchQuery, ratingFilter, reviews]);

  const loadReviews = async () => {
    const allReviews = await getAllReviews();
    setReviews(allReviews);
    setFilteredReviews(allReviews);
    const avg = await getAverageRating();
    setAverageRating(avg);
    setIsLoading(false);
  };

  const filterReviews = () => {
    let filtered = [...reviews];

    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.comment.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (ratingFilter !== 'all') {
      filtered = filtered.filter((r) => r.rating === parseInt(ratingFilter));
    }

    setFilteredReviews(filtered);
  };

  const handleDelete = async(reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      const result = await deleteReview(reviewId);
      if (result.success) {
        showToast('Review deleted', 'success');
        loadReviews();
      } else {
        showToast(result.message, 'error');
      }
    }
  };

  const StarRating = ({ value }: { value: number }) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              'h-4 w-4',
              star <= value ? 'fill-warning text-warning' : 'text-muted-foreground'
            )}
          />
        ))}
      </div>
    );
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      distribution[r.rating - 1]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Reviews</h1>
        <p className="mt-2 text-muted-foreground">
          Monitor customer feedback and ratings
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-4xl font-bold text-foreground">{averageRating}</div>
            <div className="mt-2">
              <StarRating value={Math.round(averageRating)} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Average Rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-4xl font-bold text-foreground">{reviews.length}</div>
            <p className="mt-2 text-sm text-muted-foreground">Total Reviews</p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2">
          <CardContent className="p-6">
            <h3 className="mb-4 font-medium text-foreground">Rating Distribution</h3>
            <div className="flex flex-col gap-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="w-4 text-sm">{rating}</span>
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-warning transition-all"
                      style={{
                        width: reviews.length > 0
                          ? `${(ratingDistribution[rating - 1] / reviews.length) * 100}%`
                          : '0%',
                      }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm text-muted-foreground">
                    {ratingDistribution[rating - 1]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Star className="mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">No Reviews</h2>
            <p className="mt-2 text-muted-foreground">No reviews found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{review.userName}</h3>
                        <StarRating value={review.rating} />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                      <p className="mt-3 text-foreground">{review.comment}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(review.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
