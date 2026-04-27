import candle from "@/assets/product-candle.jpg";
import journal from "@/assets/product-journal.jpg";
import bouquet from "@/assets/product-bouquet.jpg";
import mug from "@/assets/product-mug.jpg";
import necklace from "@/assets/product-necklace.jpg";
import chocolate from "@/assets/product-chocolate.jpg";
import plant from "@/assets/product-plant.jpg";

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  compareAt?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  bestseller?: boolean;
  details: string[];
}

export const products: Product[] = [
  {
    id: "lumen-candle",
    name: "Lumen Soy Candle",
    tagline: "Hand-poured in small batches",
    description:
      "A warm, slow-burning soy wax candle scented with notes of bergamot, cedar, and white tea. Each candle is hand-poured into a frosted glass vessel that doubles as a keepsake.",
    price: 38,
    compareAt: 48,
    image: candle,
    category: "Home",
    rating: 4.9,
    reviews: 218,
    bestseller: true,
    details: ["50 hour burn time", "100% soy wax", "Cotton wick", "8 oz vessel"],
  },
  {
    id: "atelier-journal",
    name: "Atelier Leather Journal",
    tagline: "Full-grain leather, ribbon bookmark",
    description:
      "A heirloom-quality journal bound in supple full-grain leather. 240 pages of cream-colored, fountain-pen friendly paper.",
    price: 64,
    image: journal,
    category: "Stationery",
    rating: 4.8,
    reviews: 142,
    bestseller: true,
    details: ["240 cream pages", "Full-grain leather", "Lay-flat binding", "Ribbon bookmark"],
  },
  {
    id: "wildflower-bouquet",
    name: "Wildflower Posy",
    tagline: "Sun-dried, lasts a year",
    description:
      "A hand-tied posy of wildflowers gently dried in the studio. Wrapped in unbleached kraft paper and twine — a quiet, lasting bloom.",
    price: 52,
    image: bouquet,
    category: "Florals",
    rating: 4.7,
    reviews: 96,
    details: ["Naturally air-dried", "Kraft wrap & twine", "Lasts 12+ months", "30 cm tall"],
  },
  {
    id: "sage-mug",
    name: "Sage Stoneware Mug",
    tagline: "Glazed by hand",
    description:
      "A weighty, ceramic mug glazed in soft sage. Each piece carries the gentle marks of hand-finishing.",
    price: 28,
    image: mug,
    category: "Home",
    rating: 4.9,
    reviews: 311,
    bestseller: true,
    details: ["12 oz capacity", "Hand-glazed stoneware", "Dishwasher safe", "Pairs well with chocolate"],
  },
  {
    id: "pearl-necklace",
    name: "Single Pearl Necklace",
    tagline: "14k gold-fill chain",
    description:
      "A delicate freshwater pearl suspended on a 14k gold-fill chain. Quietly elegant, made to be layered or worn alone.",
    price: 128,
    compareAt: 160,
    image: necklace,
    category: "Jewelry",
    rating: 5.0,
    reviews: 87,
    bestseller: true,
    details: ["14k gold-fill chain", "Freshwater pearl", "16-18 inch adjustable", "Comes gift-boxed"],
  },
  {
    id: "noir-truffles",
    name: "Noir Truffle Box",
    tagline: "12 single-origin truffles",
    description:
      "Twelve hand-rolled truffles from single-origin cacao — dark, milk, and a few unexpected flavors. Presented in a satin-ribboned gift box.",
    price: 42,
    image: chocolate,
    category: "Edible",
    rating: 4.8,
    reviews: 174,
    details: ["12 piece selection", "Single-origin cacao", "Vegan options included", "Best within 3 weeks"],
  },
  {
    id: "petit-succulent",
    name: "Petit Succulent",
    tagline: "In a terracotta vessel",
    description:
      "A small living gift — a hardy succulent potted in a terracotta vessel. Travels well and asks for very little.",
    price: 22,
    image: plant,
    category: "Plants",
    rating: 4.6,
    reviews: 203,
    details: ["Terracotta pot", "Care card included", "Low light tolerant", "Water monthly"],
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const bestsellers = products.filter((p) => p.bestseller);
