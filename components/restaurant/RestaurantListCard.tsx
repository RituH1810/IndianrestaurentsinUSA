import Link from 'next/link';
import Image from 'next/image';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { HiddenGemBadge } from '@/components/ui/HiddenGemBadge';
import { parseTags, formatReviews, truncate } from '@/lib/utils';
import { getCuisineLabel, getDietaryLabel } from '@/lib/taxonomy';
import type { RestaurantListData } from '@/lib/types';

interface Props {
  restaurant: RestaurantListData;
  rank?: number;
}

export function RestaurantListCard({ restaurant, rank }: Props) {
  const cuisineTags = parseTags(restaurant.cuisine_tags);
  const dietaryTags = parseTags(restaurant.dietary_tags);
  const isOpen = restaurant.business_status === 'OPERATIONAL';

  return (
    <div className="py-5 flex gap-4 items-start group hover:bg-gray-50/60 -mx-4 px-4 rounded-xl transition-colors">
      {/* Rank number */}
      {rank != null && (
        <div className="flex-shrink-0 w-8 pt-1 text-right">
          <span className="text-sm font-bold text-gray-300">#{rank}</span>
        </div>
      )}

      {/* Photo */}
      <div className="flex-shrink-0 relative w-28 h-24 rounded-xl overflow-hidden bg-gray-100">
        {restaurant.photo ? (
          <Image
            src={restaurant.photo}
            alt={restaurant.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
            sizes="112px"
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gradient-to-br from-cream to-saffron/10">
            <span className="text-2xl opacity-20 select-none" aria-hidden="true">🍛</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/restaurants/${restaurant.slug}`}
              className="font-bold text-gray-900 hover:text-spice transition-colors text-[15px] line-clamp-1"
            >
              {restaurant.name}
            </Link>
            <p className="text-xs text-gray-400 mt-0.5">
              {restaurant.city}, {restaurant.state}
            </p>
          </div>
          {restaurant.is_hidden_gem && (
            <div className="flex-shrink-0">
              <HiddenGemBadge />
            </div>
          )}
        </div>

        {/* Rating row */}
        {(restaurant.rating != null || restaurant.reviews != null) && (
          <div className="flex items-center gap-2 mt-1.5">
            {restaurant.rating != null && <StarRating rating={restaurant.rating} />}
            {restaurant.reviews != null && (
              <span className="text-xs text-gray-400">{formatReviews(restaurant.reviews)} reviews</span>
            )}
          </div>
        )}

        {/* Badges */}
        {(cuisineTags.length > 0 || dietaryTags.length > 0) && (
          <div className="flex flex-wrap gap-1 mt-2">
            {cuisineTags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="cuisine">{getCuisineLabel(tag)}</Badge>
            ))}
            {dietaryTags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="dietary">{getDietaryLabel(tag)}</Badge>
            ))}
          </div>
        )}

        {/* Description */}
        {restaurant.description && (
          <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed max-w-xl">
            {truncate(restaurant.description, 160)}
          </p>
        )}

        {/* Status + contact */}
        <div className="flex flex-wrap items-center gap-3 mt-2">
          {restaurant.business_status && (
            <span className={`text-xs font-semibold ${isOpen ? 'text-emerald-600' : 'text-red-500'}`}>
              ● {isOpen ? 'Open' : 'Closed'}
            </span>
          )}
          {restaurant.phone && (
            <a
              href={`tel:${restaurant.phone}`}
              className="text-xs text-gray-400 hover:text-spice transition-colors"
              onClick={e => e.stopPropagation()}
            >
              {restaurant.phone}
            </a>
          )}
          {restaurant.website && (
            <a
              href={restaurant.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-spice hover:underline font-medium"
              onClick={e => e.stopPropagation()}
            >
              Visit Website →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
