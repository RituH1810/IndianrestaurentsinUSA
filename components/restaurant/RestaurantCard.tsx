import Link from 'next/link';
import Image from 'next/image';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { HiddenGemBadge } from '@/components/ui/HiddenGemBadge';
import { parseTags, formatReviews, truncate } from '@/lib/utils';
import { getCuisineLabel, getDietaryLabel } from '@/lib/taxonomy';
import type { RestaurantCardData } from '@/lib/types';

interface Props {
  restaurant: RestaurantCardData;
}

export function RestaurantCard({ restaurant }: Props) {
  const cuisineTags = parseTags(restaurant.cuisine_tags);
  const dietaryTags = parseTags(restaurant.dietary_tags);

  return (
    <Link
      href={`/restaurants/${restaurant.slug}`}
      className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
    >
      <div className="relative h-48 bg-gray-100">
        {restaurant.photo ? (
          <Image
            src={restaurant.photo}
            alt={restaurant.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-cream">
            <span className="text-5xl opacity-30" aria-hidden="true">🍛</span>
          </div>
        )}
        {restaurant.is_hidden_gem && (
          <div className="absolute top-2 right-2">
            <HiddenGemBadge />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-spice transition-colors line-clamp-1">
          {restaurant.name}
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">
          {restaurant.city}, {restaurant.state}
        </p>

        {(restaurant.rating != null || restaurant.reviews != null) && (
          <div className="flex items-center gap-2 mt-2">
            {restaurant.rating != null && <StarRating rating={restaurant.rating} />}
            {restaurant.reviews != null && (
              <span className="text-xs text-gray-500">({formatReviews(restaurant.reviews)})</span>
            )}
          </div>
        )}

        {restaurant.description && (
          <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
            {truncate(restaurant.description, 120)}
          </p>
        )}

        {cuisineTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {cuisineTags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="cuisine">{getCuisineLabel(tag)}</Badge>
            ))}
          </div>
        )}

        {dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {dietaryTags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="dietary">{getDietaryLabel(tag)}</Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
