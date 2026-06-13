import Link from 'next/link';
import Image from 'next/image';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { HiddenGemBadge } from '@/components/ui/HiddenGemBadge';
import { parseTags, formatReviews } from '@/lib/utils';
import { getCuisineLabel, getDietaryLabel } from '@/lib/taxonomy';
import type { RestaurantCardData } from '@/lib/types';

interface Props {
  restaurant: RestaurantCardData;
}

export function RestaurantCard({ restaurant }: Props) {
  const cuisineTags = parseTags(restaurant.cuisine_tags);
  const dietaryTags = parseTags(restaurant.dietary_tags);
  const hasPhoto = Boolean(restaurant.photo);

  return (
    <Link
      href={`/restaurants/${restaurant.slug}`}
      className="group block bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-saffron hover:shadow-md transition-all duration-200"
    >
      {/* Photo */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        {hasPhoto ? (
          <>
            <Image
              src={restaurant.photo!}
              alt={restaurant.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
            {/* Name overlaid on photo */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pt-10 pb-3 px-4">
              <h3 className="font-bold text-white text-sm line-clamp-1 leading-snug">
                {restaurant.name}
              </h3>
              <p className="text-xs text-white/70 mt-0.5">
                {restaurant.city}, {restaurant.state}
              </p>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-50">
            <span className="text-5xl opacity-20 select-none" aria-hidden="true">🍛</span>
          </div>
        )}

        {restaurant.is_hidden_gem && (
          <div className="absolute top-2.5 right-2.5">
            <HiddenGemBadge />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {!hasPhoto && (
          <>
            <h3 className="font-semibold text-gray-900 group-hover:text-spice transition-colors line-clamp-1 text-sm">
              {restaurant.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {restaurant.city}, {restaurant.state}
            </p>
          </>
        )}

        {(restaurant.rating != null || restaurant.reviews != null) && (
          <div className="flex items-center gap-2 mt-2">
            {restaurant.rating != null && <StarRating rating={restaurant.rating} />}
            {restaurant.reviews != null && (
              <span className="text-xs text-gray-400">({formatReviews(restaurant.reviews)})</span>
            )}
          </div>
        )}

        {cuisineTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {cuisineTags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="cuisine">{getCuisineLabel(tag)}</Badge>
            ))}
          </div>
        )}

        {dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {dietaryTags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="dietary">{getDietaryLabel(tag)}</Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
