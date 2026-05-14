'use client';

import { useChatRail } from '@/components/chat/ChatRailContext';
import { ProductCard } from './ProductCard';

interface Props {
  slug: string;
  imageSrc: string;
  because?: string;
  becauseVariant?: 'green' | 'purple';
  name: string;
  price: string;
  strikePrice?: string;
  badge?: string;
  imageHeight?: number;
}

/**
 * Client wrapper around ProductCard that wires the whole card into the chat
 * rail's cart. Clicking anywhere on the card calls addProductToCart(slug),
 * which routes through the same confirmation flow as the inline chat
 * product cards (adds + drops a "✓ added" assistant message).
 */
export function CatalogProductCard({ slug, ...rest }: Props) {
  const { addProductToCart } = useChatRail();
  return (
    <button
      onClick={() => addProductToCart(slug)}
      className="text-left block w-full"
      aria-label={`Add ${rest.name} to cart`}
    >
      <ProductCard {...rest} />
    </button>
  );
}
