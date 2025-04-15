import React from 'react';
import { Link } from 'wouter';
import { Category } from '@/lib/schema';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.id}`}>
      <a className="block group">
        <div className="relative overflow-hidden rounded-lg bg-gray-100 transition-all duration-300 group-hover:shadow-md">
          <div className="aspect-square w-full bg-gray-200 flex items-center justify-center">
            <span className="text-4xl text-gray-400">📁</span>
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 transition-opacity duration-300 group-hover:bg-opacity-10"></div>
        </div>
        <div className="mt-3 text-center">
          <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
          {category.description && (
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">{category.description}</p>
          )}
        </div>
      </a>
    </Link>
  );
}
